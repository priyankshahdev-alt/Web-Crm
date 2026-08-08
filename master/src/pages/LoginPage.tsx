import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getCurrentMaster } from '../lib/session'
import { useAuth } from '../context/AuthContext'
import { apiErrorMessage } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DashboardIcon } from '../components/icons'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (getCurrentMaster()) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !password) {
      setError('Enter your email and password to continue.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await login({ email: trimmed, password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(apiErrorMessage(err, 'Sign in failed. Check your credentials.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-5 shadow-pop sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
            <DashboardIcon className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-ink">Master Panel</h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to manage administrators, roles and websites.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
            autoComplete="email"
            placeholder="master@webcrm.com"
          />
          <Input
            label="Password"
            type="password"
            revealable
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
            autoComplete="current-password"
            placeholder="Enter your password"
          />

          {error ? (
            <p className="text-sm font-medium text-danger">{error}</p>
          ) : null}

          <Button type="submit" size="lg" fullWidth loading={submitting}>
            Sign in
          </Button>
        </form>

      </div>
    </main>
  )
}
