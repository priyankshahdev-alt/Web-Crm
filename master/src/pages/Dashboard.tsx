import { useCallback, useEffect, useState } from 'react'
import type { AdminUser } from '../types/admin'
import { MANAGED_WEBSITES } from '../data/websites'
import { adminService } from '../services/adminService'
import { AdminStackCard } from '../components/dashboard/AdminStackCard'
import { AdminTable } from '../components/dashboard/AdminTable'
import { WebsiteCard } from '../components/dashboard/WebsiteCard'
import { PlatformInsights } from '../components/dashboard/PlatformInsights'
import { CreateAdminModal } from '../components/admin/CreateAdminModal'
import { Button } from '../components/ui/Button'
import { Pill } from '../components/ui/Pill'
import { PlusIcon } from '../components/icons'

export function Dashboard() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const loadAdmins = useCallback(async () => {
    setLoading(true)
    try {
      const result = await adminService.list()
      setAdmins(result)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadAdmins()
  }, [loadAdmins])

  const handleAdminCreated = (admin: AdminUser) => {
    setAdmins((current) => [...current, admin])
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <header className="mb-10 animate-rise">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-eyebrow">
          Overview
        </p>
        <h1 className="mt-2 text-[32px] font-bold leading-tight tracking-[-0.02em] text-ink">
          Master Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Manage administrators and the {MANAGED_WEBSITES.length} websites
          under your control.
        </p>
      </header>

      <section
        aria-labelledby="admin-stack-title"
        className="mb-10 animate-rise"
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

      <section
        aria-labelledby="admin-list-title"
        className="mb-10 animate-rise"
        style={{ animationDelay: '80ms' }}
      >
        <h2
          id="admin-list-title"
          className="mb-4 text-xl font-semibold text-ink"
        >
          Admin users
        </h2>
        <AdminTable admins={admins} loading={loading} />
      </section>

      <section aria-labelledby="websites-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="websites-title" className="text-xl font-semibold text-ink">
            Managed websites
          </h2>
          <Pill variant="brand">{MANAGED_WEBSITES.length} sites</Pill>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MANAGED_WEBSITES.map((website, index) => (
            <WebsiteCard key={website.id} website={website} index={index} />
          ))}
        </div>
      </section>

      <PlatformInsights admins={admins} />

      <CreateAdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleAdminCreated}
      />
    </div>
  )
}
