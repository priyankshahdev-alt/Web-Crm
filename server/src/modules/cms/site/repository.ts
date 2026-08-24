import { PublishStatus } from '@prisma/client';
import { prisma } from '../../../libs/prisma';

const publicOrgSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  email: true,
  phone: true,
  website: true,
  address: true,
  city: true,
  state: true,
  country: true,
  logoUrl: true,
} as const;

export const siteRepository = {
  async findBySlug(slug: string) {
    return prisma.organization.findUnique({
      where: { slug },
      select: publicOrgSelect,
    });
  },

  async getSettings(organizationId: string) {
    const rows = await prisma.organizationSetting.findMany({ where: { organizationId } });
    const settings: Record<string, unknown> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return settings;
  },

  async getMenus(organizationId: string) {
    return prisma.menu.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        location: true,
        items: {
          where: { parentId: null, isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            label: true,
            url: true,
            entityType: true,
            entityId: true,
            sortOrder: true,
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                label: true,
                url: true,
                entityType: true,
                entityId: true,
                sortOrder: true,
              },
            },
          },
        },
      },
    });
  },

  async getBanners(organizationId: string) {
    return prisma.banner.findMany({
      where: { organizationId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async getSliders(organizationId: string) {
    return prisma.slider.findMany({
      where: { organizationId, isActive: true },
      include: {
        slides: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  },

  async getPages(organizationId: string) {
    return prisma.page.findMany({
      where: { organizationId, status: PublishStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        sections: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  },

  async getPagesWithDrafts(organizationId: string) {
    return prisma.page.findMany({
      where: { organizationId, status: PublishStatus.PUBLISHED },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  },

  async getProjectsByIds(organizationId: string, ids?: string[], all = false) {
    return prisma.project.findMany({
      where: {
        organizationId,
        status: PublishStatus.PUBLISHED,
        isHidden: false,
        ...(all ? {} : ids && ids.length > 0 ? { id: { in: ids } } : { id: { in: [] } }),
      },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        tag: true,
        summary: true,
        heroImageUrl: true,
        heroImageMobileUrl: true,
        cardImageUrl: true,
        featured: true,
      },
    });
  },

  async getCampaignsByIds(organizationId: string, ids?: string[], all = false) {
    return prisma.campaign.findMany({
      where: {
        organizationId,
        status: PublishStatus.PUBLISHED,
        ...(all ? {} : ids && ids.length > 0 ? { id: { in: ids } } : { id: { in: [] } }),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        targetAmount: true,
        raisedAmount: true,
        imageUrl: true,
        featured: true,
      },
    });
  },

  async getTeamMembersByIds(organizationId: string, ids?: string[], all = false) {
    return prisma.teamMember.findMany({
      where: {
        organizationId,
        isActive: true,
        ...(all ? {} : ids && ids.length > 0 ? { id: { in: ids } } : { id: { in: [] } }),
      },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async getPartnersByIds(organizationId: string, ids?: string[], all = false) {
    return prisma.partner.findMany({
      where: {
        organizationId,
        isActive: true,
        ...(all ? {} : ids && ids.length > 0 ? { id: { in: ids } } : { id: { in: [] } }),
      },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async getFaqsByIds(organizationId: string, ids?: string[], all = false) {
    return prisma.faq.findMany({
      where: {
        organizationId,
        isActive: true,
        ...(all ? {} : ids && ids.length > 0 ? { id: { in: ids } } : { id: { in: [] } }),
      },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async getAwardsByIds(organizationId: string, ids?: string[], all = false) {
    return prisma.award.findMany({
      where: {
        organizationId,
        isActive: true,
        ...(all ? {} : ids && ids.length > 0 ? { id: { in: ids } } : { id: { in: [] } }),
      },
      orderBy: { sortOrder: 'asc' },
    });
  },

  async getBlogsByIds(organizationId: string, ids?: string[], all = false) {
    return prisma.blog.findMany({
      where: {
        organizationId,
        status: PublishStatus.PUBLISHED,
        ...(all ? {} : ids && ids.length > 0 ? { id: { in: ids } } : { id: { in: [] } }),
      },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        authorName: true,
        publishedAt: true,
      },
    });
  },

  async getGalleryById(organizationId: string, galleryId?: string) {
    const gallery = galleryId
      ? await prisma.gallery.findFirst({
          where: { id: galleryId, organizationId, status: PublishStatus.PUBLISHED },
          include: { items: { orderBy: { sortOrder: 'asc' } } },
        })
      : await prisma.gallery.findFirst({
          where: { organizationId, status: PublishStatus.PUBLISHED },
          orderBy: { updatedAt: 'desc' },
          include: { items: { orderBy: { sortOrder: 'asc' } } },
        });
    return gallery;
  },

  async getDocumentsByCategory(organizationId: string, categoryId?: string) {
    return prisma.document.findMany({
      where: {
        organizationId,
        status: PublishStatus.PUBLISHED,
        ...(categoryId ? { categoryId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getLocations(organizationId: string) {
    return prisma.location.findMany({
      where: { organizationId, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  },
};
