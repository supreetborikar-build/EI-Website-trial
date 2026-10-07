import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider } from './components/Toast';
import SmoothScroll from './components/SmoothScroll';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import About from './pages/About';
import Committee from './pages/Committee';
import Events from './pages/Events';
import News from './pages/News';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <PageTransition>
        <Routes location={location}>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/events" element={<Events />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </PageTransition>
  </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <SmoothScroll>
          <CustomCursor />
          <ScrollProgress />
          <div className="app-container blueprint-paper-canvas" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Navbar />
            <main style={{ flex: 1, position: 'relative' }}>
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </BrowserRouter>
    </ToastProvider>
  );
}
