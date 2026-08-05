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
    app.listen(config.port, () => {
      console.log(`🚀 WebCrm server running at ${config.appUrl} (${config.env})`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

void bootstrap();
