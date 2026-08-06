// One-time additive data setup for the Being Sevak website.
// Creates the footer-nav menu, adds `price` to the basket mission items, adds
// `donationUrl` to the mission donation sections, and enriches their section
// templates so the fields are visible/editable in the web user panel.
// It only MERGES into existing content — it never deletes or reseeds anything.
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const ORG_SLUG = 'being-sevak';

const FOOTER_NAV = [
  {
    label: 'About Us',
    children: [
      { label: 'About BSCT', url: '/about' },
      { label: 'Management', url: '/management' },
      { label: 'Mission / Vision', url: '/mission-vision' },
      { label: 'Trust Documents', url: '/trust-documents' },
      { label: 'Where We Work', url: '/where-we-work' },
      { label: 'Awards / Achievements', url: '/awards' },
    ],
  },
  {
    label: 'Our Projects',
    children: [
      { label: 'Mission Annapurna', url: '/mission-annapurna' },
      { label: 'Mission Vidhya', url: '/mission-vidhya' },
      { label: 'Mission Aurat', url: '/mission-aurat' },
      { label: 'Mission Bezubaan', url: '/mission-bezubaan' },
      { label: 'Mission Atmanirbhar', url: '/mission-atmanirbhar' },
      { label: 'Mission Arogya', url: '/mission-wellness' },
      { label: 'Sevak Seva Kendra', url: '/sevak-seva-kendra' },
      { label: 'Mission Beach Sevak', url: '/mission-beach' },
    ],
  },
  {
    label: 'GET INVOLVED',
    children: [
      { label: 'Individual Donation', url: '/individual-donation' },
      { label: 'Volunteers(SEVAK BANO)', url: '/careers' },
      { label: 'CSR', url: '/csr' },
      { label: 'School/Institute Collaboration', url: '/school-collaboration' },
      { label: 'NGO Collaboration', url: '/ngo-collaboration' },
    ],
  },
];

const BASKET_SECTIONS = [
  { pageSlug: 'home', type: 'home-basket-missions' },
  { pageSlug: 'individual-donation', type: 'individual-missions' },
  { pageSlug: 'quick-donate', type: 'quick-missions' },
];

const BASKET_PRICES: Record<string, number> = {
  annapurna: 500,
  vidhya: 400,
  aurat: 300,
  atma: 600,
  bezubaan: 200,
};

const MISSION_DONATION_URLS = [
  { pageSlug: 'mission-annapurna', sectionType: 'annapurna-donation', url: '/donations/donation-inline.html' },
  { pageSlug: 'mission-vidhya', sectionType: 'vidhya-donation', url: '/donations/donation-inline-vidhya.html' },
  { pageSlug: 'mission-aurat', sectionType: 'aurat-donation', url: '/donations/donation-inline-aurat.html' },
  { pageSlug: 'mission-bezubaan', sectionType: 'bezubaan-donation', url: '/donations/donation-inline-bezubaan.html' },
  { pageSlug: 'mission-atmanirbhar', sectionType: 'atmanirbhar-donation', url: '/donations/donation-inline-atmanirbhar.html' },
  { pageSlug: 'mission-wellness', sectionType: 'wellness-donation', url: '/donations/donation-inline-arogya.html' },
  { pageSlug: 'mission-eco', sectionType: 'eco-donation', url: '/donations/donation-ecowarriors.html' },
];

type FieldLike = { name: string; label?: string; type?: string; fields?: FieldLike[] };

async function seedFooterMenu(orgId: string): Promise<void> {
  const menu = await prisma.menu.upsert({
    where: { organizationId_location: { organizationId: orgId, location: 'footer-nav' } },
    update: { name: 'Footer Navigation' },
    create: { organizationId: orgId, name: 'Footer Navigation', location: 'footer-nav' },
  });
  await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });

  for (const [i, col] of FOOTER_NAV.entries()) {
    const parent = await prisma.menuItem.create({
      data: {
        menuId: menu.id,
        organizationId: orgId,
        label: col.label,
        url: null,
        sortOrder: i + 1,
        isActive: true,
      },
    });
    for (const [j, child] of col.children.entries()) {
      await prisma.menuItem.create({
        data: {
          menuId: menu.id,
          organizationId: orgId,
          parentId: parent.id,
          label: child.label,
          url: child.url,
          sortOrder: j + 1,
          isActive: true,
        },
      });
    }
  }
  console.log(`Footer menu "footer-nav" ready (${FOOTER_NAV.length} columns).`);
}

async function getSection(orgId: string, pageSlug: string, type: string) {
  const page = await prisma.page.findUnique({
    where: { organizationId_slug: { organizationId: orgId, slug: pageSlug } },
  });
  if (!page) return null;
  return prisma.pageSection.findFirst({ where: { pageId: page.id, type } });
}

async function addPrices(orgId: string): Promise<void> {
  for (const spec of BASKET_SECTIONS) {
    const section = await getSection(orgId, spec.pageSlug, spec.type);
    if (!section) {
      console.warn(`Section ${spec.type} not found on ${spec.pageSlug} — skipped.`);
      continue;
    }
    const content = (section.content as Record<string, unknown> | null) ?? {};
    const items = Array.isArray(content.items) ? content.items : [];
    let changed = false;
    const newItems = items.map((it) => {
      const item = it as Record<string, unknown>;
      if (item && typeof item === 'object' && typeof item.key === 'string') {
        const price = BASKET_PRICES[item.key];
        if (price !== undefined && (item.price === undefined || item.price === null)) {
          changed = true;
          return { ...item, price };
        }
      }
      return it;
    });
    if (changed) {
      await prisma.pageSection.update({
        where: { id: section.id },
        data: { content: { ...content, items: newItems } as Prisma.InputJsonValue },
      });
      console.log(`Added prices to ${spec.pageSlug}/${spec.type}.`);
    } else {
      console.log(`Prices already present on ${spec.pageSlug}/${spec.type}.`);
    }
  }
}

async function addDonationUrls(orgId: string): Promise<void> {
  for (const spec of MISSION_DONATION_URLS) {
    const section = await getSection(orgId, spec.pageSlug, spec.sectionType);
    if (!section) {
      console.warn(`Section ${spec.sectionType} not found on ${spec.pageSlug} — skipped.`);
      continue;
    }
    const content = (section.content as Record<string, unknown> | null) ?? {};
    if (content.donationUrl === undefined || content.donationUrl === null) {
      await prisma.pageSection.update({
        where: { id: section.id },
        data: { content: { ...content, donationUrl: spec.url } as Prisma.InputJsonValue },
      });
      console.log(`Added donationUrl to ${spec.pageSlug}/${spec.sectionType}.`);
    } else {
      console.log(`donationUrl already present on ${spec.pageSlug}/${spec.sectionType}.`);
    }
  }
}

async function enrichTemplates(orgId: string): Promise<void> {
  const basketTypes = BASKET_SECTIONS.map((s) => s.type);
  for (const type of basketTypes) {
    const tpl = await prisma.sectionTemplate.findUnique({
      where: { organizationId_type: { organizationId: orgId, type } },
    });
    if (!tpl) continue;
    const fields = (tpl.fields as FieldLike[] | null) ?? [];
    const itemsField = fields.find((f) => f.name === 'items');
    if (itemsField && Array.isArray(itemsField.fields)) {
      const has = itemsField.fields.some((f) => f.name === 'price');
      if (!has) {
        itemsField.fields.push({ name: 'price', label: 'Price', type: 'number' });
        await prisma.sectionTemplate.update({
          where: { id: tpl.id },
          data: { fields: fields as unknown as Prisma.InputJsonValue },
        });
        console.log(`Template enriched: ${type} (+price).`);
      }
    }
  }
  for (const spec of MISSION_DONATION_URLS) {
    const tpl = await prisma.sectionTemplate.findUnique({
      where: { organizationId_type: { organizationId: orgId, type: spec.sectionType } },
    });
    if (!tpl) continue;
    const fields = (tpl.fields as FieldLike[] | null) ?? [];
    if (!fields.some((f) => f.name === 'donationUrl')) {
      fields.push({ name: 'donationUrl', label: 'Donation URL', type: 'url', maxLength: 1000 });
      await prisma.sectionTemplate.update({
        where: { id: tpl.id },
        data: { fields: fields as unknown as Prisma.InputJsonValue },
      });
      console.log(`Template enriched: ${spec.sectionType} (+donationUrl).`);
    }
  }
}

async function main(): Promise<void> {
  const org = await prisma.organization.findUnique({ where: { slug: ORG_SLUG } });
  if (!org) throw new Error(`Organization "${ORG_SLUG}" not found.`);

  console.log(`Updating website content for "${ORG_SLUG}"...`);
  await seedFooterMenu(org.id);
  await addPrices(org.id);
  await addDonationUrls(org.id);
  await enrichTemplates(org.id);
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
