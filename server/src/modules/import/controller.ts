import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { assertCanManageOrg } from '../organization/service';
import { organizationRepository } from '../organization/repository';
import { importService } from './service';

export const importController = {
  run: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await assertCanManageOrg(req, id);

    const org = await organizationRepository.findById(id);
    if (!org) throw ApiError.notFound('Organization not found');

    const result = await importService.run(
      { id: org.id, slug: org.slug },
      req.body,
      { user: req.user },
    );
    ok(res, result, 'Import complete');
  }),
};
