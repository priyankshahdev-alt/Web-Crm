import { useRef, useState, type ChangeEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { CameraIcon } from '../components/icons'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const cardClass = 'rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8'

export function ProfilePage() {
  const { user } = useAuth()
  const toast = useToast()

  const name = user?.firstName
    ? [user.firstName, user.lastName].filter(Boolean).join(' ')
    : 'Master Admin'
  const email = user?.email ?? ''
  const initial = (user?.firstName?.charAt(0) ?? name.charAt(0) ?? 'M').toUpperCase()
  const roleLabel = user?.isMaster ? 'Master Admin' : 'Site Admin'

  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setPhotoUrl(URL.createObjectURL(file))
    event.target.value = ''
  }

  const handleSave = () => {
    toast.success({
      title: 'Profile updated',
      description: 'Your changes have been saved.',
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <header className="mb-10 animate-rise">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-eyebrow">
          Overview
        </p>
        <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink">
          My Profile
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Manage your personal details and account photo.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <section
          aria-labelledby="profile-photo-title"
          className={`${cardClass} h-fit animate-rise`}
          style={{ animationDelay: '40ms' }}
        >
          <h2
            id="profile-photo-title"
            className="text-lg font-semibold text-ink"
          >
            Profile photo
          </h2>
          <p className="mt-1 text-sm text-muted">
            This image is shown across the console.
          </p>

          <div className="mt-8 flex flex-col items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-brand-soft text-brand ring-4 ring-brand/10">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold">{initial}</span>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoChange}
            />

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => fileRef.current?.click()}
              >
                <CameraIcon className="h-4 w-4" />
                Upload photo
              </Button>
              {photoUrl ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPhotoUrl(null)}
                >
                  Remove
                </Button>
              ) : null}
            </div>

            <p className="text-xs text-muted">PNG or JPG, up to 2MB.</p>
          </div>
        </section>

        <section
          aria-labelledby="profile-details-title"
          className={`${cardClass} animate-rise lg:col-span-2`}
          style={{ animationDelay: '80ms' }}
        >
          <h2
            id="profile-details-title"
            className="text-lg font-semibold text-ink"
          >
            Details
          </h2>
          <p className="mt-1 text-sm text-muted">
            Your platform account details.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Input label="Name" value={name} disabled />
            <Input label="Email" type="email" value={email} disabled />
            <Input
              label="Username"
              value={`@${(user?.firstName ?? 'master').toLowerCase()}`}
              disabled
            />
            <Input label="Role" value={roleLabel} disabled />
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-line pt-6">
            <Button onClick={handleSave}>Save changes</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
