import * as cheerio from 'cheerio';
import {
  toAbsolute,
  sameOrigin,
  pageSlugFromUrl,
  extractEmail,
  extractPhone,
  truncate,
} from '../util.js';
import type { SitePage, SiteSection } from './model.js';

export interface RawCard {
  title: string;
  summary?: string | null;
  imageUrl?: string | null;
  link?: string | null;
  meta?: string | null;
}

export interface RawQuote {
  quote: string;
  name?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
}

export interface PageAnalysis {
  page: SitePage;
  images: string[];
  cards: RawCard[];
  quotes: RawQuote[];
}

const KNOWN_SECTION_TYPES = new Set([
  'hero',
  'page-hero',
  'banner-strip',
  'about',
  'story',
  'stats',
  'cards',
  'values',
  'sectors',
  'projects-grid',
  'program-detail',
  'mission-vision',
  'cta',
  'team',
  'testimonials',
  'stories',
  'gallery',
  'partners',
  'documents',
  'campaigns',
  'donate',
  'contact-info',
  'map',
  'form',
  'legal',
  'awards',
  'newsletter',
  'faq',
  'location',
]);

function headingType(heading: string): string {
  const h = heading.toLowerCase();
  if (/(project|program|work|cause|initiative)/.test(h)) return 'projects-grid';
  if (/(team|people|members?|board|volunteers?)/.test(h)) return 'team';
  if (/(testimonial|review|what (people|they) say|voices)/.test(h)) return 'testimonials';
  if (/(gallery|photos?|moments|album)/.test(h)) return 'gallery';
  if (/(partner|sponsor|supporter)/.test(h)) return 'partners';
  if (/(story|about|who we are|mission|vision|impact|our journey)/.test(h)) {
    if (/(impact|stat|number|reached)/.test(h)) return 'stats';
    return /(mission|vision)/.test(h) ? 'mission-vision' : 'story';
  }
  if (/(stat|impact|number|reach|counter)/.test(h)) return 'stats';
  if (/(faq|question|help)/.test(h)) return 'faq';
  if (/(event|upcoming|calendar|schedule)/.test(h)) return 'cards';
  if (/(campaign|fundrais|donate|support|appeal)/.test(h)) return 'campaigns';
  if (/(award|recognit|honor|achievement)/.test(h)) return 'awards';
  if (/(newsletter|subscribe|stay updated|email updates)/.test(h)) return 'newsletter';
  if (/(contact|reach|get in touch|find us)/.test(h)) return 'contact-info';
  if (/(value|belief|principle)/.test(h)) return 'values';
  if (/(sector|area of work|focus)/.test(h)) return 'sectors';
  if (/(service|what we do)/.test(h)) return 'cards';
  return 'story';
}

function normalizeSectionType(type: string): string {
  return KNOWN_SECTION_TYPES.has(type) ? type : 'story';
}

function heroSection($: cheerio.CheerioAPI, root: cheerio.Cheerio<any>): SiteSection | null {
  const hero = root.find('[class*="hero" i], [class*="banner" i], [class*="slider" i], header[role="banner"], .page-header').first();
  if (hero.length === 0) return null;

  const heading =
    hero.find('h1, h2').first().text().trim() || hero.find('[class*="title"]').first().text().trim();
  const subheading = hero.find('p').first().text().trim() || undefined;
  const imageUrl = hero.find('img').first().attr('src') || undefined;
  const ctas = hero
    .find('a[class*="btn" i], a[class*="button" i], button')
    .map((_, el) => {
      const $el = $(el);
      const label = $el.text().trim();
      const href = $el.attr('href');
      if (!label) return null;
      return { label, url: href || undefined };
    })
    .get()
    .filter(Boolean);

  const content: Record<string, unknown> = {};
  if (heading) content.heading = heading;
  if (subheading) content.subheading = subheading;
  if (ctas.length > 0) {
    content.primaryCta = ctas[0];
    content.secondaryCta = ctas[1] ?? undefined;
  }
  if (imageUrl) {
    content.imageUrl = imageUrl;
    content.mobileImageUrl = imageUrl;
  }

  return {
    type: 'hero',
    name: 'Hero',
    sortOrder: 1,
    isActive: true,
    content,
  };
}

function statsSection($: cheerio.CheerioAPI, root: cheerio.Cheerio<any>): SiteSection | null {
  const statBlock = root.find('[class*="stat" i], [class*="counter" i], [class*="impact-number" i]').first();
  if (statBlock.length === 0) return null;

  const heading = statBlock.find('h2, h3, [class*="heading"]').first().text().trim() || 'Our Impact';
  const items = statBlock
    .children('[class*="stat"], [class*="counter"], [class*="impact-number"]')
    .map((_, el) => {
      const $el = $(el);
      const value = $el.find('.value, [class*="number" i], strong, b').first().text().replace(/\s+/g, ' ').trim();
      let label = $el.find('.label, .caption').first().text().replace(/\s+/g, ' ').trim();
      if (!label) {
        label = $el.find('p, span, div').not('[class*="value" i], [class*="number" i], strong, b').first().text().replace(/\s+/g, ' ').trim();
      }
      if (value === label) label = '';
      const text = $el.text().replace(/\s+/g, ' ').trim();
      if (!value && !label) {
        const match = text.match(/^([^A-Za-z]{1,12})\s*(.*)$/);
        return match ? { value: match[1].trim(), label: match[2].trim() } : null;
      }
      if (!value && !label) return null;
      return { value, label };
    })
    .get()
    .filter((x): x is { value: string; label: string } => Boolean(x && x.value));

  if (items.length === 0) return null;
  return {
    type: 'stats',
    name: heading,
    sortOrder: 2,
    isActive: true,
    content: { heading, items: items.slice(0, 12) },
  };
}

function contentSections(
  $: cheerio.CheerioAPI,
  root: cheerio.Cheerio<any>,
  startOrder: number,
): SiteSection[] {
  const sections: SiteSection[] = [];
  const headings = root.find('main h2, main h3, article h2, article h3, #content h2, #content h3, .content h2, .content h3');

  headings.each((_, el) => {
    const $el = $(el);
    const heading = $el.text().replace(/\s+/g, ' ').trim();
    if (!heading) return;

    const paragraphs: string[] = [];
    const listItems: string[] = [];
    const images: string[] = [];
    let next = $el.next();
    let guard = 0;
    while (next.length > 0 && guard < 12 && !next.is('h2, h3')) {
      if (next.is('p')) {
        const text = next.text().replace(/\s+/g, ' ').trim();
        if (text) paragraphs.push(text);
      } else if (next.is('ul, ol')) {
        next.find('li').each((_, li) => {
          const text = $(li).text().replace(/\s+/g, ' ').trim();
          if (text) listItems.push(text);
        });
      } else if (next.is('img')) {
        const src = next.attr('src');
        if (src) images.push(src);
      }
      next = next.next();
      guard += 1;
    }

    const content: Record<string, unknown> = { heading };
    if (paragraphs.length > 0) content.paragraphs = paragraphs.slice(0, 6);
    if (listItems.length > 0) content.items = listItems.slice(0, 12);
    if (images.length > 0) content.imageUrl = images[0];

    const type = normalizeSectionType(headingType(heading));
    sections.push({
      type,
      name: heading,
      sortOrder: startOrder + sections.length,
      isActive: true,
      content,
    });
  });

  return sections;
}

export function analyzeHtmlPage(
  url: string,
  html: string,
  baseUrl: string,
): PageAnalysis {
  const $ = cheerio.load(html);
  const body = $('body');

  const title =
    $('h1').first().text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    $('title').text().trim();
  const metaTitle = $('meta[property="og:title"]').attr('content') || title || null;
  const metaDescription =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    null;

  const isHome = pageSlugFromUrl(url, baseUrl) === 'home';
  const sections: SiteSection[] = [];
  const hero = heroSection($, body);
  if (hero) sections.push(hero);

  const stats = statsSection($, body);
  if (stats) sections.push(stats);

  const contentRoot = body;
  sections.push(...contentSections($, contentRoot, sections.length + 1));

  const images: string[] = [];
  body.find('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
    if (!src) return;
    const abs = toAbsolute(url, src);
    if (abs) images.push(abs);
  });

  const cards = extractCards($, body, url);
  const quotes = extractQuotes($, body);

  const page: SitePage = {
    slug: pageSlugFromUrl(url, baseUrl),
    title: truncate(title || 'Untitled', 200),
    metaTitle: metaTitle ? truncate(metaTitle, 200) : null,
    metaDescription: metaDescription ? truncate(metaDescription, 500) : null,
    template: isHome ? 'home' : 'inner',
    isHome,
    sections,
  };

  return { page, images, cards, quotes };
}

export function extractQuotes(
  $: cheerio.CheerioAPI,
  root: cheerio.Cheerio<any>,
): RawQuote[] {
  const quotes: RawQuote[] = [];
  const seen = new Set<string>();

  root.find('blockquote, [class*="testimonial" i] > *').each((_, el) => {
    const $el = $(el);
    const quote = $el
      .find('p, [class*="quote"], blockquote p')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim();
    if (!quote || quote.length < 10) return;
    if (seen.has(quote)) return;
    seen.add(quote);

    const name =
      $el.find('[class*="name" i]').first().text().replace(/\s+/g, ' ').trim() ||
      $el.find('cite').first().text().replace(/\s+/g, ' ').trim() ||
      null;
    const role = $el.find('[class*="role" i], [class*="title" i]').first().text().replace(/\s+/g, ' ').trim() || null;
    const avatarUrl = $el.find('img').first().attr('src') || null;

    quotes.push({ quote: truncate(quote, 1000), name, role, avatarUrl });
  });

  return quotes;
}

export function extractCards(
  $: cheerio.CheerioAPI,
  root: cheerio.Cheerio<any>,
  baseUrl: string,
): RawCard[] {
  const seen = new Set<string>();
  const cards: RawCard[] = [];

  const candidates = root.find(
    '[class*="card" i], [class*="post" i], [class*="project-item" i], [class*="event-item" i], [class*="team-member" i], [class*="member" i] li, ul[class*="grid" i] > li, div[class*="grid" i] > article',
  );

  candidates.each((_, el) => {
    const $el = $(el);
    const titleEl = $el.find('h2, h3, h4, a[class*="title"], [class*="title"]').first();
    const title = titleEl.text().replace(/\s+/g, ' ').trim();
    if (!title || title.length < 3) return;
    if (seen.has(title)) return;
    seen.add(title);

    const summaryEl = $el.find('p').first();
    const summary = summaryEl.text().replace(/\s+/g, ' ').trim();
    const imgEl = $el.find('img').first();
    const imageUrl = imgEl.attr('src') || imgEl.attr('data-src') || null;
    const linkEl = $el.find('a').first();
    const link = linkEl.attr('href') ? toAbsolute(baseUrl, linkEl.attr('href')!) : null;
    const metaEl = $el.find('time, [class*="date"], [class*="meta"]').first();
    const meta = metaEl.text().replace(/\s+/g, ' ').trim() || null;

    cards.push({
      title,
      summary: summary ? truncate(summary, 300) : null,
      imageUrl,
      link,
      meta,
    });
  });

  return cards;
}

export function detectContact(
  $: cheerio.CheerioAPI,
  _url: string,
): {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
} {
  const text = $('body').text();

  let email: string | null = null;
  let phone: string | null = null;
  let address: string | null = null;

  $('a[href^="mailto:"]').each((_, el) => {
    if (!email) email = extractEmail($(el).attr('href') || '');
  });
  if (!email) email = extractEmail(text);

  $('a[href^="tel:"]').each((_, el) => {
    if (!phone) phone = extractPhone($(el).attr('href') || '');
  });
  if (!phone) phone = extractPhone(text);

  const addrEl = $('address').first();
  if (addrEl.length) {
    address = addrEl.text().replace(/\s+/g, ' ').trim();
  }
  if (!address) {
    let footerText = '';
    $('footer').each((_, el) => {
      const $el = $(el);
      if ($el.parents('blockquote, figure').length) return;
      if ($el.text().length > footerText.length) footerText = $el.text();
    });
    const clean = footerText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.replace(/^[©®™]+\s*\d{4}\b[\s|\-–—]*/, '').trim())
      .filter(Boolean)
      .join(' ');
    if (clean) {
      const match = clean.match(/(.{6,160}?)(?:,\s*[\w.-]+@|\+?\d{1,4}[\s.-]?|\bwww\.)/i);
      if (match) address = match[1].trim();
    }
  }

  return { email, phone, address };
}

export function detectSocial(
  $: cheerio.CheerioAPI,
): {
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;
  linkedin?: string | null;
  whatsapp?: string | null;
} {
  const social: Record<string, string | null> = {
    facebook: null,
    instagram: null,
    youtube: null,
    linkedin: null,
    whatsapp: null,
  };

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const host = new URL(href, 'https://x.invalid').hostname.toLowerCase();
    if (/facebook\.com$|fb\.com$/.test(host)) social.facebook = href;
    else if (/instagram\.com$/.test(host)) social.instagram = href;
    else if (/youtube\.com$|youtu\.be$/.test(host)) social.youtube = href;
    else if (/linkedin\.com$/.test(host)) social.linkedin = href;
    else if (/whatsapp\.com$|wa\.me$/.test(host)) social.whatsapp = href;
  });

  return social;
}

export function extractMenu(
  $: cheerio.CheerioAPI,
  location: 'main-nav' | 'footer',
): { name: string; location: string; items: { label: string; url?: string | null }[] } | null {
  const root = location === 'main-nav' ? $('nav').first() : $('footer').first();
  if (root.length === 0) return null;

  const items: { label: string; url?: string | null }[] = [];
  const seen = new Set<string>();
  root.find('a[href]').each((_, el) => {
    const $el = $(el);
    const label = $el.text().replace(/\s+/g, ' ').trim();
    const href = $el.attr('href');
    if (!label || !href || label.length > 40) return;
    if (seen.has(label)) return;
    seen.add(label);
    items.push({ label, url: href });
  });

  if (items.length === 0) return null;
  return {
    name: location === 'main-nav' ? 'Main Navigation' : 'Footer Navigation',
    location,
    items: items.slice(0, 30),
  };
}

export function sameOriginAs(base: string, candidate: string): boolean {
  return sameOrigin(base, candidate);
}
