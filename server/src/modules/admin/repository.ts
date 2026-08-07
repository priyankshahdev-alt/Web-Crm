import { prisma } from '../../libs/prisma';

const LIST_SELECT = {
  select: {
    id: true,
    name: true,
    slug: true,
    status: true,
    plan: true,
    description: true,
    website: true,
    logoUrl: true,
    createdAt: true,
    updatedAt: true,
    _count: {
      select: { users: true, projects: true, pages: true, media: true },
    },
  },
} as const;

export const adminRepository = {
  async listWebsites() {
    return prisma.organization.findMany({
      orderBy: { createdAt: 'asc' },
      ...LIST_SELECT,
    });
  },

  async publishedPagesPerOrg() {
    const rows = await prisma.page.groupBy({
      by: ['organizationId', 'status'],
      _count: { _all: true },
    });
    const publishedByOrg = new Map<string, number>();
    for (const row of rows) {
      if (row.status === 'PUBLISHED') {
        publishedByOrg.set(row.organizationId, row._count._all);
      }
    }
    return publishedByOrg;
  },

  async getWebsite(organizationId: string) {
    return prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
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
        status: true,
        updatedAt: true,
      },
    });
  },
};
