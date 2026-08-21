import { Prisma } from '@prisma/client';
import type { AuthUser } from '../../types';
import { prisma } from '../../libs/prisma';

export type DashboardScope = {
  orgIds: string[];
  scoped: boolean;
};

const COUNT_SELECT = {
  select: {
    id: true,
    name: true,
    slug: true,
    status: true,
    plan: true,
    createdAt: true,
    _count: {
      select: { users: true, projects: true, pages: true, donations: true },
    },
  },
} as const;

type CountRow = {
  organizations: number;
  users: number;
  projects: number;
  pages: number;
  media: number;
  events: number;
  campaigns: number;
  donations: number;
};

/**
 * Run all eight dashboard counts in a single round-trip instead of eight
 * parallel Prisma queries. The shared Supabase transaction pooler caps the
 * whole project at 15 connections, so cutting per-request concurrency avoids
 * P2024 pool timeouts and keeps the local app from saturating the pooler.
 */
async function countForOrgIds(orgIds: string[]): Promise<CountRow> {
  if (orgIds.length === 0) {
    return {
      organizations: 0,
      users: 0,
      projects: 0,
      pages: 0,
      media: 0,
      events: 0,
      campaigns: 0,
      donations: 0,
    };
  }
  const ids = Prisma.join(orgIds.map((id) => Prisma.sql`${id}::uuid`));
  const rows = await prisma.$queryRaw<CountRow[]>`
    SELECT
      (SELECT COUNT(*)::int FROM "Organization" WHERE "id" IN (${ids})) AS "organizations",
      (SELECT COUNT(*)::int FROM "OrganizationUser" WHERE "organizationId" IN (${ids})) AS "users",
      (SELECT COUNT(*)::int FROM "Project" WHERE "organizationId" IN (${ids})) AS "projects",
      (SELECT COUNT(*)::int FROM "Page" WHERE "organizationId" IN (${ids})) AS "pages",
      (SELECT COUNT(*)::int FROM "Media" WHERE "organizationId" IN (${ids})) AS "media",
      (SELECT COUNT(*)::int FROM "Event" WHERE "organizationId" IN (${ids})) AS "events",
      (SELECT COUNT(*)::int FROM "Campaign" WHERE "organizationId" IN (${ids})) AS "campaigns",
      (SELECT COUNT(*)::int FROM "Donation" WHERE "organizationId" IN (${ids})) AS "donations"
  `;
  return rows[0];
}

type SiteDetailedStatsRaw = {
  pages_total: number;
  pages_published: number;
  pages_draft: number;
  pages_archived: number;
  projects_total: number;
  projects_published: number;
  projects_draft: number;
  events_total: number;
  events_published: number;
  events_draft: number;
  events_upcoming: number;
  events_past: number;
  blogs_total: number;
  blogs_published: number;
  blogs_draft: number;
  galleries_total: number;
  galleries_published: number;
  galleries_draft: number;
  campaigns_total: number;
  campaigns_published: number;
  campaigns_draft: number;
  media_total: number;
  media_images: number;
  media_documents: number;
  media_folders: number;
  media_storage_bytes: bigint;
  team_total: number;
  team_active: number;
  testimonials_total: number;
  testimonials_active: number;
  partners_total: number;
  partners_active: number;
  faqs_total: number;
  faqs_active: number;
};

export type SiteDetailedStats = {
  pages: { total: number; published: number; draft: number; archived: number };
  projects: { total: number; published: number; draft: number };
  events: { total: number; published: number; draft: number; upcoming: number; past: number };
  blogs: { total: number; published: number; draft: number };
  galleries: { total: number; published: number; draft: number };
  campaigns: { total: number; published: number; draft: number };
  media: { total: number; images: number; documents: number; folders: number; storageBytes: number };
  team: { total: number; active: number };
  testimonials: { total: number; active: number };
  partners: { total: number; active: number };
  faqs: { total: number; active: number };
};

export type UpcomingEvent = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date | null;
  location: string | null;
  status: string;
  slug: string;
};

export const dashboardRepository = {
  async orgIdsFor(user: AuthUser): Promise<DashboardScope> {
    if (user.isMaster) {
      const rows = await prisma.organization.findMany({ select: { id: true } });
      return { orgIds: rows.map((r) => r.id), scoped: false };
    }
    if (user.roles.includes('admins')) {
      const rows = await prisma.organizationAssignment.findMany({
        where: { userId: user.id },
        select: { organizationId: true },
      });
      return { orgIds: rows.map((r) => r.organizationId), scoped: true };
    }
    const rows = await prisma.organizationUser.findMany({
      where: { userId: user.id, isActive: true },
      select: { organizationId: true },
    });
    return { orgIds: rows.map((r) => r.organizationId), scoped: true };
  },

  async overview(scope: DashboardScope) {
    const { orgIds } = scope;
    const counts = await countForOrgIds(orgIds);
    const recentDonations =
      orgIds.length === 0
        ? []
        : await prisma.donation.findMany({
            where: { organizationId: { in: orgIds } },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
              id: true,
              amount: true,
              currency: true,
              status: true,
              donorName: true,
              receiptNumber: true,
              createdAt: true,
              organization: { select: { id: true, slug: true, name: true } },
            },
          });
    return { ...counts, recentDonations };
  },

  async websites(scope: DashboardScope) {
    if (scope.orgIds.length === 0) return [];
    return prisma.organization.findMany({
      where: { id: { in: scope.orgIds } },
      orderBy: { createdAt: 'desc' },
      ...COUNT_SELECT,
    });
  },

  async siteStats(organizationId: string) {
    const [counts, organization, recentDonations] = await Promise.all([
      countForOrgIds([organizationId]),
      prisma.organization.findUnique({
        where: { id: organizationId },
        ...COUNT_SELECT,
      }),
      prisma.donation.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          donorName: true,
          receiptNumber: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      organization,
      counts: {
        users: counts.users,
        projects: counts.projects,
        pages: counts.pages,
        media: counts.media,
        events: counts.events,
        campaigns: counts.campaigns,
        donations: counts.donations,
      },
      recentDonations,
    };
  },

  async siteStatsDetailed(organizationId: string) {
    const orgId = Prisma.sql`${organizationId}::uuid`;
    const [counts, upcomingEvents] = await Promise.all([
      prisma.$queryRaw<SiteDetailedStatsRaw[]>`
        SELECT
          -- Pages by status
          (SELECT COUNT(*)::int FROM "Page" WHERE "organizationId" = ${orgId}) as "pages_total",
          (SELECT COUNT(*)::int FROM "Page" WHERE "organizationId" = ${orgId} AND "status" = 'PUBLISHED') as "pages_published",
          (SELECT COUNT(*)::int FROM "Page" WHERE "organizationId" = ${orgId} AND "status" = 'DRAFT') as "pages_draft",
          (SELECT COUNT(*)::int FROM "Page" WHERE "organizationId" = ${orgId} AND "status" = 'ARCHIVED') as "pages_archived",

          -- Projects by status
          (SELECT COUNT(*)::int FROM "Project" WHERE "organizationId" = ${orgId}) as "projects_total",
          (SELECT COUNT(*)::int FROM "Project" WHERE "organizationId" = ${orgId} AND "status" = 'PUBLISHED') as "projects_published",
          (SELECT COUNT(*)::int FROM "Project" WHERE "organizationId" = ${orgId} AND "status" = 'DRAFT') as "projects_draft",

          -- Events by status + upcoming/past
          (SELECT COUNT(*)::int FROM "Event" WHERE "organizationId" = ${orgId}) as "events_total",
          (SELECT COUNT(*)::int FROM "Event" WHERE "organizationId" = ${orgId} AND "status" = 'PUBLISHED') as "events_published",
          (SELECT COUNT(*)::int FROM "Event" WHERE "organizationId" = ${orgId} AND "status" = 'DRAFT') as "events_draft",
          (SELECT COUNT(*)::int FROM "Event" WHERE "organizationId" = ${orgId} AND "startDate" >= NOW()) as "events_upcoming",
          (SELECT COUNT(*)::int FROM "Event" WHERE "organizationId" = ${orgId} AND "startDate" < NOW()) as "events_past",

          -- Blogs by status
          (SELECT COUNT(*)::int FROM "Blog" WHERE "organizationId" = ${orgId}) as "blogs_total",
          (SELECT COUNT(*)::int FROM "Blog" WHERE "organizationId" = ${orgId} AND "status" = 'PUBLISHED') as "blogs_published",
          (SELECT COUNT(*)::int FROM "Blog" WHERE "organizationId" = ${orgId} AND "status" = 'DRAFT') as "blogs_draft",

          -- Galleries by status
          (SELECT COUNT(*)::int FROM "Gallery" WHERE "organizationId" = ${orgId}) as "galleries_total",
          (SELECT COUNT(*)::int FROM "Gallery" WHERE "organizationId" = ${orgId} AND "status" = 'PUBLISHED') as "galleries_published",
          (SELECT COUNT(*)::int FROM "Gallery" WHERE "organizationId" = ${orgId} AND "status" = 'DRAFT') as "galleries_draft",

          -- Campaigns by status
          (SELECT COUNT(*)::int FROM "Campaign" WHERE "organizationId" = ${orgId}) as "campaigns_total",
          (SELECT COUNT(*)::int FROM "Campaign" WHERE "organizationId" = ${orgId} AND "status" = 'PUBLISHED') as "campaigns_published",
          (SELECT COUNT(*)::int FROM "Campaign" WHERE "organizationId" = ${orgId} AND "status" = 'DRAFT') as "campaigns_draft",

          -- Media by type + storage
          (SELECT COUNT(*)::int FROM "Media" WHERE "organizationId" = ${orgId}) as "media_total",
          (SELECT COUNT(*)::int FROM "Media" WHERE "organizationId" = ${orgId} AND "mimeType" LIKE 'image/%') as "media_images",
          (SELECT COUNT(*)::int FROM "Media" WHERE "organizationId" = ${orgId} AND "mimeType" NOT LIKE 'image/%') as "media_documents",
          (SELECT COALESCE(SUM("size"), 0)::bigint FROM "Media" WHERE "organizationId" = ${orgId}) as "media_storage_bytes",
          (SELECT COUNT(*)::int FROM "Media" WHERE "organizationId" = ${orgId} AND "entityType" = 'folder') as "media_folders",

          -- Team members
          (SELECT COUNT(*)::int FROM "TeamMember" WHERE "organizationId" = ${orgId}) as "team_total",
          (SELECT COUNT(*)::int FROM "TeamMember" WHERE "organizationId" = ${orgId} AND "isActive" = true) as "team_active",

          -- Testimonials
          (SELECT COUNT(*)::int FROM "Testimonial" WHERE "organizationId" = ${orgId}) as "testimonials_total",
          (SELECT COUNT(*)::int FROM "Testimonial" WHERE "organizationId" = ${orgId} AND "isActive" = true) as "testimonials_active",

          -- Partners
          (SELECT COUNT(*)::int FROM "Partner" WHERE "organizationId" = ${orgId}) as "partners_total",
          (SELECT COUNT(*)::int FROM "Partner" WHERE "organizationId" = ${orgId} AND "isActive" = true) as "partners_active",

          -- FAQs
          (SELECT COUNT(*)::int FROM "Faq" WHERE "organizationId" = ${orgId}) as "faqs_total",
          (SELECT COUNT(*)::int FROM "Faq" WHERE "organizationId" = ${orgId} AND "isActive" = true) as "faqs_active"
      `,
      prisma.event.findMany({
        where: { organizationId, startDate: { gte: new Date() } },
        select: { id: true, title: true, startDate: true, endDate: true, location: true, status: true, slug: true },
        orderBy: { startDate: 'asc' },
        take: 5,
      }),
    ]);

    const c = counts[0];
    return {
      counts: {
        pages: { total: c.pages_total, published: c.pages_published, draft: c.pages_draft, archived: c.pages_archived },
        projects: { total: c.projects_total, published: c.projects_published, draft: c.projects_draft },
        events: { total: c.events_total, published: c.events_published, draft: c.events_draft, upcoming: c.events_upcoming, past: c.events_past },
        blogs: { total: c.blogs_total, published: c.blogs_published, draft: c.blogs_draft },
        galleries: { total: c.galleries_total, published: c.galleries_published, draft: c.galleries_draft },
        campaigns: { total: c.campaigns_total, published: c.campaigns_published, draft: c.campaigns_draft },
        media: { total: c.media_total, images: c.media_images, documents: c.media_documents, folders: c.media_folders, storageBytes: Number(c.media_storage_bytes) },
        team: { total: c.team_total, active: c.team_active },
        testimonials: { total: c.testimonials_total, active: c.testimonials_active },
        partners: { total: c.partners_total, active: c.partners_active },
        faqs: { total: c.faqs_total, active: c.faqs_active },
      },
      upcomingEvents: upcomingEvents as UpcomingEvent[],
    };
  },
};
