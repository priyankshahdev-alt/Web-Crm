export interface ActiveOrg {
  id: string;
  slug: string;
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  isMaster: boolean;
  roles: string[];
  permissions: string[];
  websiteId?: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}
