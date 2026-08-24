import { useCallback, useEffect, useState } from 'react'
import type { AdminUser } from '../types/admin'
import type { ManagedWebsite } from '../types/website'
import { adminService } from '../services/adminService'
import { websiteService } from '../services/websiteService'
import { AdminStackCard } from '../components/dashboard/AdminStackCard'
import { WebsiteCard } from '../components/dashboard/WebsiteCard'
import { PlatformInsights } from '../components/dashboard/PlatformInsights'
import { AdminActivity } from '../components/dashboard/AdminActivity'
import { CreateAdminModal } from '../components/admin/CreateAdminModal'
import { Button } from '../components/ui/Button'
import { Pill } from '../components/ui/Pill'
import { PlusIcon } from '../components/icons'
import { apiErrorMessage } from '../lib/api'

export function Dashboard() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [websites, setWebsites] = useState<ManagedWebsite[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [adminResult, websiteResult] = await Promise.all([
        adminService.list(),
        websiteService.list(),
      ])
      setAdmins(adminResult)
      setWebsites(websiteResult)
    } catch (err) {
      setError(
        apiErrorMessage(
          err,
          'Could not load dashboard data. Is the backend running?',
        ),
      )
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleAdminCreated = (admin: AdminUser) => {
    setAdmins((current) => [...current, admin])
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <header className="mb-10 animate-dash-rise">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-eyebrow">
          Overview
        </p>
        <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink">
          Master Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Manage administrators and the {websites.length} websites under your
          control.
        </p>
      </header>

      {error ? (
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3">
          <p className="min-w-0 flex-1 text-sm font-medium text-danger">
            {error}
          </p>
          <Button size="sm" variant="secondary" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : null}

      <section
        aria-labelledby="admin-stack-title"
        className="mb-10 animate-dash-rise"
        style={{ animationDelay: '40ms' }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2
            id="admin-stack-title"
            className="text-xl font-semibold text-ink"
          >
            Administration
          </h2>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <PlusIcon className="h-4 w-4" />
            New admin
          </Button>
        </div>
        <AdminStackCard
          adminCount={admins.length}
          onClick={() => setModalOpen(true)}
        />
      </section>

      <section aria-labelledby="websites-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="websites-title" className="text-xl font-semibold text-ink">
            Managed websites
          </h2>
          <Pill variant="brand">{websites.length} sites</Pill>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {websites.map((website, index) => (
            <WebsiteCard key={website.id} website={website} index={index} />
          ))}
        </div>
      </section>

      <AdminActivity />

      <PlatformInsights admins={admins} websites={websites} />

      <CreateAdminModal
        open={modalOpen}
        websites={websites}
        onClose={() => setModalOpen(false)}
        onCreated={handleAdminCreated}
      />
    </div>
  )
}
