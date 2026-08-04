import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ApiClient, type DomainInstruction, type VerifiedDomain } from '../api.js';
import { ask, confirm, select } from '../prompts.js';
import { log, section, info, success, warn, error, yellow, dim } from '../logger.js';
import { saveConfig, IMPORT_FILE_NAME, resolveApiUrl, type UcsConfig } from '../config.js';
import { analyze } from '../analyzer/index.js';

const DOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export interface SetupFlags {
  apiUrl?: string;
  org?: string;
  email?: string;
  password?: string;
  domain?: string;
  method?: string;
  source?: string;
  yes?: boolean;
  noImport?: boolean;
}

async function login(client: ApiClient, email: string, password: string): Promise<ApiClient> {
  const result = await client.login(email, password);
  return new ApiClient(client.baseUrl, result.accessToken);
}

async function waitForVerification(
  client: ApiClient,
  orgId: string,
  domainId: string,
  method: string,
  maxAttempts = 6,
  delayMs = 5000,
): Promise<VerifiedDomain | null> {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    info(`Checking verification (attempt ${attempt}/${maxAttempts})${attempt > 1 ? ' \u2026' : ''}`);
    try {
      return await client.checkDomain(orgId, domainId, method);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (attempt < maxAttempts) {
        warn(`Not verified yet: ${message}`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        error(`Verification did not complete: ${message}`);
      }
    }
  }
  return null;
}

function printInstructions(claim: DomainInstruction): void {
  section('Add the verification token to your site');
  for (const line of claim.instructions) {
    log(line);
  }
}

function printPreview(result: { model: { pages?: unknown[]; media?: unknown[]; menus?: unknown[]; entities?: unknown } }): void {
  const entities = (result.model.entities ?? {}) as Record<string, unknown[]>;
  section('Analyzed site — review summary');
  log(`${yellow('pages:')}        ${result.model.pages?.length ?? 0}`);
  log(`${yellow('sections:')}     ${(result.model.pages ?? []).reduce((n: number, p) => n + ((p as { sections?: unknown[] }).sections?.length ?? 0), 0)}`);
  log(`${yellow('menus:')}        ${result.model.menus?.length ?? 0}`);
  log(`${yellow('media:')}        ${result.model.media?.length ?? 0}`);
  for (const [key, value] of Object.entries(entities)) {
    log(`${yellow(`${key}:`)}        ${value?.length ?? 0}`);
  }
}

export async function runSetup(flags: SetupFlags): Promise<void> {
  const apiUrl = resolveApiUrl(flags.apiUrl);
  const interactive = !flags.yes;

  section('WebCrm UCS setup');
  log(`API server: ${dim(apiUrl)}`);

  const orgSlug = flags.org || (interactive ? (await ask('Organization slug (from WebCrm admin)', { required: true })) : '');
  if (!orgSlug) throw new Error('Organization slug is required (--org)');
  if (!/^[a-z0-9-]+$/.test(orgSlug)) throw new Error('Organization slug must be lowercase letters, numbers and dashes.');

  // Resolve the org id via the public site endpoint (it returns the org).
  let orgId: string | undefined;
  let siteName: string | undefined;
  try {
    const probe = new ApiClient(apiUrl);
    const site = (await probe.getSite(orgSlug)) as {
      organization?: { id?: string; name?: string; slug?: string };
    };
    orgId = site.organization?.id;
    siteName = site.organization?.name;
  } catch {
    throw new Error(`Organization "${orgSlug}" was not found on the server at ${apiUrl}.`);
  }
  if (!orgId) throw new Error(`Could not resolve an org id for "${orgSlug}".`);

  info(`Found organization: ${siteName ?? orgSlug}`);

  // Admin credentials (used for verification + import).
  const email = flags.email || (interactive ? (await ask('Admin email', { required: true })) : '');
  const password = flags.password || (interactive ? (await ask('Admin password', { secret: true, required: true })) : '');
  if (!email || !password) throw new Error('Admin email and password are required (--email, --password)');

  let client: ApiClient;
  try {
    client = await login(new ApiClient(apiUrl), email, password);
    info('Logged in successfully.');
  } catch (err) {
    throw new Error(`Login failed: ${err instanceof Error ? err.message : err}`);
  }

  // Domain verification.
  let domain: string | undefined;
  let method: string | undefined;
  let domainId: string | undefined;

  if (flags.domain) {
    if (!DOMAIN_RE.test(flags.domain)) throw new Error(`Invalid domain: ${flags.domain}`);
    domain = flags.domain.toLowerCase();
  } else if (interactive) {
    domain = (await ask('Your website domain (e.g. example.org)', { required: true })).toLowerCase();
    if (!DOMAIN_RE.test(domain)) throw new Error('That does not look like a valid domain.');
  }
  if (!domain) throw new Error('Domain is required (--domain)');

  if (flags.method) {
    method = ['META_TAG', 'FILE', 'DNS_TXT'].includes(flags.method.toUpperCase()) ? flags.method.toUpperCase() : undefined;
    if (!method) throw new Error('Invalid method. Use META_TAG, FILE or DNS_TXT.');
  } else if (interactive) {
    method = await select('Verification method', ['META_TAG', 'FILE', 'DNS_TXT']);
  }
  method = method ?? 'META_TAG';

  const claim = await client.claimDomain(orgId, domain, method);
  domainId = claim.id;
  printInstructions(claim);

  if (interactive) {
    await ask('Once added, press Enter to check');
  }

  const verified = await waitForVerification(client, orgId, claim.id, method, flags.yes ? 1 : 6);
  if (!verified || verified.status !== 'VERIFIED') {
    throw new Error('Domain verification did not pass. Check the token and try again with `ucs setup --domain <domain>` to resume.');
  }
  success(`Domain verified: ${domain}`);

  // The verified site key lets future import/pull calls run without an admin session.
  const siteApiKey = verified.apiKey?.key;
  if (siteApiKey) {
    client.apiKey = siteApiKey;
    success('Received site API key — stored for passwordless imports.');
  }

  // Source: live URL or folder.
  let source = flags.source;
  if (!source && interactive) {
    const input = await ask('Site source — URL to crawl or local folder path', { required: true });
    source = input;
  }
  if (!source) throw new Error('Site source is required (--source), e.g. https://example.org or ./public');

  const analysis = await analyze(source, { maxPages: 15 });
  if (analysis.warnings.length > 0) {
    for (const w of analysis.warnings) warn(w);
  }
  printPreview(analysis);

  // Write the import file for review.
  const importFile = path.join(process.cwd(), IMPORT_FILE_NAME);
  await fs.writeFile(importFile, `${JSON.stringify(analysis.model, null, 2)}\n`, 'utf8');
  success(`Analysis saved to ${importFile} (review it, then run \`ucs import ${importFile}\`)`);

  const shouldImport =
    flags.noImport ? false : interactive ? await confirm('Import this site into WebCrm now?', true) : true;

  if (shouldImport) {
    const result = await client.importSite(orgId, analysis.model, 'merge');
    const counts = (result as { counts?: Record<string, unknown> }).counts;
    section('Import complete');
    if (counts) log(JSON.stringify(counts, null, 2));
    success('Your static site content is now in WebCrm.');
  } else {
    info('Skipped import. Run `ucs import <file>` when ready.');
  }

  const config: UcsConfig = {
    apiUrl,
    orgId,
    orgSlug,
    domain,
    domainId,
    siteName: siteName ?? orgSlug,
    accessToken: client.accessToken,
    apiKey: siteApiKey,
    updatedAt: new Date().toISOString(),
  };
  const configPath = await saveConfig(config);
  success(`Configuration saved to ${configPath}`);
  log('');
  info('Next steps:');
  log('  - Keep your static site in sync with:  ' + yellow('npx ucs pull'));
  log('  - Check status with:                   ' + yellow('npx ucs status'));
}

export function isSetupFlag(key: string): key is keyof SetupFlags {
  return ['apiUrl', 'org', 'email', 'password', 'domain', 'method', 'source', 'yes', 'noImport'].includes(key);
}
