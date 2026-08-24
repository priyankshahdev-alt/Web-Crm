const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const orgs = await p.organization.findMany({ select: { id: true, slug: true } });
  for (const org of orgs) {
    const projects = await p.project.findMany({
      where: { organizationId: org.id },
      include: { stats: true, impacts: true, images: true },
      take: 10,
    });
    console.log(`\n=== ${org.slug} (${projects.length} projects) ===`);
    for (const pr of projects) {
      console.log(JSON.stringify({
        id: pr.id, title: pr.title, slug: pr.slug, status: pr.status,
        category: pr.category, tag: pr.tag, featured: pr.featured,
        cardImageUrl: pr.cardImageUrl ? pr.cardImageUrl.slice(0, 60) : null,
        description: pr.description,
        statsCount: pr.stats.length, impactsCount: pr.impacts.length,
        stats: pr.stats.map((s) => `${s.label}=${s.value}`),
        impacts: pr.impacts.map((i) => i.title),
      }, null, 1));
    }
  }
  await p.$disconnect();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
