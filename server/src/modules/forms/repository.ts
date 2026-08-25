import { Prisma } from '@prisma/client';
import { prisma } from '../../libs/prisma';

export interface ListParams {
  organizationId: string;
  skip: number;
  take: number;
  search?: string;
  status?: string;
}

export interface CreateFormInput {
  organizationId: string;
  name: string;
  description?: string | null;
  status?: string;
  submitLabel?: string | null;
  successMessage?: string | null;
  fields: unknown;
  settings?: unknown;
}

export const formRepository = {
  async list(params: ListParams) {
    const where: any = {
      organizationId: params.organizationId,
      ...(params.search
        ? { name: { contains: params.search, mode: 'insensitive' } }
        : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.form.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: params.skip,
        take: params.take,
        include: { _count: { select: { submissions: true } } },
      }),
      prisma.form.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id: string) {
    return prisma.form.findUnique({
      where: { id },
      include: { _count: { select: { submissions: true } } },
    });
  },

  async create(input: CreateFormInput) {
    return prisma.form.create({
      data: {
        organizationId: input.organizationId,
        name: input.name,
        description: input.description ?? null,
        status: input.status ?? 'DRAFT',
        submitLabel: input.submitLabel ?? null,
        successMessage: input.successMessage ?? null,
        fields: input.fields ?? [],
        settings: input.settings ?? Prisma.JsonNull,
      },
    });
  },

  async update(id: string, data: any) {
    return prisma.form.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.form.delete({ where: { id } });
  },

  async countSubmissions(formId: string) {
    return prisma.formSubmission.count({ where: { formId } });
  },
};
