import path from 'node:path';
import { ApiClient } from '../api.js';
import { log, section, success, yellow, dim } from '../logger.js';
import { loadConfig, requireConfig, writeJsonFile, resolveApiUrl, PULL_FILE_NAME } from '../config.js';

export interface PullFlags {
  apiUrl?: string;
  output?: string;
}

export async function runPull(flags: PullFlags): Promise<void> {
  const config = requireConfig(await loadConfig());
  const apiUrl = resolveApiUrl(flags.apiUrl);
  const output = path.resolve(flags.output ?? PULL_FILE_NAME);

  const client = new ApiClient(apiUrl);
  const site = await client.getSite(config.orgSlug);

  const written = await writeJsonFile(output, site);
  const pages = (site as { pages?: unknown[] }).pages;

  section('Pulled site data');
  log(`${yellow('Organization:')} ${config.orgSlug}`);
  log(`${yellow('Pages:')}        ${pages?.length ?? 0}`);
  success(`Site data written to ${written}`);
  log(dim('Consume this file from your static site (or the injected UCS snippet) to render live WebCrm content.'));
}
