import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation';
import { Footer } from './components/layout/Footer';

const HomePage         = lazy(() => import('./pages/HomePage'));
const ProjectsPage     = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage= lazy(() => import('./pages/ProjectDetailPage'));
const ResearchPage     = lazy(() => import('./pages/ResearchPage'));
const AboutPage        = lazy(() => import('./pages/AboutPage'));
const ContactPage      = lazy(() => import('./pages/ContactPage'));
const NotFoundPage     = lazy(() => import('./pages/NotFoundPage'));

function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-deep-navy)',
      color: 'var(--color-silicon-silver)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      letterSpacing: '0.1em',
    }}>
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/projects"    element={<ProjectsPage />} />
            <Route path="/projects/:id"element={<ProjectDetailPage />} />
            <Route path="/research"    element={<ResearchPage />} />
            <Route path="/about"       element={<AboutPage />} />
            <Route path="/contact"     element={<ContactPage />} />
            <Route path="*"            element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
