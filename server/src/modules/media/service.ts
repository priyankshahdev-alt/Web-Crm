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

export const mediaService = {
  async list(params: ListParams): Promise<Paginated<unknown>> {
    const { items, total } = await mediaRepository.list(params);
    return buildPaginated(items, total, Math.floor(params.skip / params.take) + 1, params.take);
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
