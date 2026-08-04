import { http } from '../lib/axios'
import type {
  ApiKeyCreateInput,
  ApiKeyRecord,
  DomainVerificationMethod,
  VerifiedDomain,
} from '../types'

/** List API keys for an organization. */
export async function getApiKeys(orgId: string): Promise<ApiKeyRecord[]> {
  return http.get<ApiKeyRecord[]>(`/organizations/${orgId}/api-keys`)
}

/** Create an API key. The returned `key` is shown only once. */
export async function createApiKey(
  orgId: string,
  input: ApiKeyCreateInput,
): Promise<ApiKeyRecord> {
  return http.post<ApiKeyRecord>(`/organizations/${orgId}/api-keys`, input)
}

/** Revoke (permanently disable) an API key. */
export async function revokeApiKey(orgId: string, keyId: string): Promise<boolean> {
  return http.delete<boolean>(`/organizations/${orgId}/api-keys/${keyId}`)
}

/** List claimed external domains for an organization. */
export async function getDomains(orgId: string): Promise<VerifiedDomain[]> {
  return http.get<VerifiedDomain[]>(`/organizations/${orgId}/verify`)
}

/** Claim a domain for verification. */
export async function claimDomain(
  orgId: string,
  input: { domain: string; method: DomainVerificationMethod },
): Promise<VerifiedDomain> {
  return http.post<VerifiedDomain>(`/organizations/${orgId}/verify`, input)
}

/** Re-check a claimed domain against the published verification token. */
export async function checkDomain(
  orgId: string,
  domainId: string,
  method: DomainVerificationMethod,
): Promise<VerifiedDomain> {
  return http.post<VerifiedDomain>(
    `/organizations/${orgId}/verify/${domainId}/check`,
    { method },
  )
}
