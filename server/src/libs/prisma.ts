import { PrismaClient } from '@prisma/client';

/**
 * Tune the connection pool for Supabase's pooled Postgres.
 * The dashboard's counts now run as a single aggregate query, so the app only
 * needs a handful of concurrent connections. Keep the pool modest: the shared
 * Supabase transaction pooler caps the whole project at ~15 connections (the
 * deployed backend uses the same pooler), and a pool of 3 previously caused
 * P2024 timeouts under load while 10 saturated the pooler and slowed every
 * query. Shorten timeouts so idle connections (which Supabase forcibly
 * closes) are released sooner and Prisma does not wait on dead sockets.
 */
function databaseUrl(): string | undefined {
  const base = process.env.DATABASE_URL;
  if (!base) return undefined;
  try {
    const url = new URL(base);
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '6');
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
