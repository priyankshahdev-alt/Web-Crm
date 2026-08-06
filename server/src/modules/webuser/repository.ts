import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';

export const webUserOrgSelect = {
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

export const webUserRepository = {
  async getWebsite(organizationId: string) {
    return prisma.organization.findUnique({
      where: { id: organizationId },
      select: webUserOrgSelect,
    });
  },

  async getHomePage(organizationId: string) {
    return prisma.page.findFirst({
      where: { organizationId, isHome: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        sections: { orderBy: { sortOrder: 'asc' } },
      },
    });
  },

  async findSection(sectionId: string, organizationId: string) {
    return prisma.pageSection.findFirst({
      where: { id: sectionId, organizationId },
    });
  },

  async updateSection(sectionId: string, data: Prisma.PageSectionUpdateInput) {
    return prisma.pageSection.update({ where: { id: sectionId }, data });
  },
};
