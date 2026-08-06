import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useSession } from './context/SessionContext'
import { AppShell } from './components/layout/AppShell'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { PagesPage } from './pages/PagesPage'
import { HomepageEditorPage } from './pages/HomepageEditorPage'
import { WebsiteEditorPage } from './pages/WebsiteEditorPage'
import { AboutPage } from './pages/AboutPage'
import { ProgramsPage } from './pages/ProgramsPage'
import { EventsPage } from './pages/EventsPage'
import { GalleryPage } from './pages/GalleryPage'
import { BlogsPage } from './pages/BlogsPage'
import { TeamPage } from './pages/TeamPage'
import { TestimonialsPage } from './pages/TestimonialsPage'
import { MediaPage } from './pages/MediaPage'
import { FormsPage } from './pages/FormsPage'
import { MenusPage } from './pages/MenusPage'
import { SeoPage } from './pages/SeoPage'
import { SettingsPage } from './pages/SettingsPage'
import { ActivityLogsPage } from './pages/ActivityLogsPage'
import { ApprovalsPage } from './pages/ApprovalsPage'
import { ProfilePage } from './pages/ProfilePage'

function RequireSession() {
  const { session } = useSession()
  return session ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireSession />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pages" element={<PagesPage />} />
          <Route path="/homepage" element={<HomepageEditorPage />} />
          <Route path="/website-editor" element={<WebsiteEditorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/menus" element={<MenusPage />} />
          <Route path="/seo" element={<SeoPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/activity" element={<ActivityLogsPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
