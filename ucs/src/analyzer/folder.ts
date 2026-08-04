import { promises as fs } from 'node:fs';
import path from 'node:path';

const HTML_EXT = /\.(html?|htm)$/i;

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walk(full);
      out.push(...nested);
    } else if (entry.isFile() && HTML_EXT.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

export interface FolderPage {
  url: string;
  html: string;
}

export async function readFolder(
  dirPath: string,
  opts: { maxPages?: number } = {},
): Promise<FolderPage[]> {
  const files = await walk(path.resolve(dirPath));
  const htmlFiles = files.sort((a, b) => {
    const aIndex = /index\.html?$/i.test(a) ? 0 : 1;
    const bIndex = /index\.html?$/i.test(b) ? 0 : 1;
    return aIndex - bIndex;
  });

  const pages: FolderPage[] = [];
  for (const file of htmlFiles.slice(0, opts.maxPages ?? 50)) {
    const html = await fs.readFile(file, 'utf8');
    const baseName = path.basename(file);
    const relPath = path.relative(dirPath, file).split(path.sep).join('/');
    const isIndex = /^index\.html?$/i.test(baseName);
    const pseudoUrl = isIndex
      ? 'https://site.local/'
      : `https://site.local/${relPath}`;
    pages.push({ url: pseudoUrl, html });
  }
  return pages;
}
