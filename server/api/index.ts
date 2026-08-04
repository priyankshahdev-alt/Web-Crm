import { createApp } from '../src/app';

// Vercel Serverless Function entry point.
// All routes (including /api/v1/*) are rewritten here by vercel.json.
export const config = {
  maxDuration: 60,
};

const app = createApp();

export default app;
