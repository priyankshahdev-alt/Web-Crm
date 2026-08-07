import type { Request, Response } from 'express';
import { authService } from './service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/ApiResponse';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body, req);
    ok(res, result, 'Login successful');
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body, req);
    ok(res, result, 'Token refreshed');
  }),

  switchOrganization: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.switchOrganization(
      req.user!.id,
      req.body.organizationId,
    );
    ok(res, result, 'Website switched');
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.body?.refreshToken ?? '');
    ok(res, true, 'Logged out');
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.id, req.body);
    ok(res, true, 'Password changed');
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.me(req.user!.id);
    ok(res, result, 'OK');
  }),
};
