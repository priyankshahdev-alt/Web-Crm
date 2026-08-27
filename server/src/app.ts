import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './config';
import { globalLimiter } from './middlewares/rateLimiter';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import routes from './routes';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(
    cors({
      origin: config.clientUrl.split(','),
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  if (!config.isProduction) {
    app.use(morgan('dev'));
  }

  // Serve Being optimized images as static so CMS can display them
  // Resolves physical directory like ../being/public/images/optimized
  const beingOptimizedCandidates = [
    path.resolve(process.cwd(), '../being/public/images/optimized'),
    path.resolve(process.cwd(), '../../being/public/images/optimized'),
    path.resolve(__dirname, '../../being/public/images/optimized'),
    path.resolve(__dirname, '../../../being/public/images/optimized'),
    path.resolve('C:/Users/Administrator/Desktop/Super admin/Web-Crm/being/public/images/optimized'),
  ];
  for (const cand of beingOptimizedCandidates) {
    try {
      if (fs.existsSync(cand) && fs.statSync(cand).isDirectory()) {
        app.use(
          '/static/optimized',
          (_req, res, next) => {
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
          },
          express.static(cand, { maxAge: '7d', etag: true }),
        );
        break;
      }
    } catch {
      // ignore
    }
  }

  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'OK', data: { status: 'up', timestamp: new Date().toISOString() }, errors: null });
  });

  // Rate limiting is a production concern. In development every local frontend
  // (master, admin, ashray, ucs, ...) proxies to this server, so all of them
  // share the same client IP and exhaust a global bucket almost immediately.
  // Keep the global limiter active only for production deployments.
  if (config.isProduction) {
    app.use(globalLimiter);
  }
  app.use('/api/v1', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

// Vercel Serverless Function entry when Vercel auto-detects this file:
// the default export must be a function or a server (Express app instance).
export default createApp();
