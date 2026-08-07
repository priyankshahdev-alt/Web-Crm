require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const orgs = await prisma.organization.findMany({ select: { id: true, name: true, slug: true, website: true } });
  console.log('ORGS:', JSON.stringify(orgs, null, 2));
  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, firstName: true, isMaster: true,
      memberships: { select: { isCurrent: true, isActive: true, organization: { select: { slug: true, name: true } } } },
    },
  });
  console.log('USERS:', JSON.stringify(users, null, 2));
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });