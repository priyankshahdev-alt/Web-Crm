import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function countOrg(org: any, label: string) {
  const id = org.id;
  const c = (model: any) => (prisma as any)[model].count({ where: { organizationId: id } });
  console.log(`--- ${label} (${org.slug}) ---`);
  console.log('  pages:', await c('page'));
  console.log('  pageSections:', await c('pageSection'));
  console.log('  teamMember:', await c('teamMember'));
  console.log('  testimonial:', await c('testimonial'));
  console.log('  event:', await c('event'));
  console.log('  blog:', await c('blog'));
  console.log('  gallery:', await c('gallery'));
  console.log('  galleryItem:', await c('galleryItem'));
  console.log('  project:', await c('project'));
  const galleries = await (prisma as any).gallery.findMany({ where: { organizationId: id }, include: { items: true } });
  let usableGalleries = 0;
  for (const g of galleries) {
    const usable = (g.items || []).filter((it: any) => it.url && it.url.trim()).length;
    if (usable > 0) usableGalleries++;
  }
  console.log('  galleriesWithUsableItems:', usableGalleries);
}

async function main() {
  const beings = await prisma.organization.findMany();
  for (const o of beings) {
    await countOrg(o, o.name);
  }
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => prisma.$disconnect());
