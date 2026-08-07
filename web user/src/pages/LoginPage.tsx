import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { useToast } from '../context/ToastContext'
import { authService } from '../services/auth'
import { Button } from '../components/ui/Button'
import { Field, Input } from '../components/ui/Input'
import { DashboardIcon, LockIcon, MailIcon, EyeIcon, EyeOffIcon } from '../components/icons'
import { CURRENT_WEBSITE } from '../data/seed'

export function LoginPage() {
  const { signIn } = useSession()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [email, setEmail] = useState('rahul@beingsevak.org')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const result = await authService.login({ email, password })
      if (result) {
        signIn(result)
        toast(`Welcome back, ${result.user.firstName}!`, { variant: 'success' })
        navigate('/', { replace: true })
      } else {
        const message = 'Invalid email or password'
        setError(message)
        toast(message, { variant: 'error' })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed, please try again'
      setError(message)
      toast(message, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-canvas text-ink antialiased">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="animate-rise w-full max-w-sm">
          <div className="rounded-3xl border border-line bg-white p-8 shadow-xl shadow-slate-900/5">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                <DashboardIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-bold">Website CMS</p>
                <p className="text-xs text-muted">Powering {CURRENT_WEBSITE.name}</p>
              </div>
            </div>

            <h1 className="text-xl font-bold text-ink">Welcome back</h1>
            <p className="mt-1 text-sm text-muted">Sign in to manage your website.</p>

            <form onSubmit={(event) => void submit(event)} className="mt-6 space-y-4">
              <Field label="Email address" htmlFor="login-email">
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  leading={<MailIcon className="h-4 w-4" />}
                  required
                />
              </Field>
              <Field label="Password" htmlFor="login-password">
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pr-10"
                    leading={<LockIcon className="h-4 w-4" />}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition hover:text-ink"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              {error ? (
                <div
                  role="alert"
                  className="rounded-xl border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-sm font-medium text-danger"
                >
                  {error}
                </div>
              ) : null}

              <Button type="submit" size="lg" fullWidth loading={loading}>
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
