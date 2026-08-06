import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import { useSite } from './context/SiteContext';
import Home from './pages/Home';
import AboutBSCT from './pages/AboutBSCT';
import Management from './pages/Management';
import MissionVision from './pages/MissionVision';
import TrustDocuments from './pages/TrustDocuments';
import WhereWeWork from './pages/WhereWeWork';
import Awards from './pages/Awards';
import CSR from './pages/CSR';
import Careers from './pages/Careers';
import ContactUs from './pages/ContactUs';
import Press from './pages/Press';
import Newspaper from './pages/Newspaper';
import Terms from './pages/Terms';
import Photos from './pages/Photos';
import Donation2 from './pages/Donation2';
import IndividualDonation from './pages/IndividualDonation';
import QuickDonate from './pages/QuickDonate';
import MissionAnnapurna from './pages/MissionAnnapurna';
import MissionVidhya from './pages/MissionVidhya';
import MissionAurat from './pages/MissionAurat';
import MissionBezubaan from './pages/MissionBezubaan';
import MissionAtmanirbhar from './pages/MissionAtmanirbhar';
import MissionWellness from './pages/MissionWellness';
import SevakSevaKendra from './pages/SevakSevaKendra';
import SevakNivash from './pages/SevakNivash';
import MissionEco from './pages/MissionEco';
import MissionBeach from './pages/MissionBeach';
import Anndaan from './pages/Anndaan';
import NGOCollaboration from './pages/NGOCollaboration';
import SchoolCollaboration from './pages/SchoolCollaboration';
import ImpactTricycle from './pages/ImpactTricycle';
import ImpactSewingMachine from './pages/ImpactSewingMachine';
import ImpactSanitaryPad from './pages/ImpactSanitaryPad';
import ImpactRozgaarBooth from './pages/ImpactRozgaarBooth';
import ImpactHealthToHygiene from './pages/ImpactHealthToHygiene';
import ImpactFlourMill from './pages/ImpactFlourMill';
import ImpactEmergencyMedical from './pages/ImpactEmergencyMedical';
import ImpactDialysisCentre from './pages/ImpactDialysisCentre';
import ImpactDialysisCenter from './pages/ImpactDialysisCenter';
import ImpactBottleCrusher from './pages/ImpactBottleCrusher';
import ImpactBabyFeeding from './pages/ImpactBabyFeeding';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function SeoManager() {
  const { pathname } = useLocation();
  const { getPage, getSetting, isLive } = useSite();
  useEffect(() => {
    const slug = pathname === '/' ? 'home' : pathname.replace(/^\//, '').split('/')[0];
    const page = getPage(slug);
    const name = getSetting('site.siteName', 'Being Sevak Charitable Trust');
    const tagline = getSetting('site.tagline', '');
    const pageTitle = page?.metaTitle || page?.title || '';
    document.title = pageTitle ? `${pageTitle} — ${name}` : (tagline ? `${name} — ${tagline}` : name);
    const description = page?.metaDescription || getSetting('site.description', '');
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    if (description) meta.content = description;
  }, [pathname, isLive, getPage, getSetting]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <SeoManager />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutBSCT />} />
        <Route path="/management" element={<Management />} />
        <Route path="/mission-vision" element={<MissionVision />} />
        <Route path="/trust-documents" element={<TrustDocuments />} />
        <Route path="/where-we-work" element={<WhereWeWork />} />
        <Route path="/awards" element={<Awards />} />
        <Route path="/csr" element={<CSR />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/press" element={<Press />} />
        <Route path="/newspaper" element={<Newspaper />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/donate" element={<Donation2 />} />
        <Route path="/individual-donation" element={<IndividualDonation />} />
        <Route path="/quick-donate" element={<QuickDonate />} />
        <Route path="/mission-annapurna" element={<MissionAnnapurna />} />
        <Route path="/mission-vidhya" element={<MissionVidhya />} />
        <Route path="/mission-aurat" element={<MissionAurat />} />
        <Route path="/mission-bezubaan" element={<MissionBezubaan />} />
        <Route path="/mission-atmanirbhar" element={<MissionAtmanirbhar />} />
        <Route path="/mission-wellness" element={<MissionWellness />} />
        <Route path="/sevak-seva-kendra" element={<SevakSevaKendra />} />
        <Route path="/sevak-nivash" element={<SevakNivash />} />
        <Route path="/mission-eco" element={<MissionEco />} />
        <Route path="/mission-beach" element={<MissionBeach />} />
        <Route path="/anndaan" element={<Anndaan />} />
        <Route path="/ngo-collaboration" element={<NGOCollaboration />} />
        <Route path="/school-collaboration" element={<SchoolCollaboration />} />
        <Route path="/impact/tricycle" element={<ImpactTricycle />} />
        <Route path="/impact/sewing-machine" element={<ImpactSewingMachine />} />
        <Route path="/impact/sanitary-pad" element={<ImpactSanitaryPad />} />
        <Route path="/impact/rozgaar-booth" element={<ImpactRozgaarBooth />} />
        <Route path="/impact/health-to-hygiene" element={<ImpactHealthToHygiene />} />
        <Route path="/impact/flour-mill" element={<ImpactFlourMill />} />
        <Route path="/impact/emergency-medical" element={<ImpactEmergencyMedical />} />
        <Route path="/impact/dialysis-centre" element={<ImpactDialysisCentre />} />
        <Route path="/impact/dialysis-center" element={<ImpactDialysisCenter />} />
        <Route path="/impact/bottle-crusher" element={<ImpactBottleCrusher />} />
        <Route path="/impact/baby-feeding" element={<ImpactBabyFeeding />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
    </Router>
  );
}

export default App;
