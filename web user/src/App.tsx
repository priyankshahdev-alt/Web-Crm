import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useSession } from './context/SessionContext'
import { AppShell } from './components/layout/AppShell'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { PagesPage } from './pages/PagesPage'
import { PageSiteEditorPage } from './pages/PageSiteEditorPage'
import { HomepageEditorPage } from './pages/HomepageEditorPage'
import { WebsiteEditorPage } from './pages/WebsiteEditorPage'
import { AboutPage } from './pages/AboutPage'
import { ProgramsPage } from './pages/ProgramsPage'
import { EventsPage } from './pages/EventsPage'
import { GalleryPage } from './pages/GalleryPage'
import { GalleryDetailPage } from './pages/GalleryDetailPage'
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
import { ManagementPage } from './pages/sub/ManagementPage'
import { TrustDocumentsPage } from './pages/sub/TrustDocumentsPage'
import { WhereWeWorkPage } from './pages/sub/WhereWeWorkPage'
import { ContactInfoPage } from './pages/sub/ContactInfoPage'
import { EnquiryPage } from './pages/sub/EnquiryPage'
import { GetInvolvedOverviewPage } from './pages/sub/GetInvolvedOverviewPage'
import { IndividualDonationPage } from './pages/sub/IndividualDonationPage'
import { VolunteersPage } from './pages/sub/VolunteersPage'
import { CsrPage } from './pages/sub/CsrPage'
import { SchoolCollaborationPage } from './pages/sub/SchoolCollaborationPage'
import { NgoCollaborationPage } from './pages/sub/NgoCollaborationPage'
import { AwardsPage } from './pages/sub/AwardsPage'
import { PressReleasesPage } from './pages/sub/PressReleasesPage'
import { NewspaperPage } from './pages/sub/NewspaperPage'
import { MissionAnnapurnaPage } from './pages/sub/MissionAnnapurnaPage'
import { MissionVidhyaPage } from './pages/sub/MissionVidhyaPage'
import { MissionAuratPage } from './pages/sub/MissionAuratPage'
import { MissionBezubaanPage } from './pages/sub/MissionBezubaanPage'
import { MissionAtmanirbharPage } from './pages/sub/MissionAtmanirbharPage'
import { MissionArogyaPage } from './pages/sub/MissionArogyaPage'
import { SevakSevaKendraPage } from './pages/sub/SevakSevaKendraPage'
import { EcoWarriorsPage } from './pages/sub/EcoWarriorsPage'

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
          <Route path="/page/:slug" element={<PageSiteEditorPage />} />
          <Route path="/homepage" element={<HomepageEditorPage />} />
          <Route path="/website-editor" element={<WebsiteEditorPage />} />

          {/* About Us */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/management" element={<ManagementPage />} />
          <Route path="/about/trust-documents" element={<TrustDocumentsPage />} />
          <Route path="/about/where-we-work" element={<WhereWeWorkPage />} />

          {/* What We Do */}
          <Route path="/what-we-do" element={<ProgramsPage />} />
          <Route path="/what-we-do/annapurna" element={<MissionAnnapurnaPage />} />
          <Route path="/what-we-do/vidhya" element={<MissionVidhyaPage />} />
          <Route path="/what-we-do/aurat" element={<MissionAuratPage />} />
          <Route path="/what-we-do/bezubaan" element={<MissionBezubaanPage />} />
          <Route path="/what-we-do/atmanirbhar" element={<MissionAtmanirbharPage />} />
          <Route path="/what-we-do/arogya" element={<MissionArogyaPage />} />
          <Route path="/what-we-do/sevak-seva-kendra" element={<SevakSevaKendraPage />} />
          <Route path="/what-we-do/eco-warriors" element={<EcoWarriorsPage />} />

          {/* News & Stories */}
          <Route path="/news" element={<BlogsPage />} />
          <Route path="/news/awards" element={<AwardsPage />} />
          <Route path="/news/press" element={<PressReleasesPage />} />
          <Route path="/news/newspaper" element={<NewspaperPage />} />

          {/* Contact Us */}
          <Route path="/contact" element={<ContactInfoPage />} />
          <Route path="/contact/enquiry" element={<EnquiryPage />} />

          {/* Get Involved */}
          <Route path="/get-involved" element={<GetInvolvedOverviewPage />} />
          <Route path="/get-involved/individual-donation" element={<IndividualDonationPage />} />
          <Route path="/get-involved/volunteers" element={<VolunteersPage />} />
          <Route path="/get-involved/csr" element={<CsrPage />} />
          <Route path="/get-involved/school-collaboration" element={<SchoolCollaborationPage />} />
          <Route path="/get-involved/ngo-collaboration" element={<NgoCollaborationPage />} />

          {/* Standalone */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/gallery/:galleryId" element={<GalleryDetailPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />

          {/* Build */}
          <Route path="/media" element={<MediaPage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/menus" element={<MenusPage />} />

          {/* Optimize */}
          <Route path="/seo" element={<SeoPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* System */}
          <Route path="/activity" element={<ActivityLogsPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
