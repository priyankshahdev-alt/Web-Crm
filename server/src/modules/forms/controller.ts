import { Request, Response } from 'express';
import { formService } from './service';
import { getPagination } from '../../utils/pagination';

function orgId(req: Request): string {
  return (req as any).organizationId as string;
}

function userId(req: Request): string {
  return (req as any).userId as string;
}

function pick(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

export const formController = {
  async list(req: Request, res: Response) {
    const { page, limit, skip } = getPagination(req.query);
    const result = await formService.list({
      organizationId: orgId(req),
      skip,
      take: limit,
      search: req.query.search as string | undefined,
      status: req.query.status as string | undefined,
    });
    res.json({ ...result, page, pageSize: limit });
  },

  async getById(req: Request, res: Response) {
    const form = await formService.getById(orgId(req), req.params.id);
    res.json(form);
  },

  async create(req: Request, res: Response) {
    const input = pick(req.body, ['name', 'description', 'status', 'submitLabel', 'successMessage', 'fields', 'settings']);
    const form = await formService.create(orgId(req), input as any, userId(req));
    res.status(201).json(form);
  },

  async update(req: Request, res: Response) {
    const allowed = ['name', 'description', 'status', 'submitLabel', 'successMessage', 'fields', 'settings'];
    const data = pick(req.body, allowed);
    const form = await formService.update(orgId(req), req.params.id, data, userId(req));
    res.json(form);
  },

  async remove(req: Request, res: Response) {
    await formService.remove(orgId(req), req.params.id, userId(req));
    res.status(204).end();
  },

  async submitPublic(req: Request, res: Response) {
    const { data } = req.body;
    const submission = await formService.submitForm(orgId(req), req.params.id, data);
    res.status(201).json(submission);
  },

  // Submissions
  async listSubmissions(req: Request, res: Response) {
    const { page, limit, skip } = getPagination(req.query);
    const result = await formService.listSubmissions({
      organizationId: orgId(req),
      formId: req.params.id,
      skip,
      take: limit,
      search: req.query.search as string | undefined,
      status: req.query.status as string | undefined,
    });
    res.json({ ...result, page, pageSize: limit });
  },

  async updateSubmissionStatus(req: Request, res: Response) {
    const { status } = req.body;
    const sub = await formService.updateSubmissionStatus(orgId(req), req.params.submissionId, status, userId(req));
    res.json(sub);
  },

  async deleteSubmission(req: Request, res: Response) {
    await formService.deleteSubmission(orgId(req), req.params.submissionId, userId(req));
    res.status(204).end();
  },
};
