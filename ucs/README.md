# webcrm-ucs

`ucs` (Unified Content Sync) connects an existing static website to the
[WebCrm](https://github.com/WebCrm) platform. It verifies your domain, crawls or
scans your site, imports its content into WebCrm, and keeps your static site in
sync with the live WebCrm content.

## Install

```bash
npm install -g webcrm-ucs
# or run without installing:
npx webcrm-ucs --help
```

Requires Node.js 18+.

## Quick start

```bash
ucs setup --domain example.org --source https://example.org
```

`setup` runs the full flow interactively:

1. **Verify** — claims your domain against your organization and prints the
   verification instructions (META tag, DNS TXT, or file).
2. **Analyze** — crawls a live URL (`--source https://…`) or scans a local
   folder (`--source ./public`) and builds `webcrm-import.json`.
3. **Import** — pushes pages, menus, media, teams, testimonials and more into
   WebCrm (merge or replace mode).

Then run `ucs pull` after edits in WebCrm to refresh `webcrm.json`, which your
static site renders.

## Commands

| Command                | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `ucs setup`            | Guided setup: verify domain, analyze, import.            |
| `ucs status`           | Show connection and domain verification status.          |
| `ucs analyze <source>` | Crawl a URL or scan a folder into `webcrm-import.json`.  |
| `ucs import [file]`    | Import a `webcrm-import.json` into WebCrm.               |
| `ucs pull`             | Fetch live WebCrm site data into `webcrm.json`.          |

Run `ucs <command> --help` for full options.

## Configuration

`ucs` stores its connection details in `.webcrm/config.json` inside your
project root. It also writes `webcrm-import.json` (analyzer output) and
`webcrm.json` (pull output). Add `.webcrm/` to your `.gitignore`.

### Environment

| Variable        | Default                          | Used by       |
| --------------- | -------------------------------- | ------------- |
| `WCRM_API_URL`  | `http://localhost:4000/api/v1`   | All commands  |

## Non-interactive (CI) setup

```bash
ucs setup --yes \
  --org my-org \
  --email admin@webcrm.com \
  --password '…' \
  --domain example.org \
  --source https://example.org \
  --no-import
```

## Development

```bash
npm install
npm run build
node dist/index.js --help
```

## License

MIT
