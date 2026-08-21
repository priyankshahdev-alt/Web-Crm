require('dotenv').config();
const { createApp } = require('./src/app');
const { config } = require('./src/config');

console.log('Creating app...');
const app = createApp();
console.log('App created');

const server = app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});