import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { error, log } from './logger.js';
import { runSetup, type SetupFlags } from './commands/setup.js';
import { runStatus, type StatusFlags } from './commands/status.js';
import { runAnalyze, type AnalyzeFlags } from './commands/analyze.js';
import { runImport, type ImportFlags } from './commands/import.js';
import { runPull, type PullFlags } from './commands/pull.js';

const PACKAGE_JSON = JSON.parse(
  readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf8'),
) as { version: string };
const VERSION = PACKAGE_JSON.version;

type ParsedArgs = {
  flags: Record<string, string | boolean>;
  positionals: string[];
};

function parseArgs(argv: string[]): ParsedArgs {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--') {
      positionals.push(...argv.slice(i + 1));
      break;
    }
    if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      if (eq !== -1) {
        flags[arg.slice(2, eq)] = arg.slice(eq + 1);
      } else {
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith('-')) {
          flags[arg.slice(2)] = next;
          i += 1;
        } else {
          flags[arg.slice(2)] = true;
        }
      }
      continue;
    }
    if (arg.startsWith('-') && arg.length > 1 && !arg.startsWith('--')) {
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith('-')) {
        flags[arg.slice(1)] = next;
        i += 1;
      } else {
        flags[arg.slice(1)] = true;
      }
      continue;
    }
    positionals.push(arg);
  }
  return { flags, positionals };
}

const HELP = `UCS — connect your static website to the WebCrm platform.

Usage: npx ucs <command> [options]

Commands:
  setup    Guided setup: verify your domain, analyze your site and import it.
           Options:
             --yes              Run non-interactively (CI). Requires --org, --email,
                                --password, --domain and --source.
             --api-url <url>    WebCrm API base URL (default: env WCRM_API_URL or
                                http://localhost:4000/api/v1)
             --org <slug>       Organization slug
             --email <email>    Admin email
             --password <pwd>   Admin password
             --domain <domain>  Site domain to verify (e.g. example.org)
             --method <m>       META_TAG | FILE | DNS_TXT
             --source <url|dir> Live URL to crawl or local folder
             --no-import        Analyze only, skip the import step

  status   Show connection and verification status.
           Options: --api-url <url>

  analyze <source>   Crawl a URL or scan a folder and write webcrm-import.json.
           Options: -o/--output <file>, --max-pages <n>

  import [file]      Import a webcrm-import.json into WebCrm.
           Options: --org <slug>, --mode merge|replace, --dry-run,
                    --api-url <url>

  pull     Fetch the live WebCrm site data into webcrm.json (for your static site).
           Options: -o/--output <file>, --api-url <url>

Global:
  -h, --help         Show this help
  -v, --version      Show version
`;

export async function main(argv: string[]): Promise<void> {
  const { flags, positionals } = parseArgs(argv);

  if (flags.help || flags.h) {
    log(HELP);
    return;
  }
  if (flags.version || flags.v) {
    log(VERSION);
    return;
  }

  const command = positionals[0];
  if (!command) {
    log(HELP);
    return;
  }

  switch (command) {
    case 'setup': {
      const setupFlags: SetupFlags = {
        apiUrl: typeof flags['api-url'] === 'string' ? flags['api-url'] : undefined,
        org: typeof flags.org === 'string' ? flags.org : undefined,
        email: typeof flags.email === 'string' ? flags.email : undefined,
        password: typeof flags.password === 'string' ? flags.password : undefined,
        domain: typeof flags.domain === 'string' ? flags.domain : undefined,
        method: typeof flags.method === 'string' ? flags.method : undefined,
        source: typeof flags.source === 'string' ? flags.source : undefined,
        yes: flags.yes === true,
        noImport: flags['no-import'] === true,
      };
      await runSetup(setupFlags);
      break;
    }
    case 'status': {
      const statusFlags: StatusFlags = {
        apiUrl: typeof flags['api-url'] === 'string' ? flags['api-url'] : undefined,
      };
      await runStatus(statusFlags);
      break;
    }
    case 'analyze': {
      const source = positionals[1];
      if (!source) throw new Error('Usage: ucs analyze <url|folder> [-o output.json]');
      const analyzeFlags: AnalyzeFlags = {
        output: typeof flags.output === 'string' ? flags.output : typeof flags.o === 'string' ? flags.o : undefined,
        maxPages: typeof flags['max-pages'] === 'string' ? Number(flags['max-pages']) : undefined,
      };
      await runAnalyze(source, analyzeFlags);
      break;
    }
    case 'import': {
      const importFlags: ImportFlags = {
        apiUrl: typeof flags['api-url'] === 'string' ? flags['api-url'] : undefined,
        org: typeof flags.org === 'string' ? flags.org : undefined,
        mode: typeof flags.mode === 'string' ? flags.mode : undefined,
        dryRun: flags['dry-run'] === true,
      };
      await runImport(positionals[1], importFlags);
      break;
    }
    case 'pull': {
      const pullFlags: PullFlags = {
        apiUrl: typeof flags['api-url'] === 'string' ? flags['api-url'] : undefined,
        output: typeof flags.output === 'string' ? flags.output : typeof flags.o === 'string' ? flags.o : undefined,
      };
      await runPull(pullFlags);
      break;
    }
    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

export async function run(argv: string[]): Promise<void> {
  try {
    await main(argv);
  } catch (err) {
    error(`\u2716 ${err instanceof Error ? err.message : String(err)}`);
    log('Run `npx ucs --help` for usage.');
    process.exitCode = 1;
  }
}
