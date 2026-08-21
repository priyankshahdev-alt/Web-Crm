const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ['admin@webcrm.com', 'master@webcrm.com']
      }
    },
    select: {
      email: true,
      passwordHash: true,
      isActive: true,
      isMaster: true
    }
  });
  
  console.log('Users found:', users.length);
  for (const user of users) {
    console.log(`- ${user.email}: isActive=${user.isActive}, isMaster=${user.isMaster}`);
    console.log(`  passwordHash: ${user.passwordHash.substring(0, 50)}...`);
    
    // Test password verification
    const validAdmin = await argon2.verify(user.passwordHash, 'Admin@123456');
    const validMaster = await argon2.verify(user.passwordHash, 'Master@123456');
    console.log(`  Admin@123456 valid: ${validAdmin}`);
    console.log(`  Master@123456 valid: ${validMaster}`);
  }
}

checkUsers().catch(console.error).finally(() => prisma.$disconnect());