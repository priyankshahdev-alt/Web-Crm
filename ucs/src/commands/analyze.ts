import path from 'node:path';
import { analyze } from '../analyzer/index.js';
import { writeJsonFile } from '../config.js';
import { log, section, success, warn, yellow } from '../logger.js';

export interface AnalyzeFlags {
  output?: string;
  maxPages?: number;
}

export async function runAnalyze(source: string, flags: AnalyzeFlags): Promise<void> {
  const output = path.resolve(flags.output ?? 'webcrm-import.json');
  section('Analyzing site');

  const result = await analyze(source, { maxPages: flags.maxPages });
  for (const w of result.warnings) warn(w);

  const entities = (result.model.entities ?? {}) as Record<string, unknown[]>;
  log(`${yellow('Pages:')}   ${result.pageCount}`);
  log(`${yellow('Media:')}   ${result.mediaCount}`);
  for (const [key, value] of Object.entries(entities)) {
    log(`${yellow(`${key}:`)}  ${value?.length ?? 0}`);
  }

  await writeJsonFile(output, result.model);
  success(`Analyzed ${result.pageCount} page(s) and saved the site model to ${output}`);
  log('Review the file, adjust the mapping if needed, then run:');
  log(`  npx ucs import ${output}`);
}
