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
      req,
    );
    ok(res, result, 'Website switched');
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.body?.refreshToken ?? '', req);
    ok(res, true, 'Logged out');
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.id, req.body, req);
    ok(res, true, 'Password changed');
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.me(req.user!.id);
    ok(res, result, 'OK');
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.updateProfile(req.user!.id, req.body, req);
    ok(res, result, 'Profile updated successfully');
  }),

  changeEmail: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.changeEmail(req.user!.id, req.body, req);
    ok(res, result, 'OK');
  }),

  listSessions: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.listSessions(req.user!.id);
    ok(res, result, 'OK');
  }),

  revokeSession: asyncHandler(async (req: Request, res: Response) => {
    await authService.revokeSession(req.user!.id, req.params.id, req);
    ok(res, true, 'Session revoked');
  }),

  revokeAllOtherSessions: asyncHandler(async (req: Request, res: Response) => {
    const { currentFamilyId } = req.body as { currentFamilyId?: string };
    await authService.revokeAllOtherSessions(req.user!.id, currentFamilyId ?? '', req);
    ok(res, true, 'All other sessions revoked');
  }),

  impersonate: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.impersonate(req.body, req.user!);
    ok(res, result, 'Login ticket created');
  }),

  exchangeImpersonate: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.exchangeImpersonate(req.body, req);
    ok(res, result, 'Logged in');
  }),
};
