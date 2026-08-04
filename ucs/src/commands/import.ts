import path from 'node:path';
import { ApiClient } from '../api.js';
import { ask } from '../prompts.js';
import { log, section, info, success } from '../logger.js';
import { loadConfig, readJsonFile, requireConfig } from '../config.js';

export interface ImportFlags {
  apiUrl?: string;
  org?: string;
  mode?: string;
  dryRun?: boolean;
}

export async function runImport(fileArg: string | undefined, flags: ImportFlags): Promise<void> {
  const file = path.resolve(fileArg ?? 'webcrm-import.json');
  let model: unknown;
  try {
    model = await readJsonFile<unknown>(file);
  } catch {
    throw new Error(`Could not read ${file}. Run \`ucs analyze\` first or provide a valid file.`);
  }
  if (!model || typeof model !== 'object') {
    throw new Error(`${file} is not a valid site model object.`);
  }

  const config = requireConfig(await loadConfig());
  const apiUrl = flags.apiUrl ?? config.apiUrl ?? process.env.WCRM_API_URL ?? 'http://localhost:4000/api/v1';

  let accessToken = config.accessToken;
  if (!accessToken) {
    const email = await ask('Admin email', { required: true });
    const password = await ask('Admin password', { secret: true, required: true });
    const login = await new ApiClient(apiUrl).login(email, password);
    accessToken = login.accessToken;
  }

  const client = new ApiClient(apiUrl, accessToken);

  let orgId = config.orgId;
  if (flags.org) {
    const site = (await client.getSite(flags.org)) as { organization?: { id?: string } };
    if (!site.organization?.id) throw new Error(`Organization "${flags.org}" not found.`);
    orgId = site.organization.id;
  }
  if (!orgId) throw new Error('No organization id available. Run `ucs setup` first.');

  const mode = flags.mode === 'replace' ? 'replace' : 'merge';

  if (flags.dryRun) {
    const preview = await client.importPreview(orgId, model);
    section('Import preview (dry run)');
    log(JSON.stringify((preview as { preview?: unknown }).preview ?? preview, null, 2));
    success('Dry run completed — nothing was changed.');
    return;
  }

  const result = await client.importSite(orgId, model, mode);
  section('Import result');
  log(JSON.stringify((result as { counts?: unknown }).counts ?? result, null, 2));
  success(`Import complete (${mode} mode).`);
  info(`Keep your static site in sync with: npx ucs pull`);
}
