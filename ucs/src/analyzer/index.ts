import { load } from 'cheerio';
import { isValidHttpUrl, truncate } from '../util.js';
import { crawlSite, type FetchedPage } from './crawl.js';
import { readFolder, type FolderPage } from './folder.js';
import {
  analyzeHtmlPage,
  detectContact,
  detectSocial,
  extractMenu,
  type PageAnalysis,
} from './extract.js';
import { buildEntities } from './entities.js';
import type {
  AnalyzerOptions,
  SiteMedia,
  SiteModel,
  SiteSettings,
} from './model.js';

type AnyPage = FetchedPage | FolderPage;

function isHttp(url: string): boolean {
  return /^https?:\/\//.test(url);
}

function collectMedia(analyses: PageAnalysis[], sourceType: 'url' | 'folder'): SiteMedia[] {
  const seen = new Set<string>();
  const media: NonNullable<SiteModel['media']> = [];
  for (const analysis of analyses) {
    for (const image of analysis.images) {
      if (seen.has(image)) continue;
      seen.add(image);
      if (sourceType === 'folder' && !isHttp(image)) continue;
      if (sourceType === 'folder' && /^https:\/\/site\.local\//.test(image)) continue;
      media.push({
        sourceUrl: image,
        fileName: image.split('/').pop()?.split('?')[0] ?? null,
        entityType: 'site',
      });
    }
  }
  return media.slice(0, 120);
}

export interface AnalyzeResult {
  model: SiteModel;
  pageCount: number;
  mediaCount: number;
  warnings: string[];
}

export async function analyze(source: string, opts: AnalyzerOptions = {}): Promise<AnalyzeResult> {
  const sourceType: 'url' | 'folder' = isValidHttpUrl(source) ? 'url' : 'folder';
  const warnings: string[] = [];

  let pages: AnyPage[];
  let baseUrl: string;

  if (sourceType === 'url') {
    baseUrl = source;
    pages = await crawlSite(source, { maxPages: opts.maxPages, includePath: opts.includePath });
    if (pages.length === 0) {
      throw new Error(`No pages could be fetched from ${source}.`);
    }
  } else {
    baseUrl = 'https://site.local/';
    pages = await readFolder(source, { maxPages: opts.maxPages });
    if (pages.length === 0) {
      throw new Error(`No HTML files found in ${source}.`);
    }
  }

  const analyses: PageAnalysis[] = [];
  const seenSlugs = new Set<string>();
  for (const page of pages) {
    const analysis = analyzeHtmlPage(page.url, page.html, baseUrl);
    if (seenSlugs.has(analysis.page.slug)) {
      if (analysis.page.slug === 'home') continue;
      analysis.page.slug = `${analysis.page.slug}-${analyses.length + 1}`;
    }
    seenSlugs.add(analysis.page.slug);
    analyses.push(analysis);
  }

  // ---- Settings ----
  const contact: NonNullable<SiteSettings['contact']> = {};
  const social: NonNullable<SiteSettings['social']> = {};
  let siteName: string | null = null;
  let tagline: string | null = null;
  let description: string | null = null;

  for (const page of pages) {
    const $ = load(page.html);
    if (!siteName) {
      const ogName = $('meta[property="og:site_name"]').attr('content');
      if (ogName) siteName = ogName.trim();
    }
    if (!tagline) {
      tagline =
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        null;
    }
    if (!description) description = $('meta[name="description"]').attr('content') || null;

    const detected = detectContact($, page.url);
    if (!contact.email && detected.email) contact.email = detected.email;
    if (!contact.phone && detected.phone) contact.phone = detected.phone;
    if (!contact.address && detected.address) contact.address = detected.address;

    const links = detectSocial($);
    if (!social.facebook && links.facebook) social.facebook = links.facebook;
    if (!social.instagram && links.instagram) social.instagram = links.instagram;
    if (!social.youtube && links.youtube) social.youtube = links.youtube;
    if (!social.linkedin && links.linkedin) social.linkedin = links.linkedin;
    if (!social.whatsapp && links.whatsapp) social.whatsapp = links.whatsapp;
  }

  if (!siteName) {
    siteName =
      analyses.find((a) => a.page.slug === 'home')?.page.title?.replace(/\s+[|–\-]\s+.*$/, '').trim() ||
      (sourceType === 'url' ? new URL(source).hostname.replace(/^www\./, '') : 'Website');
  }

  const settings: SiteSettings = {
    siteName: truncate(siteName, 200),
    tagline: tagline ? truncate(tagline, 300) : null,
    description: description ? truncate(description, 500) : null,
    contact: Object.keys(contact).length > 0 ? contact : undefined,
    social: Object.keys(social).length > 0 ? social : undefined,
  };

  // ---- Menus (from the homepage) ----
  const menus: NonNullable<SiteModel['menus']> = [];
  const home = pages[0];
  if (home) {
    const $ = load(home.html);
    const mainNav = extractMenu($, 'main-nav');
    const footer = extractMenu($, 'footer');
    if (mainNav) {
      menus.push({
        ...mainNav,
        items: mainNav.items.map((item, i) => ({ ...item, sortOrder: i + 1 })),
      });
    }
    if (footer) {
      menus.push({
        ...footer,
        items: footer.items.map((item, i) => ({ ...item, sortOrder: i + 1 })),
      });
    }
  }

  // ---- Media / entities ----
  const media = collectMedia(analyses, sourceType);
  if (sourceType === 'folder' && media.length === 0) {
    warnings.push(
      'Folder mode: no hosted images detected. Imported image URLs keep their original (possibly relative) paths.',
    );
  }

  const entities = buildEntities(analyses);

  const model: SiteModel = {
    meta: {
      source,
      sourceType,
      extractedAt: new Date().toISOString(),
    },
    settings,
    pages: analyses.map((analysis) => analysis.page),
    menus,
    media,
    entities,
  };

  return {
    model,
    pageCount: analyses.length,
    mediaCount: media.length,
    warnings,
  };
}
