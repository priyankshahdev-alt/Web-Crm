const { createApp } = require('./src/app');
const { config } = require('./src/config');
const { prisma } = require('./src/libs/prisma');

async function test() {
  console.log('Connecting to DB...');
  await prisma.$connect();
  console.log('DB connected!');
  
  console.log('Creating app...');
  const app = createApp();
  console.log('App created');
  
  const server = app.listen(config.port, () => {
    console.log('Server callback fired!');
    console.log('Server address:', server.address());
  });
  
  server.on('error', (err) => console.error('Server error:', err));
  server.on('listening', () => console.log('Server listening event'));
}

test().catch(console.error);