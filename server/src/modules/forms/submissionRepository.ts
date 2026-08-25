import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';

export interface ListSubmissionsParams {
  organizationId: string;
  formId: string;
  skip: number;
  take: number;
  search?: string;
  status?: string;
}

export const submissionRepository = {
  async list(params: ListSubmissionsParams) {
    const where: any = {
      formId: params.formId,
      organizationId: params.organizationId,
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.formSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      prisma.formSubmission.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string) {
    return prisma.formSubmission.findUnique({ where: { id } });
  },

  async create(data: { formId: string; organizationId: string; data: Record<string, unknown> }) {
    return prisma.formSubmission.create({
      data: {
        formId: data.formId,
        organizationId: data.organizationId,
        data: data.data as Prisma.InputJsonValue,
        status: 'NEW',
      },
    });
  },

  async updateStatus(id: string, status: string) {
    return prisma.formSubmission.update({
      where: { id },
      data: { status },
    });
  },

  async delete(id: string) {
    return prisma.formSubmission.delete({ where: { id } });
  },

  async deleteByFormId(formId: string) {
    return prisma.formSubmission.deleteMany({ where: { formId } });
  },
};
