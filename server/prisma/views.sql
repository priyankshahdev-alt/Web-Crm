-- Read-only views for inspecting role assignments in Supabase.
-- The join tables store only roleId; these views surface role names.

CREATE OR REPLACE VIEW public.user_role_view AS
SELECT
  ur.id,
  ur."userId",
  u.email AS user_email,
  ur."roleId",
  r.key AS role_key,
  r.name AS role_name,
  r.scope AS role_scope
FROM public."UserRole" ur
JOIN public."User" u ON u.id = ur."userId"
JOIN public."Role" r ON r.id = ur."roleId";

CREATE OR REPLACE VIEW public.organization_user_view AS
SELECT
  ou.id,
  ou."organizationId",
  o.slug AS organization_slug,
  o.name AS organization_name,
  ou."userId",
  u.email AS user_email,
  ou."roleId",
  r.key AS role_key,
  r.name AS role_name,
  ou."isCurrent",
  ou."isActive",
  ou."createdAt",
  ou."updatedAt"
FROM public."OrganizationUser" ou
JOIN public."Organization" o ON o.id = ou."organizationId"
JOIN public."User" u ON u.id = ou."userId"
JOIN public."Role" r ON r.id = ou."roleId";
