import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { business } from "../config/site";
import { trackEvent } from "../lib/analytics";
import { navItems } from "../data";

interface Props {
  onNavigate: (id: string) => void;
}

export function Navbar({ onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open, so the page behind it
  // does not scroll away on touch devices.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNavigate = (id: string) => {
    setOpen(false);
    trackEvent("nav_click", { target: id });
    onNavigate(id);
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 border-b transition-colors ${
        scrolled
          ? "bg-slate-950/95 backdrop-blur-md border-emerald-900/30"
          : "bg-slate-950/70 backdrop-blur-sm border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2 shrink-0"
          aria-label={`${business.brand} home`}
        >
          <span className="text-2xl" aria-hidden="true">
            🌿
          </span>
          <span>
            <span className="block text-emerald-400 font-bold text-sm leading-none uppercase tracking-wide">
              {business.tagline}
            </span>
            <span className="block text-slate-400 text-xs">
              {business.brand}
            </span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="hover:text-emerald-400 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/919505903371"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { source: "navbar" })}
            className="hidden sm:inline-flex bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors items-center gap-2"
          >
            <span aria-hidden="true">💬</span>
            WhatsApp Us
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-slate-200 hover:bg-white/10 transition-colors"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="text-xl" aria-hidden="true">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-slate-950 border-t border-emerald-900/30 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="text-left py-3 text-slate-200 hover:text-emerald-400 border-b border-slate-900 last:border-0 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a
                href="https://wa.me/919505903371"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("whatsapp_click", { source: "mobile_menu" });
                  setOpen(false);
                }}
                className="mt-4 mb-2 inline-flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-xl"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}