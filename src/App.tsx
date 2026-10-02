import { useCallback, useEffect } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Seo } from "./components/Seo";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Properties } from "./components/Properties";
import { Gallery } from "./components/Gallery";
import { Amenities, Legal, Location } from "./components/Sections";
import { Faq } from "./components/Faq";
import { Contact } from "./components/Contact";
import { Posters } from "./components/Posters";
import { SharePoster } from "./components/SharePoster";
import { FloatingActions, Footer, StickyMobileBar } from "./components/Footer";
import { initAnalytics } from "./lib/analytics";

/**
 * Page composition only. All content lives in src/data, all business facts in
 * src/config/site.ts, all behaviour in the components.
 *
 * App.tsx went from 1039 lines to under 60.
 */
export default function App() {
  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <ErrorBoundary>
      <Seo />
      <Navbar onNavigate={scrollTo} />

      <main className="bg-slate-950 text-white min-h-screen font-sans">
        <Hero onViewProperties={() => scrollTo("properties")} />
        <Properties />
        <Gallery />
        <Amenities />
        <Location />
        <Legal />
        <Faq />
        <Contact />
        <Posters />
        <SharePoster />
      </main>

      <Footer onNavigate={scrollTo} />
      <FloatingActions />
      <StickyMobileBar />
    </ErrorBoundary>
  );
}