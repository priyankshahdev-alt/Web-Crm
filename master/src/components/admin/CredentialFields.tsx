import { CheckIcon, CopyIcon } from '../icons'

export type CredentialFieldKey = 'username' | 'password'

interface CredentialFieldsProps {
  username: string
  password: string
  copied: CredentialFieldKey | null
  onCopy: (field: CredentialFieldKey) => void
}

export function CredentialFields({
  username,
  password,
  copied,
  onCopy,
}: CredentialFieldsProps) {
  const field = (label: string, value: string, key: CredentialFieldKey) => (
    <div>
      <span className="block text-sm font-medium text-ink">{label}</span>
      <div className="mt-1.5 flex rounded-xl shadow-sm">
        <div className="min-w-0 flex-1 truncate rounded-l-xl border border-r-0 border-line bg-slate-50 px-3 py-2 text-sm text-ink">
          {value}
        </div>
        <button
          type="button"
          onClick={() => onCopy(key)}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-r-xl border border-l-0 px-3 text-xs font-semibold transition ${
            copied === key
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-line bg-white text-brand hover:bg-brand-soft'
          }`}
        >
          {copied === key ? (
            <CheckIcon className="h-3.5 w-3.5" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
          {copied === key ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {field('Username', username, 'username')}
      {field('Password', password, 'password')}
    </div>
  )
}
