import { PrismaClient } from '@prisma/client';

/**
 * Tune the connection pool for Supabase's pooled Postgres.
 * Keeps the pool small and shortens timeouts so idle connections
 * (which Supabase forcibly closes) are released sooner and Prisma does
 * not spend request time waiting on a dead socket.
 */
function databaseUrl(): string | undefined {
  const base = process.env.DATABASE_URL;
  if (!base) return undefined;
  try {
    const url = new URL(base);
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '3');
    }
    if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', '15');
    }
    if (!url.searchParams.has('socket_timeout')) {
      url.searchParams.set('socket_timeout', '10');
    }
    return url.toString();
  } catch {
    return base;
  }
}

const configuredUrl = databaseUrl();

export const prisma = new PrismaClient({
  log: ['warn', 'error'],
  ...(configuredUrl ? { datasources: { db: { url: configuredUrl } } } : {}),
});
