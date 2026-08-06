import { readFileSync } from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.resolve(
  __dirname,
  '../../../../prisma/data/being-sevak-content',
);

interface DefaultSection {
  type: string;
  name?: string;
  sortOrder?: number;
  isActive?: boolean;
  settings?: Record<string, unknown>;
  content?: Record<string, unknown>;
}

interface DefaultPage {
  slug: string;
  sections?: DefaultSection[];
}

/**
 * Returns the seeded section blueprint for a page slug so pages that have no
 * sections yet can be auto-populated with their editable CMS sections.
 */
export function getDefaultSections(pageSlug: string): DefaultSection[] | null {
  try {
    const file = path.join(CONTENT_DIR, `${pageSlug}.json`);
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as DefaultPage;
    if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
      return parsed.sections;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fallback blueprint for pages without a seeded definition so the editor is
 * never empty and always exposes editable CMS sections.
 */
export function genericDefaultSections(): DefaultSection[] {
  return [
    { type: 'hero', name: 'Hero', content: {} },
    { type: 'about', name: 'About', content: {} },
    { type: 'stats', name: 'Statistics', content: {} },
    { type: 'cta', name: 'Call to Action', content: {} },
  ];
}
