import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { CustomCursor } from './components/CustomCursor';
import { LiquidCanvas } from './components/LiquidCanvas';
import { NoiseOverlay } from './components/NoiseOverlay';

import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { Portfolio } from './sections/Portfolio';
import { About } from './sections/About';
import { RiskReversal } from './sections/RiskReversal';
import { Contact } from './sections/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';

import { ScrollTrigger } from './lib/gsap';
import { getLenis } from './lib/lenis';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useGlobalSoundFx } from './hooks/useSound';

/** Resets scroll position on route change and refreshes ScrollTrigger. */
const RouteScrollReset = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Jump instantly — an animated scroll on navigation feels broken.
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Layout changed — let ScrollTrigger recalculate all start/end positions.
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
};

const Home = () => (
  <>
    <Hero />
    <Services />
    <Portfolio />
    <About />
    <RiskReversal />
    <Contact />
  </>
);

export default function App() {
  // Lenis + ScrollTrigger sync, torn down on unmount.
  useSmoothScroll();

  // Delegated hover/click sounds for every interactive element.
  useGlobalSoundFx();

  return (
    <Router>
      <RouteScrollReset />

      {/* Background WebGL layer — behind everything, never interactive. */}
      <LiquidCanvas />

      <div className="min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>

        <Footer />
        <ScrollToTopButton />
        <Chatbot />
      </div>

      {/* Overlays sit above content but below the cursor. */}
      <NoiseOverlay />
      <CustomCursor />
    </Router>
  );
}
