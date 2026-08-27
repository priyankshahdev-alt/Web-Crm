import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { config } from '../../config';
import { supabase, storageReady } from '../../libs/supabase';
import { ApiError } from '../../utils/ApiError';
import { recordAudit } from '../../utils/audit';
import { buildPaginated, type Paginated } from '../../utils/pagination';
import { mediaRepository, type ListParams } from './repository';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'audio/mpeg',
  'audio/wav',
]);

const MAX_SIZE = 10 * 1024 * 1024;

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
  };
  return map[mime] ?? 'bin';
}

function isImage(mime: string): boolean {
  return mime.startsWith('image/');
}

function mimeFromExt(ext: string): string {
  const m: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
    '.bmp': 'image/bmp',
  };
  return m[ext.toLowerCase()] ?? 'image/jpeg';
}

function resolveOptimizedDir(): string | null {
  const candidates = [
    path.resolve(process.cwd(), '../being/public/images/optimized'),
    path.resolve(process.cwd(), '../../being/public/images/optimized'),
    path.resolve(__dirname, '../../../being/public/images/optimized'),
    path.resolve(__dirname, '../../../../being/public/images/optimized'),
    path.resolve('C:/Users/Administrator/Desktop/Super admin/Web-Crm/being/public/images/optimized'),
  ];
  for (const c of candidates) {
    try {
      if (fs.existsSync(c) && fs.statSync(c).isDirectory()) return c;
    } catch {
      // ignore
    }
  }
  return null;
}

function getOptimizedEntries(organizationId: string): any[] {
  const dir = resolveOptimizedDir();
  if (!dir) return [];
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  const entries: any[] = [];
  for (const fileName of files) {
    const full = path.join(dir, fileName);
    let stat: fs.Stats | null = null;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (!stat.isFile()) continue;
    if (stat.size === 0) continue;
    const ext = path.extname(fileName).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.bmp'].includes(ext)) continue;
    const mimeType = mimeFromExt(ext);
    const size = stat.size;
    const mtime = stat.mtime;
    // stable id per org + filename
    const id = `optimized-${organizationId}-${fileName}`;
    // Use relative URL so Vite proxy (/static -> localhost:4000) serves it same-origin and avoids helmet CORP / CORS issues
    const url = `/static/optimized/${encodeURIComponent(fileName)}`;
    entries.push({
      id,
      organizationId,
      fileName,
      mimeType,
      size,
      bucket: 'local',
      key: `optimized/${fileName}`,
      url,
      thumbnailUrl: url,
      entityType: null,
      entityId: null,
      folder: 'optimized',
      uploadedById: null,
      createdAt: mtime.toISOString(),
      updatedAt: mtime.toISOString(),
    });
  }
  // newest first
  entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return entries;
}

export const mediaService = {
  async list(params: ListParams): Promise<Paginated<unknown>> {
    let dbItems: any[] = [];
    let dbTotal = 0;
    try {
      const res = await mediaRepository.list(params);
      dbItems = res.items as any[];
      dbTotal = res.total;
    } catch {
      // DB unavailable — fall back to optimized-only results
      dbItems = [];
      dbTotal = 0;
    }

    // Merge Being optimized images into the media list so they appear in every CMS picker
    // Do not include them when filtering by entityType/entityId (they are general)
    let optimizedFiltered: any[] = [];
    const hasEntityFilter = !!(params.entityType || params.entityId);
    if (!hasEntityFilter) {
      const allOptimized = getOptimizedEntries(params.organizationId);
      optimizedFiltered = allOptimized.filter((e) => {
        if (params.folder && e.folder !== params.folder) return false;
        if (params.mimeType && e.mimeType !== params.mimeType) return false;
        if (params.search && !e.fileName.toLowerCase().includes(params.search.toLowerCase())) return false;
        return true;
      });
    }

    const shouldMerge = optimizedFiltered.length > 0;
    if (!shouldMerge) {
      return buildPaginated(dbItems, dbTotal, Math.floor(params.skip / params.take) + 1, params.take);
    }

    // If folder=mimeType/search filters were active, DB already filtered; reuse dbTotal
    // Total must include optimized matches
    const combinedTotal = dbTotal + optimizedFiltered.length;

    // Merge + sort + paginate across combined set
    const combined = [...dbItems as any[], ...optimizedFiltered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const paged = combined.slice(params.skip, params.skip + params.take);
    return buildPaginated(paged, combinedTotal, Math.floor(params.skip / params.take) + 1, params.take);
  },

  async upload(
    org: { id: string; slug: string },
    file: Express.Multer.File,
    meta: { entityType?: string; entityId?: string; folder?: string },
    userId: string,
  ) {
    if (!file) throw ApiError.badRequest('No file uploaded');
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw ApiError.badRequest(`Unsupported file type: ${file.mimetype}`);
    }
    if (file.size > MAX_SIZE) {
      throw ApiError.badRequest('File exceeds the 10 MB size limit');
    }
    if (!storageReady() || !supabase) {
      throw ApiError.badRequest(
        'Storage is not configured. Add Supabase credentials (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) first.',
      );
    }

    const now = new Date();
    const entityDir = meta.entityType ?? 'general';
    const safeName = path.basename(file.originalname).replace(/[^\w.\- ]/g, '_').slice(0, 120);
    const ext = extFromMime(file.mimetype);
    const key = `${org.slug}/${entityDir}/${now.getUTCFullYear()}/${String(
      now.getUTCMonth() + 1,
    ).padStart(2, '0')}/${randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(config.supabase.bucket)
      .upload(key, file.buffer, { contentType: file.mimetype });

    if (error) {
      throw ApiError.badRequest(`Upload failed: ${error.message}`);
    }

    const baseUrl =
      config.supabase.publicUrl ||
      `${config.supabase.url}/storage/v1/object/public/${config.supabase.bucket}`;
    const url = `${baseUrl.replace(/\/+$/, '')}/${key}`;

    const media = await mediaRepository.create({
      organizationId: org.id,
      fileName: safeName || key,
      mimeType: file.mimetype,
      size: file.size,
      bucket: config.supabase.bucket,
      key,
      url,
      thumbnailUrl: isImage(file.mimetype) ? url : undefined,
      entityType: meta.entityType,
      entityId: meta.entityId,
      folder: meta.folder || undefined,
      uploadedById: userId,
    });

    await recordAudit({
      userId,
      organizationId: org.id,
      action: 'CREATE',
      resource: 'media',
      resourceId: media.id,
      message: `Media uploaded: ${media.fileName}`,
    });

    return media;
  },

  async rename(orgId: string, id: string, fileName: string, userId: string) {
    if (id.startsWith('optimized-')) {
      throw ApiError.badRequest('Optimized images are read-only (being/public/images/optimized). Rename via filesystem.');
    }
    const media = await mediaRepository.findById(id);
    if (!media) throw ApiError.notFound('Media not found');
    if (media.organizationId !== orgId) throw ApiError.forbidden('Media does not belong to this organization');

    const sanitized = fileName.replace(/[^\w.\- ]/g, '_').slice(0, 120).trim();
    if (!sanitized) throw ApiError.badRequest('Invalid file name');

    const updated = await mediaRepository.update(id, { fileName: sanitized });

    await recordAudit({
      userId,
      organizationId: orgId,
      action: 'UPDATE',
      resource: 'media',
      resourceId: id,
      message: `Media renamed: ${media.fileName} → ${sanitized}`,
    });

    return updated;
  },

  async moveToFolder(orgId: string, id: string, folder: string | null, userId: string) {
    if (id.startsWith('optimized-')) {
      throw ApiError.badRequest('Optimized images are read-only (being/public/images/optimized). Move via filesystem.');
    }
    const media = await mediaRepository.findById(id);
    if (!media) throw ApiError.notFound('Media not found');
    if (media.organizationId !== orgId) throw ApiError.forbidden('Media does not belong to this organization');

    const updated = await mediaRepository.update(id, { folder: folder || null });

    await recordAudit({
      userId,
      organizationId: orgId,
      action: 'UPDATE',
      resource: 'media',
      resourceId: id,
      message: `Media moved to folder: ${folder ?? 'All files'}`,
    });

    return updated;
  },

  async remove(orgId: string, id: string, userId: string) {
    if (id.startsWith('optimized-')) {
      throw ApiError.badRequest('Optimized images are read-only (being/public/images/optimized). Delete via filesystem.');
    }
    const media = await mediaRepository.findById(id);
    if (!media) throw ApiError.notFound('Media not found');
    if (media.organizationId !== orgId) throw ApiError.forbidden('Media does not belong to this organization');

    if (storageReady() && supabase) {
      await supabase.storage.from(media.bucket).remove([media.key]);
    }

    await mediaRepository.delete(id);

    await recordAudit({
      userId,
      organizationId: orgId,
      action: 'DELETE',
      resource: 'media',
      resourceId: id,
      message: `Media deleted: ${media.fileName}`,
    });

    return true;
  },
};
