import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { business, contacts } from "../config/site";
import { trackEvent } from "../lib/analytics";
import { enquiryMessage } from "../lib/cta";
import { whatsappLink } from "../config/site";
import { navItems } from "../data";
import { ADMIN_HASH } from "../lib/routing";

export function Footer({ onNavigate }: { onNavigate: (id: string) => void }) {
  // Derived at render time so the copyright never goes stale again.
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-emerald-900/30 py-10 px-4">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-8 text-center sm:text-left">
        <div>
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
            <span className="text-2xl" aria-hidden="true">
              🌿
            </span>
            <p className="text-emerald-400 font-bold uppercase">
              {business.tagline}
            </p>
          </div>
          <p className="text-slate-500 text-sm">{business.brand}</p>
          <p className="text-slate-500 text-xs mt-1">
            {business.project} — Gated Community
          </p>
        </div>

        <div className="flex sm:flex-col items-center gap-3 text-sm text-slate-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="hover:text-emerald-400 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <a
            href={whatsappLink(enquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { source: "footer" })}
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            {contacts.whatsappDisplay}
          </a>
          <a
            href={`tel:+${contacts.inquiry}`}
            onClick={() => trackEvent("call_click", { source: "footer_secondary" })}
            className="text-slate-400 hover:text-emerald-400 text-sm"
          >
            {contacts.inquiryDisplay}
          </a>
        </div>
      </div>

      <p className="text-slate-600 text-xs text-center mt-8 pt-6 border-t border-slate-800">
        © {year} {business.brand}. All rights reserved. · Prices indicative,
        confirm on site visit. ·{" "}
        <a
          href={ADMIN_HASH}
          className="hover:text-emerald-400 transition-colors"
        >
          Admin
        </a>
      </p>
    </footer>
  );
}

/**
 * Sticky mobile CTA bar.
 *
 * On a phone the floating buttons sit over page content and are easy to miss.
 * A fixed bottom bar keeps Call and WhatsApp one thumb-tap away at all times,
 * which is the single biggest conversion lever on a lead-gen site.
 */
export function StickyMobileBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className="sm:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 gap-2 p-3 bg-slate-950/95 backdrop-blur-md border-t border-emerald-900/40"
        >
          <a
            href={`tel:+${contacts.whatsapp}`}
            onClick={() => trackEvent("call_click", { source: "sticky_bar" })}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm"
          >
            📞 Call Now
          </a>
          <a
            href={whatsappLink(enquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { source: "sticky_bar" })}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm"
          >
            💬 WhatsApp
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FloatingActions() {
  return (
    <>
      {/* Desktop-only floating buttons - the mobile equivalent is the sticky bar */}
      <div className="hidden sm:flex fixed bottom-6 right-6 z-40 flex-col gap-3">
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={whatsappLink(enquiryMessage())}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { source: "floating_button" })}
          className="bg-emerald-500 hover:bg-emerald-400 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-emerald-900/50"
          title="WhatsApp Us"
          aria-label="WhatsApp us"
        >
          💬
        </motion.a>

        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href={`tel:+${contacts.whatsapp}`}
          onClick={() => trackEvent("call_click", { source: "floating_button" })}
          className="bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-blue-900/50"
          title="Call Us"
          aria-label="Call us"
        >
          📞
        </motion.a>
      </div>
    </>
  );
}