import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface UcsConfig {
  apiUrl: string;
  orgId: string;
  orgSlug: string;
  domain?: string;
  domainId?: string;
  siteName?: string;
  /** Admin JWT used for verification + import. */
  accessToken?: string;
  /** Org API key returned after verification (site:read). */
  apiKey?: string;
  updatedAt?: string;
}

export const CONFIG_DIR_NAME = '.webcrm';
export const CONFIG_FILE_NAME = 'config.json';
export const IMPORT_FILE_NAME = 'webcrm-import.json';
export const PULL_FILE_NAME = 'webcrm.json';

async function isProjectRoot(dir: string): Promise<boolean> {
  return fs
    .access(path.join(dir, 'package.json'))
    .then(() => true)
    .catch(() => false);
}

export async function findProjectRoot(start = process.cwd()): Promise<string> {
  let dir = path.resolve(start);
  for (;;) {
    const pkg = await isProjectRoot(dir);
    if (pkg) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve(start);
    dir = parent;
  }
}

export async function configDir(cwd = process.cwd()): Promise<string> {
  const root = await findProjectRoot(cwd);
  return path.join(root, CONFIG_DIR_NAME);
}

export async function loadConfig(cwd = process.cwd()): Promise<UcsConfig | null> {
  try {
    const dir = await configDir(cwd);
    const raw = await fs.readFile(path.join(dir, CONFIG_FILE_NAME), 'utf8');
    return JSON.parse(raw) as UcsConfig;
  } catch {
    return null;
  }
}

export async function saveConfig(config: UcsConfig, cwd = process.cwd()): Promise<string> {
  const dir = await configDir(cwd);
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, CONFIG_FILE_NAME);
  await fs.writeFile(file, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  return file;
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<string> {
  const abs = path.resolve(filePath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return abs;
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(path.resolve(filePath), 'utf8');
  return JSON.parse(raw) as T;
}

export function requireConfig(config: UcsConfig | null): UcsConfig {
  if (!config) {
    throw new Error(
      'No UCS config found. Run `ucs setup` first in your project directory.',
    );
  }
  return config;
}
