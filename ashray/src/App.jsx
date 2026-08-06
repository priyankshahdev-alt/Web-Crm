import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import ScrollProgress from './components/ScrollProgress/ScrollProgress';
import './styles/global.css';
import './styles/responsive.css';
import './styles/new-theme.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ScrollProgress />
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <div id="main" tabIndex={-1} className="outline-none">
        <AppRoutes />
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
