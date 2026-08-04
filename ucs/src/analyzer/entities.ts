import { slugify, truncate } from '../util.js';
import type { PageAnalysis } from './extract.js';
import type {
  SiteEntities,
  SiteGallery,
  SiteGalleryItem,
  SiteProject,
  SiteTeamMember,
  SiteTestimonial,
  SiteBlog,
  SiteEvent,
} from './model.js';

interface Classification {
  projects: PageAnalysis[];
  team: PageAnalysis[];
  blogs: PageAnalysis[];
  events: PageAnalysis[];
  galleries: PageAnalysis[];
  generic: PageAnalysis[];
}

function classify(analyses: PageAnalysis[]): Classification {
  const result: Classification = {
    projects: [],
    team: [],
    blogs: [],
    events: [],
    galleries: [],
    generic: [],
  };

  for (const analysis of analyses) {
    const label = `${analysis.page.slug} ${analysis.page.title}`.toLowerCase();
    if (/(project|program|cause|initiative|our work)/.test(label)) result.projects.push(analysis);
    else if (/(team|about|people|board|members?|volunteers?)/.test(label)) result.team.push(analysis);
    else if (/(blog|stories?|news|journal|update|insight)/.test(label)) result.blogs.push(analysis);
    else if (/(event|calendar|upcoming|schedule)/.test(label)) result.events.push(analysis);
    else if (/(gallery|photos?|moments|albums?|pictures?)/.test(label)) result.galleries.push(analysis);
    else result.generic.push(analysis);
  }

  return result;
}

function parseDate(text: string | null | undefined): string | null {
  if (!text) return null;
  const match = text.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?\s*,?\s*\d{4}\b|\b\d{1,2}\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}\b/i);
  if (!match) return null;
  const parsed = new Date(match[0]);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function buildEntities(analyses: PageAnalysis[]): SiteEntities {
  const c = classify(analyses);
  const entities: SiteEntities = {};

  const projects: SiteProject[] = [];
  const team: SiteTeamMember[] = [];
  const testimonials: SiteTestimonial[] = [];
  const blogs: SiteBlog[] = [];
  const events: SiteEvent[] = [];
  const galleries: SiteGallery[] = [];

  for (const analysis of c.projects) {
    for (const card of analysis.cards) {
      const existing = projects.find((p) => p.title === card.title);
      if (existing) continue;
      projects.push({
        slug: card.link ? slugify(card.link.split('/').filter(Boolean).pop() ?? '') || slugify(card.title) : slugify(card.title),
        title: truncate(card.title, 200),
        summary: card.summary,
        cardImageUrl: card.imageUrl,
        heroImageUrl: card.imageUrl,
        featured: false,
      });
    }
  }
  if (projects.length > 0) entities.projects = projects.slice(0, 60);

  for (const analysis of c.team) {
    for (const card of analysis.cards) {
      const name = truncate(card.title, 200);
      if (!name) continue;
      const existing = team.find((m) => m.name === name);
      if (existing) continue;
      team.push({
        name,
        role: card.summary ? truncate(card.summary, 200) : card.meta,
        photoUrl: card.imageUrl,
        bio: card.meta && card.meta !== card.summary ? card.meta : null,
      });
    }
  }
  if (team.length > 0) entities.team = team.slice(0, 60);

  for (const analysis of analyses) {
    for (const quote of analysis.quotes) {
      const name = quote.name || 'Testimonial';
      const existing = testimonials.find(
        (t) => t.quote === quote.quote && t.name === name,
      );
      if (existing) continue;
      testimonials.push({
        quote: quote.quote,
        name: truncate(name, 200),
        role: quote.role,
        avatarUrl: quote.avatarUrl,
      });
    }
  }
  if (testimonials.length > 0) entities.testimonials = testimonials.slice(0, 60);

  for (const analysis of c.blogs) {
    for (const card of analysis.cards) {
      const existing = blogs.find((b) => b.title === card.title);
      if (existing) continue;
      blogs.push({
        slug: card.link ? slugify(card.link.split('/').filter(Boolean).pop() ?? '') || slugify(card.title) : slugify(card.title),
        title: truncate(card.title, 200),
        excerpt: card.summary,
        coverImageUrl: card.imageUrl,
        authorName: null,
        publishedAt: card.meta && card.meta !== card.summary ? card.meta : null,
      });
    }
  }
  if (blogs.length > 0) entities.blogs = blogs.slice(0, 60);

  for (const analysis of c.events) {
    for (const card of analysis.cards) {
      const existing = events.find((e) => e.title === card.title);
      if (existing) continue;
      events.push({
        slug: card.link ? slugify(card.link.split('/').filter(Boolean).pop() ?? '') || slugify(card.title) : slugify(card.title),
        title: truncate(card.title, 200),
        imageUrl: card.imageUrl,
        location: card.summary ? truncate(card.summary, 200) : null,
        startDate: parseDate(card.meta),
      });
    }
  }
  if (events.length > 0) entities.events = events.slice(0, 60);

  const gallerySources = [...c.galleries, ...c.generic.filter((a) => a.images.length >= 6)];
  for (const analysis of gallerySources) {
    const images = [...new Set(analysis.images)];
    if (images.length === 0) continue;
    const title = analysis.page.title;
    const existing = galleries.find((g) => g.title === title);
    if (existing) continue;
    const items: SiteGalleryItem[] = images.slice(0, 40).map((imageUrl) => ({
      imageUrl,
      altText: null,
      caption: null,
    }));
    galleries.push({
      slug: slugify(title) || slugify(analysis.page.slug),
      title: truncate(title, 200),
      description: analysis.page.metaDescription,
      coverImageUrl: images[0],
      items,
    });
  }
  if (galleries.length > 0) entities.galleries = galleries.slice(0, 20);

  return entities;
}
