import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Copy,
  Globe,
  KeyRound,
  Loader2,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Modal from '../components/Modal'
import {
  checkDomain,
  claimDomain,
  createApiKey,
  getApiKeys,
  getDomains,
  revokeApiKey,
} from '../services/ucsService'
import { getOrganization } from '../services/organizationService'
import type {
  ApiKeyRecord,
  DomainVerificationMethod,
  VerifiedDomain,
} from '../types'
import { useAuth } from '../context/AuthContext'
import '../styles/pages.css'

function getErrorMessage(error: unknown): string {
  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? 'Something went wrong. Please try again.'
  )
}

const METHODS: Array<{ value: DomainVerificationMethod; label: string }> = [
  { value: 'META_TAG', label: 'Meta tag' },
  { value: 'FILE', label: 'Verification file' },
  { value: 'DNS_TXT', label: 'DNS TXT record' },
]

const SCOPES = ['site:read', 'site:import'] as const

function DomainStatus({ status }: { status: VerifiedDomain['status'] }) {
  return (
    <span
      className={`status-badge ${
        status === 'VERIFIED'
          ? 'status-badge--active'
          : status === 'PENDING'
            ? 'status-badge--pending'
            : 'status-badge--inactive'
      }`}
    >
      {status.toLowerCase()}
    </span>
  )
}

function CreateKeyModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (name: string, scopes: string[]) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [scopes, setScopes] = useState<string[]>(['site:read'])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  function toggleScope(scope: string) {
    setScopes((current) =>
      current.includes(scope)
        ? current.filter((item) => item !== scope)
        : [...current, scope],
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (name.trim().length === 0) return
    setIsSaving(true)
    setError('')
    try {
      await onSave(name.trim(), scopes)
    } catch (saveError) {
      setError(getErrorMessage(saveError))
      setIsSaving(false)
    }
  }

  return (
    <Modal title="Create API Key" onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="modal-form__error">{error}</div>}

        <div className="input-group">
          <label className="input-group__label" htmlFor="api-key-name">
            Key Name
          </label>
          <input
            id="api-key-name"
            className="input"
            type="text"
            value={name}
            placeholder="e.g. External static site"
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <fieldset className="input-group">
          <legend className="input-group__label">Scopes</legend>
          {SCOPES.map((scope) => (
            <label key={scope} className="checkbox-row">
              <input
                type="checkbox"
                checked={scopes.includes(scope)}
                onChange={() => toggleScope(scope)}
              />
              <span>
                <strong>{scope}</strong>
                <small className="checkbox-row__hint">
                  {scope === 'site:read'
                    ? 'Pull published site content (ucs pull).'
                    : 'Import content into the website (ucs import).'}
                </small>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="modal__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSaving || name.trim().length === 0}
          >
            {isSaving ? (
              <>
                <Loader2 className="spin" size={16} />
                Creating...
              </>
            ) : (
              <>
                <KeyRound size={16} />
                Create Key
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ClaimDomainModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (domain: string, method: DomainVerificationMethod) => Promise<void>
}) {
  const [domain, setDomain] = useState('')
  const [method, setMethod] = useState<DomainVerificationMethod>('META_TAG')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (domain.trim().length === 0) return
    setIsSaving(true)
    setError('')
    try {
      await onSave(domain.trim(), method)
    } catch (saveError) {
      setError(getErrorMessage(saveError))
      setIsSaving(false)
    }
  }

  return (
    <Modal title="Verify Domain" onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="modal-form__error">{error}</div>}

        <div className="input-group">
          <label className="input-group__label" htmlFor="claim-domain">
            Domain
          </label>
          <input
            id="claim-domain"
            className="input"
            type="text"
            value={domain}
            placeholder="e.g. example.org"
            onChange={(event) => setDomain(event.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-group__label" htmlFor="claim-method">
            Verification Method
          </label>
          <select
            id="claim-method"
            className="input"
            value={method}
            onChange={(event) =>
              setMethod(event.target.value as DomainVerificationMethod)
            }
          >
            {METHODS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="modal__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSaving || domain.trim().length === 0}
          >
            {isSaving ? (
              <>
                <Loader2 className="spin" size={16} />
                Claiming...
              </>
            ) : (
              <>
                <Globe size={16} />
                Claim Domain
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function copyText(text: string) {
  if (navigator.clipboard) {
    void navigator.clipboard.writeText(text)
  }
}

function Ucs() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [orgName, setOrgName] = useState('')
  const [keys, setKeys] = useState<ApiKeyRecord[]>([])
  const [domains, setDomains] = useState<VerifiedDomain[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false)
  const [isClaimDomainOpen, setIsClaimDomainOpen] = useState(false)
  const [newKey, setNewKey] = useState<ApiKeyRecord | null>(null)
  const [activeInstructions, setActiveInstructions] = useState<VerifiedDomain | null>(null)
  const [checkingId, setCheckingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const canManage =
    user?.isMaster === true || user?.permissions?.includes('organization:settings') === true

  const load = useCallback(async () => {
    if (!id) return
    setError('')
    try {
      const [orgData, keysData, domainsData] = await Promise.all([
        getOrganization(id),
        getApiKeys(id),
        getDomains(id),
      ])
      setOrgName(orgData.name)
      setKeys(keysData)
      setDomains(domainsData)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    async function run() {
      setIsLoading(true)
      await load()
      if (!cancelled) setIsLoading(false)
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [load])

  async function handleCreateKey(name: string, scopes: string[]) {
    if (!id) return
    const created = await createApiKey(id, { name, scopes })
    setKeys(await getApiKeys(id))
    setIsCreateKeyOpen(false)
    setNewKey(created)
  }

  async function handleRevokeKey(keyId: string) {
    if (!id) return
    const key = keys.find((item) => item.id === keyId)
    const confirmed = window.confirm(`Revoke API key "${key?.name ?? ''}"? This cannot be undone.`)
    if (!confirmed) return
    setError('')
    try {
      await revokeApiKey(id, keyId)
      setKeys(await getApiKeys(id))
    } catch (revokeError) {
      setError(getErrorMessage(revokeError))
    }
  }

  async function handleClaimDomain(domain: string, method: DomainVerificationMethod) {
    if (!id) return
    const claimed = await claimDomain(id, { domain, method })
    setDomains(await getDomains(id))
    setIsClaimDomainOpen(false)
    setActiveInstructions(claimed)
  }

  async function handleCheck(domainId: string, method: DomainVerificationMethod) {
    if (!id) return
    setCheckingId(domainId)
    setError('')
    try {
      const result = await checkDomain(id, domainId, method)
      setDomains(await getDomains(id))
      if (result.status === 'VERIFIED') {
        setActiveInstructions(result)
      }
    } catch (checkError) {
      setError(getErrorMessage(checkError))
    } finally {
      setCheckingId(null)
    }
  }

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <Link to={`/websites/${id}`} className="back-link">
            <ArrowLeft size={15} />
            Back to {orgName || 'Website'}
          </Link>
          <h1 className="page__title">UCS — Site Sync</h1>
          <p className="page__subtitle">
            Connect an external static site: verify your domain and issue API keys for
            `ucs import` and `ucs pull`.
          </p>
        </div>
      </header>

      {error && <div className="page-error">{error}</div>}

      {isLoading ? (
        <div className="card dashboard-panel" aria-busy="true">
          <div className="skeleton skeleton--bar" style={{ width: '40%' }} />
          <div className="skeleton skeleton--bar" style={{ width: '80%' }} />
        </div>
      ) : (
        <>
          <section className="card settings-section">
            <div className="settings-section__head">
              <div>
                <h2 className="settings-section__title">
                  <KeyRound size={16} /> API Keys
                </h2>
                <p className="settings-section__hint">
                  Keys let the UCS CLI import and pull content without an admin login.
                </p>
              </div>
              {canManage && (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setIsCreateKeyOpen(true)}
                >
                  <Plus size={16} />
                  Create Key
                </button>
              )}
            </div>

            {keys.length === 0 ? (
              <div className="empty-state empty-state--compact">
                <KeyRound size={24} />
                <p className="empty-state__title">No API keys yet</p>
                <p className="empty-state__hint">
                  Create a key after verifying a domain to keep an external site in sync.
                </p>
              </div>
            ) : (
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Prefix</th>
                      <th>Scopes</th>
                      <th>Status</th>
                      <th>Last used</th>
                      <th className="table__right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((key) => (
                      <tr key={key.id}>
                        <td>{key.name}</td>
                        <td>
                          <code>{key.keyPrefix}…</code>
                        </td>
                        <td>{key.scopes.join(', ')}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              key.isActive
                                ? 'status-badge--active'
                                : 'status-badge--inactive'
                            }`}
                          >
                            {key.isActive ? 'active' : 'revoked'}
                          </span>
                        </td>
                        <td>
                          {key.lastUsedAt
                            ? new Date(key.lastUsedAt).toLocaleString()
                            : 'Never'}
                        </td>
                        <td className="table__right">
                          {canManage && key.isActive && (
                            <button
                              type="button"
                              className="icon-btn icon-btn--danger"
                              aria-label={`Revoke ${key.name}`}
                              onClick={() => handleRevokeKey(key.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card settings-section">
            <div className="settings-section__head">
              <div>
                <h2 className="settings-section__title">
                  <Shield size={16} /> Verified Domains
                </h2>
                <p className="settings-section__hint">
                  Proof that an external site belongs to this organization.
                </p>
              </div>
              {canManage && (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setIsClaimDomainOpen(true)}
                >
                  <Globe size={16} />
                  Verify Domain
                </button>
              )}
            </div>

            {domains.length === 0 ? (
              <div className="empty-state empty-state--compact">
                <Globe size={24} />
                <p className="empty-state__title">No domains claimed</p>
                <p className="empty-state__hint">
                  Claim a domain and publish the token to prove ownership.
                </p>
              </div>
            ) : (
              <div className="table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Domain</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th className="table__right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.map((domain) => (
                      <tr key={domain.id}>
                        <td>{domain.domain}</td>
                        <td>{domain.method.replace('_', ' ').toLowerCase()}</td>
                        <td>
                          <DomainStatus status={domain.status} />
                        </td>
                        <td className="table__right">
                          {canManage && (
                            <button
                              type="button"
                              className="icon-btn"
                              aria-label={`Re-check ${domain.domain}`}
                              disabled={checkingId === domain.id}
                              onClick={() => handleCheck(domain.id, domain.method)}
                            >
                              {checkingId === domain.id ? (
                                <Loader2 className="spin" size={16} />
                              ) : (
                                <RefreshCw size={16} />
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}

      {isCreateKeyOpen && (
        <CreateKeyModal
          onClose={() => setIsCreateKeyOpen(false)}
          onSave={handleCreateKey}
        />
      )}

      {isClaimDomainOpen && (
        <ClaimDomainModal
          onClose={() => setIsClaimDomainOpen(false)}
          onSave={handleClaimDomain}
        />
      )}

      {newKey && (
        <Modal
          title="API Key Created — Copy it now"
          onClose={() => setNewKey(null)}
        >
          <div className="modal-form">
            <div className="notice notice--info">
              <BadgeCheck size={16} />
              <span>
                This key is shown only once. Store it in your site&apos;s{' '}
                <code>.webcrm/config.json</code> (the UCS CLI saves it automatically
                after domain verification).
              </span>
            </div>
            <div className="copy-row">
              <code className="copy-row__value">{newKey.key ?? ''}</code>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  copyText(newKey.key ?? '')
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1500)
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="modal-form__hint">
              Scopes: {newKey.scopes.join(', ')} — created{' '}
              {new Date(newKey.createdAt).toLocaleString()}
            </p>
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setNewKey(null)}
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {activeInstructions && (
        <Modal
          title={
            activeInstructions.status === 'VERIFIED'
              ? `Domain verified: ${activeInstructions.domain}`
              : `Verification instructions: ${activeInstructions.domain}`
          }
          onClose={() => setActiveInstructions(null)}
        >
          <div className="modal-form">
            {activeInstructions.instructions?.length ? (
              <div className="instructions-list">
                {activeInstructions.instructions.map((line, index) => (
                  <p key={index} className="instructions-list__line">
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p>
                Verification token:{' '}
                <code>{activeInstructions.token}</code>
              </p>
            )}

            {activeInstructions.apiKey && (
              <div className="notice notice--success">
                <BadgeCheck size={16} />
                <span>
                  Site API key issued:{' '}
                  <code className="notice__code">
                    {activeInstructions.apiKey.key}
                  </code>
                </span>
              </div>
            )}

            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setActiveInstructions(null)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Ucs
