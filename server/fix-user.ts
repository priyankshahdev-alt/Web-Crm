const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixUser() {
  const updated = await prisma.user.update({
    where: { email: 'admin@webcrm.com' },
    data: { isActive: true }
  });
  console.log('Updated user:', updated.email, 'isActive:', updated.isActive);
}

fixUser().catch(console.error).finally(() => prisma.$disconnect());