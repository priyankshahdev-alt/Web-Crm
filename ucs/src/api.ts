export interface ApiResult<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: Array<{ code: string; message: string }> | null;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface DomainInstruction {
  id: string;
  domain: string;
  method: string;
  status: string;
  token: string;
  instructions: string[];
}

export interface VerifiedDomain {
  id: string;
  domain: string;
  method: string;
  status: string;
  verifiedAt: string;
  apiKey?: {
    id: string;
    key: string;
    keyPrefix: string;
    name: string;
    scopes: string[];
  };
}

export class ApiClient {
  constructor(
    public baseUrl: string,
    public accessToken?: string,
  ) {}

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/+$/, '')}${path}`;
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (this.accessToken) headers.authorization = `Bearer ${this.accessToken}`;
    return headers;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    let res: Response;
    try {
      res = await fetch(this.url(path), {
        method,
        headers: this.headers(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      throw new ApiError(
        `Could not reach ${this.baseUrl}. Is the WebCrm server running? (${error instanceof Error ? error.message : 'network error'})`,
        0,
      );
    }

    let payload: ApiResult<T>;
    try {
      payload = (await res.json()) as ApiResult<T>;
    } catch {
      throw new ApiError(`Unexpected response (HTTP ${res.status}) from ${this.url(path)}`, res.status);
    }

    if (!res.ok || payload.success === false) {
      const detail = payload.errors?.[0]?.message ?? payload.message ?? 'Unknown error';
      throw new ApiError(detail, res.status);
    }
    return payload.data;
  }

  login(email: string, password: string): Promise<LoginResult> {
    return this.request<LoginResult>('POST', '/auth/login', { email, password });
  }

  getSite(slug: string): Promise<unknown> {
    return this.request<unknown>('GET', `/site/${encodeURIComponent(slug)}`);
  }

  listDomains(orgId: string): Promise<DomainInstruction[]> {
    return this.request<DomainInstruction[]>('GET', `/organizations/${orgId}/verify`);
  }

  claimDomain(
    orgId: string,
    domain: string,
    method: string,
  ): Promise<DomainInstruction> {
    return this.request<DomainInstruction>('POST', `/organizations/${orgId}/verify`, {
      domain,
      method,
    });
  }

  checkDomain(
    orgId: string,
    domainId: string,
    method: string,
  ): Promise<VerifiedDomain> {
    return this.request<VerifiedDomain>(
      'POST',
      `/organizations/${orgId}/verify/${domainId}/check`,
      { method },
    );
  }

  importSite(orgId: string, site: unknown, mode = 'merge'): Promise<unknown> {
    return this.request<unknown>('POST', `/organizations/${orgId}/import`, {
      mode,
      dryRun: false,
      site,
    });
  }

  importPreview(orgId: string, site: unknown): Promise<unknown> {
    return this.request<unknown>('POST', `/organizations/${orgId}/import`, {
      mode: 'merge',
      dryRun: true,
      site,
    });
  }
}
