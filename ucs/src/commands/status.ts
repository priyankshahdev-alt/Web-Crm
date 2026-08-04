import { ApiClient } from '../api.js';
import { log, section, info, success, warn, yellow, dim, error } from '../logger.js';
import { loadConfig, resolveApiUrl } from '../config.js';

export interface StatusFlags {
  apiUrl?: string;
}

export async function runStatus(flags: StatusFlags): Promise<void> {
  const config = await loadConfig();
  if (!config) {
    warn('No UCS config found. Run `ucs setup` in your project directory first.');
    return;
  }

  const apiUrl = resolveApiUrl(flags.apiUrl);

  section('UCS status');
  log(`${yellow('API server:')}   ${apiUrl}`);
  log(`${yellow('Organization:')} ${config.orgSlug}${config.siteName ? ` (${config.siteName})` : ''}`);
  log(`${yellow('Domain:')}       ${config.domain ?? '(not set)'}`);
  log(`${yellow('Configured:')}   ${config.updatedAt ?? 'unknown'}`);

  try {
    const client = new ApiClient(apiUrl, config.accessToken);
    const site = (await client.getSite(config.orgSlug)) as {
      organization?: { id?: string; name?: string; status?: string };
    };
    if (site.organization?.id && site.organization.id !== config.orgId) {
      warn('Organization id has changed on the server. Re-run `ucs setup`.');
    } else {
      success(`Server reachable — organization "${site.organization?.name ?? config.orgSlug}" is live.`);
    }

    if (config.accessToken) {
      try {
        const domains = await client.listDomains(config.orgId);
        const domain =
          domains.find((d) => d.id === config.domainId) ??
          domains.find((d) => d.status !== 'unverified' && d.status !== 'not_found') ??
          domains[0];
        if (domain) {
          log(`${yellow('Verification:')}  ${domain.domain} → ${domain.status}`);
        } else {
          info('No domains claimed yet. Run `ucs setup` to verify your domain.');
        }
      } catch (err) {
        warn(`Could not fetch verification status: ${err instanceof Error ? err.message : err}`);
      }
    } else {
      info('Verification status requires a saved admin session. Re-run setup to refresh.');
    }
  } catch (err) {
    error(`Server check failed: ${err instanceof Error ? err.message : String(err)}`);
    log(dim('Run `ucs setup` to re-link your site, or set WCRM_API_URL if the server moved.'));
  }
}
