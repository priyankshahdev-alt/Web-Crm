import { createApp } from './app';
import { config } from './config';
import { prisma } from './libs/prisma';

async function connectWithRetry(retries = 5, delayMs = 1500): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await prisma.$connect();
      return;
    } catch (err) {
      console.error(
        `DB connect attempt ${attempt}/${retries} failed: ${(err as Error)?.message ?? err}`,
      );
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function bootstrap(): Promise<void> {
  try {
    await connectWithRetry();
    const app = createApp();
    const server = app.listen(config.port, () => {
      console.log(`🚀 WebCrm server running at ${config.appUrl} (${config.env})`);
    });

    // Release the Prisma connection pool on shutdown so `tsx watch` restarts
    // (and Ctrl+C) do not strand sockets at the Supabase pooler. Without this,
    // every file-save restart can leak pooler connections and eventually trip
    // the 15-client pool limit (EMAXCONNSESSION) while developing.
    let shuttingDown = false;
    const shutdown = (signal: string) => {
      if (shuttingDown) return;
      shuttingDown = true;
      console.log(`\nReceived ${signal}, shutting down…`);
      server.close(() => {
        prisma
          .$disconnect()
          .catch((err) => console.error('Error disconnecting DB:', err))
          .finally(() => process.exit(0));
      });
      // Safety net if the HTTP server has no open handles to close.
      setTimeout(() => process.exit(0), 5000).unref();
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

void bootstrap();
