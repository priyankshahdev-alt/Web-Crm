import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import ManagementTeam from '../pages/About/ManagementTeam';
import LegalDocuments from '../pages/About/LegalDocuments';
import Programs from '../pages/Programs/Programs';
import GalleryPage from '../pages/Gallery/GalleryPage';
import Donate from '../pages/Donate/Donate';
import Volunteer from '../pages/Volunteer/Volunteer';
import Contact from '../pages/Contact/Contact';
import Medical from '../pages/Programs/Medical';
import Education from '../pages/Programs/Education';
import HungerDrive from '../pages/Programs/HungerDrive';
import JalProject from '../pages/Programs/JalProject';
import WomenEmpowerment from '../pages/Programs/WomenEmpowerment';
import Orphanage from '../pages/Programs/Orphanage';
import OldAgeHome from '../pages/Programs/OldAgeHome';
import PashuPremi from '../pages/Programs/PashuPremi';
import MedicalSupport from '../pages/Appeals/AppealsMedical';
import ContactUs from '../pages/Contact/Contact'
import UiInteractions from '../pages/UiInteractions/UiInteractions';
// import Appealsfoodgrains from '../pages/Appeals/Appealsfoodgrains';
// import Appealseducation from '../pages/Appeals/Appealseducation';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/about/management-team" element={<ManagementTeam />} />
      <Route path="/about/legal-documents" element={<LegalDocuments />} />
      <Route path="/ContactUs" element={<ContactUs />} />
      <Route path="/donate" element={<Donate />} />

      <Route path="/programs" element={<Programs />} />
      <Route path="/programs/medical" element={<Medical />} />
      <Route path="/programs/education" element={<Education />} />
      <Route path="/programs/women-empowerment" element={<WomenEmpowerment />} />
      <Route path="/programs/zero-hunger-drive" element={<HungerDrive />} />
      <Route path="/programs/jal-project" element={<JalProject />} />
      <Route path="/programs/orphanage" element={<Orphanage />} />
      <Route path="/programs/old-age-home" element={<OldAgeHome />} />
      <Route path="/programs/pashu-premi" element={<PashuPremi />} />

      {/* APPEALS */}
      <Route path="/Appeals/Medical" element={<MedicalSupport />} />
      {/* <Route path="/appeals/foodgrains" element={<Appealsfoodgrains />} /> */}
      {/* <Route path="/appeals/education" element={<Appealseducation />} /> */}

      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/ui-interactions" element={<UiInteractions />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/volunteer" element={<Volunteer />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default AppRoutes;