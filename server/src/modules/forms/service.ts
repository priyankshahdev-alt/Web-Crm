import { ApiError } from '../../utils/ApiError';
import { recordAudit } from '../../utils/audit';
import { buildPaginated, type Paginated } from '../../utils/pagination';
import { formRepository, type ListParams, type CreateFormInput } from './repository';
import { submissionRepository, type ListSubmissionsParams } from './submissionRepository';

export const formService = {
  async list(params: ListParams): Promise<Paginated<unknown>> {
    const { items, total } = await formRepository.list(params);
    const enriched = items.map((item) => ({
      ...item,
      submissions: item._count.submissions,
      fieldCount: Array.isArray(item.fields) ? item.fields.length : 0,
    }));
    return buildPaginated(enriched, total, Math.floor(params.skip / params.take) + 1, params.take);
  },

  async getById(orgId: string, id: string) {
    const form = await formRepository.findById(id);
    if (!form) throw ApiError.notFound('Form not found');
    if (form.organizationId !== orgId) throw ApiError.forbidden('Form does not belong to this organization');
    return {
      ...form,
      submissions: form._count.submissions,
      fieldCount: Array.isArray(form.fields) ? form.fields.length : 0,
    };
  },

  async create(orgId: string, input: CreateFormInput, userId: string) {
    const form = await formRepository.create({ ...input, organizationId: orgId });
    await recordAudit({
      userId,
      organizationId: orgId,
      action: 'CREATE',
      resource: 'form',
      resourceId: form.id,
      message: `Form created: ${form.name}`,
    });
    return form;
  },

  async update(orgId: string, id: string, data: Record<string, unknown>, userId: string) {
    const existing = await formRepository.findById(id);
    if (!existing) throw ApiError.notFound('Form not found');
    if (existing.organizationId !== orgId) throw ApiError.forbidden('Form does not belong to this organization');

    const updated = await formRepository.update(id, data);
    await recordAudit({
      userId,
      organizationId: orgId,
      action: 'UPDATE',
      resource: 'form',
      resourceId: id,
      message: `Form updated: ${updated.name}`,
    });
    return updated;
  },

  async remove(orgId: string, id: string, userId: string) {
    const existing = await formRepository.findById(id);
    if (!existing) throw ApiError.notFound('Form not found');
    if (existing.organizationId !== orgId) throw ApiError.forbidden('Form does not belong to this organization');

    await submissionRepository.deleteByFormId(id);
    await formRepository.delete(id);
    await recordAudit({
      userId,
      organizationId: orgId,
      action: 'DELETE',
      resource: 'form',
      resourceId: id,
      message: `Form deleted: ${existing.name}`,
    });
    return true;
  },

  // Submissions
  async listSubmissions(params: ListSubmissionsParams): Promise<Paginated<unknown>> {
    const { items, total } = await submissionRepository.list(params);
    return buildPaginated(items, total, Math.floor(params.skip / params.take) + 1, params.take);
  },

  async getSubmission(orgId: string, id: string) {
    const sub = await submissionRepository.findById(id);
    if (!sub) throw ApiError.notFound('Submission not found');
    if (sub.organizationId !== orgId) throw ApiError.forbidden('Submission does not belong to this organization');
    return sub;
  },

  async submitForm(orgId: string, formId: string, data: Record<string, unknown>) {
    const form = await formRepository.findById(formId);
    if (!form) throw ApiError.notFound('Form not found');
    if (form.organizationId !== orgId) throw ApiError.forbidden('Form does not belong to this organization');
    if (form.status !== 'ACTIVE') throw ApiError.badRequest('Form is not active');

    const submission = await submissionRepository.create({
      formId,
      organizationId: orgId,
      data,
    });

    return submission;
  },

  async updateSubmissionStatus(orgId: string, id: string, status: string, userId: string) {
    const sub = await submissionRepository.findById(id);
    if (!sub) throw ApiError.notFound('Submission not found');
    if (sub.organizationId !== orgId) throw ApiError.forbidden('Submission does not belong to this organization');

    const updated = await submissionRepository.updateStatus(id, status);
    await recordAudit({
      userId,
      organizationId: orgId,
      action: 'UPDATE',
      resource: 'form_submission',
      resourceId: id,
      message: `Submission status changed to ${status}`,
    });
    return updated;
  },

  async deleteSubmission(orgId: string, id: string, userId: string) {
    const sub = await submissionRepository.findById(id);
    if (!sub) throw ApiError.notFound('Submission not found');
    if (sub.organizationId !== orgId) throw ApiError.forbidden('Submission does not belong to this organization');

    await submissionRepository.delete(id);
    await recordAudit({
      userId,
      organizationId: orgId,
      action: 'DELETE',
      resource: 'form_submission',
      resourceId: id,
      message: 'Submission deleted',
    });
    return true;
  },
};
