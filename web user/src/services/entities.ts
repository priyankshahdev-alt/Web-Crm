import type { Faq, Partner, TeamMember, Testimonial } from '../types'
import {
  createEntity,
  getAllEntities,
  listEntities,
  removeEntity,
  updateEntity,
} from './crud'
import type { ListParams, Paginated } from './store'

export const teamService = {
  async list(params: ListParams = {}): Promise<Paginated<TeamMember>> {
    return listEntities<TeamMember>('team', 'team', params)
  },
  async all(): Promise<TeamMember[]> {
    return getAllEntities<TeamMember>('team', 'team')
  },
  async create(payload: Partial<TeamMember>): Promise<TeamMember> {
    return createEntity<TeamMember>('team', 'team', {
      name: payload.name ?? 'New Member',
      role: payload.role ?? null,
      photoUrl: payload.photoUrl ?? null,
      bio: payload.bio ?? null,
      socials: payload.socials ?? {},
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
    })
  },
  async update(id: string, patch: Partial<TeamMember>): Promise<TeamMember | null> {
    return updateEntity<TeamMember>('team', 'team', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('team', 'team', id)
  },
}

export const testimonialService = {
  async list(params: ListParams = {}): Promise<Paginated<Testimonial>> {
    return listEntities<Testimonial>('testimonials', 'testimonials', params)
  },
  async all(): Promise<Testimonial[]> {
    return getAllEntities<Testimonial>('testimonials', 'testimonials')
  },
  async create(payload: Partial<Testimonial>): Promise<Testimonial> {
    return createEntity<Testimonial>('testimonials', 'testimonials', {
      quote: payload.quote ?? '',
      name: payload.name ?? 'New Testimonial',
      role: payload.role ?? null,
      avatarUrl: payload.avatarUrl ?? null,
      rating: payload.rating ?? 5,
      isActive: payload.isActive ?? true,
      sortOrder: payload.sortOrder ?? 0,
    })
  },
  async update(id: string, patch: Partial<Testimonial>): Promise<Testimonial | null> {
    return updateEntity<Testimonial>('testimonials', 'testimonials', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('testimonials', 'testimonials', id)
  },
}

export const partnerService = {
  async all(): Promise<Partner[]> {
    return getAllEntities<Partner>('partners', 'partners')
  },
  async create(payload: Partial<Partner>): Promise<Partner> {
    return createEntity<Partner>('partners', 'partners', {
      name: payload.name ?? 'New Partner',
      website: payload.website ?? null,
      logoUrl: payload.logoUrl ?? null,
      description: payload.description ?? null,
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
    })
  },
  async update(id: string, patch: Partial<Partner>): Promise<Partner | null> {
    return updateEntity<Partner>('partners', 'partners', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('partners', 'partners', id)
  },
}

export const faqService = {
  async all(): Promise<Faq[]> {
    return getAllEntities<Faq>('faqs', 'faqs')
  },
  async create(payload: Partial<Faq>): Promise<Faq> {
    return createEntity<Faq>('faqs', 'faqs', {
      question: payload.question ?? '',
      answer: payload.answer ?? '',
      category: payload.category ?? null,
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
    })
  },
  async update(id: string, patch: Partial<Faq>): Promise<Faq | null> {
    return updateEntity<Faq>('faqs', 'faqs', id, patch as Record<string, unknown>)
  },
  async remove(id: string): Promise<void> {
    await removeEntity('faqs', 'faqs', id)
  },
}
