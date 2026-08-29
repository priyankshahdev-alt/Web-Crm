import { useEffect, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import type { CmsPage } from '../types'
import { cmsService } from '../services/cms'
import { PageContentEditor } from '../components/pages/PageContentEditor'
import { PageHeader } from '../components/ui/PageHeader'
import { CardSkeleton } from '../components/ui/Skeleton'

export function PageSiteEditorPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState<CmsPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      try {
        const pages = await cmsService.allPages()
        if (!active) return
        const found =
          pages.find((p) => p.slug === slug) ?? pages.find((p) => p.isHome) ?? null
        setPage(found)
      } catch {
        if (active) setPage(null)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader title="Loading page…" />
        <CardSkeleton />
      </div>
    )
  }

  if (!page) return <Navigate to="/pages" replace />

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        eyebrow="Website pages"
        title={page.title}
        description={`/${page.slug} · Edit the content and sections of this page. Changes are saved per section.`}
      />
      <PageContentEditor
        page={page}
        onClose={() => navigate('/pages')}
      />
    </div>
  )
}
