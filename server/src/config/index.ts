import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  APP_URL: z.string().url().default('http://localhost:4000'),
  CLIENT_URL: z
    .string()
    .default(
      'http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,https://web-crm-green.vercel.app,https://web-crm-api-fix.vercel.app,https://beingsevak.org,https://www.beingsevak.org',
    ),

  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRES: z.string().default('15m'),
  JWT_REFRESH_EXPIRES: z.string().default('30d'),

  SUPABASE_URL: z.string().default('https://YOUR-PROJECT.supabase.co'),
  SUPABASE_ANON_KEY: z.string().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(''),
  STORAGE_BUCKET: z.string().default('media'),
  STORAGE_PUBLIC_URL: z.string().default(''),

  RAZORPAY_KEY_ID: z.string().default(''),
  RAZORPAY_KEY_SECRET: z.string().default(''),
  DONATION_MAX_AMOUNT: z.coerce.number().default(1_000_000),

  RATE_LIMIT_WINDOW: z.coerce.number().default(15),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = {
  env: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  appUrl: parsed.data.APP_URL,
  clientUrl: parsed.data.CLIENT_URL,

  jwt: {
    accessSecret: parsed.data.JWT_ACCESS_SECRET,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    accessExpires: parsed.data.JWT_ACCESS_EXPIRES,
    refreshExpires: parsed.data.JWT_REFRESH_EXPIRES,
  },

  supabase: {
    url: parsed.data.SUPABASE_URL,
    anonKey: parsed.data.SUPABASE_ANON_KEY,
    serviceRoleKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY,
    bucket: parsed.data.STORAGE_BUCKET,
    publicUrl: parsed.data.STORAGE_PUBLIC_URL,
  },

  razorpay: {
    keyId: parsed.data.RAZORPAY_KEY_ID,
    keySecret: parsed.data.RAZORPAY_KEY_SECRET,
  },

  donation: {
    maxAmount: parsed.data.DONATION_MAX_AMOUNT,
  },

  rateLimit: {
    windowMinutes: parsed.data.RATE_LIMIT_WINDOW,
    max: parsed.data.RATE_LIMIT_MAX,
  },

  isProduction: parsed.data.NODE_ENV === 'production',
} as const;
