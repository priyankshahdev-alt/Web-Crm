import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import OurStory from "./pages/about/OurStory";
import OurTeam from "./pages/about/OurTeam";
import LegalCertificate from "./pages/about/LegalCertificate";
import ProjectDetail from "./pages/projects/ProjectDetail";
import IndividualSupport from "./pages/getInvolved/IndividualSupport";
import CorporatePartnership from "./pages/getInvolved/CorporatePartnership";
import DonateOnline from "./pages/getInvolved/DonateOnline";
import Career from "./pages/getInvolved/Career";
import Media from "./pages/Media";
import GetInTouch from "./pages/contact/GetInTouch";
import Policy from "./pages/contact/Policy";
import PaymentSuccess from "./pages/PaymentSuccess";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="about/our-story" element={<OurStory />} />
          <Route path="about/our-team" element={<OurTeam />} />
          <Route path="about/legal-certificate" element={<LegalCertificate />} />

          {/* Ek hi component sab 6 projects handle karta hai */}
          <Route path="projects/:slug" element={<ProjectDetail />} />

          <Route path="get-involved/individual-support" element={<IndividualSupport />} />
          <Route path="get-involved/corporate-partnership" element={<CorporatePartnership />} />
          <Route path="get-involved/donate-online" element={<DonateOnline />} />
          <Route path="get-involved/career" element={<Career />} />

          <Route path="media" element={<Media />} />

          <Route path="contact/get-in-touch" element={<GetInTouch />} />
          <Route path="contact/policy" element={<Policy />} />

          <Route path="payment-success" element={<PaymentSuccess />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
