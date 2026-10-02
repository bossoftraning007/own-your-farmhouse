import { useState } from "react";
import { motion } from "framer-motion";
import { business, contacts } from "../config/site";
import { trackEvent } from "../lib/analytics";
import {
  copyToClipboard,
  posterShareMessage,
  SHARE_URL,
  shareOrCopy,
  whatsappShare,
} from "../lib/share";

export function SharePoster() {
  const [toast, setToast] = useState<string | null>(null);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(SHARE_URL);
    trackEvent("poster_download", { poster: "share_poster_copy" });
    flash(ok ? "Link copied — share it anywhere! 🎉" : "Copy failed, please copy the address bar instead.");
  };

  const handleNativeShare = async () => {
    const result = await shareOrCopy(
      SHARE_URL,
      `${business.project} - ${business.tagline}`,
      posterShareMessage,
    );
    if (result === "copied") flash("Link copied! 🎉");
    if (result === "failed") flash("Sharing unavailable — use WhatsApp instead.");
  };

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-3">
            📱 Share With Anyone
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Share This Poster
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Screenshot this and send it on WhatsApp, Instagram or Facebook
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-md bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/30 border-2 border-emerald-500/30"
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-400" />

          <div className="pt-8 pb-4 px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-4xl" aria-hidden="true">
                🌿
              </span>
              <span className="text-left">
                <span className="block text-emerald-400 text-xs tracking-widest font-bold">
                  {business.brand.toUpperCase()}
                </span>
                <span className="block text-white text-xl font-black tracking-tight">
                  GREEN ORCHID
                </span>
              </span>
            </div>
            <div className="inline-block px-4 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
              🎪 HMDA Approved
            </div>
          </div>

          <div className="relative mx-4 rounded-2xl overflow-hidden border-2 border-emerald-500/30">
            <img
              src="/posters/clubhouse-sm.webp"
              alt={`${business.project} club house`}
              loading="lazy"
              decoding="async"
              className="w-full h-56 object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-white text-2xl font-black leading-tight drop-shadow-lg">
                YOUR DREAM
              </p>
              <p className="text-emerald-400 text-3xl font-black leading-tight drop-shadow-lg">
                FARMHOUSE
              </p>
            </div>
          </div>

          <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-center">
            <p className="text-yellow-300 text-xs font-bold tracking-wider uppercase mb-1">
              💫 Special Price
            </p>
            <p className="text-white text-3xl font-black">{business.price}</p>
            <p className="text-white/80 text-xs">1BHK Farmhouse • 121 sq.yards</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mx-4 mt-4">
            {[
              { emoji: "🏊", label: "Swimming Pool" },
              { emoji: "🏛️", label: "Club House" },
              { emoji: "🔒", label: "24/7 Security" },
              { emoji: "🌳", label: "Fruit Plants" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="bg-white/5 border border-emerald-500/20 rounded-lg p-2.5 text-center"
              >
                <div className="text-2xl mb-1" aria-hidden="true">
                  {feature.emoji}
                </div>
                <p className="text-white text-xs font-semibold">
                  {feature.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-4 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 text-center">
              📍 Prime Location
            </p>
            <div className="space-y-1 text-white text-xs">
              <p>
                ✈️ 15 mins from{" "}
                <span className="text-emerald-400 font-bold">
                  Shamshabad Airport
                </span>
              </p>
              <p>
                💻 2 km from{" "}
                <span className="text-emerald-400 font-bold">
                  Microsoft Data Center
                </span>
              </p>
              <p>
                🏢 30 mins from{" "}
                <span className="text-emerald-400 font-bold">Gachibowli IT</span>
              </p>
            </div>
          </div>

          {/* Locally generated QR - points at the canonical domain */}
          <div className="mx-4 mt-4 p-4 bg-white rounded-xl">
            <div className="flex items-center gap-3">
              <img
                src="/qr/site.png"
                alt="QR code linking to the Green Orchid Farm Land website"
                width={100}
                height={100}
                loading="lazy"
                decoding="async"
                className="rounded-lg border-2 border-emerald-500 shrink-0"
              />
              <div>
                <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1">
                  📱 Scan to Visit
                </p>
                <p className="text-slate-800 text-xs font-black leading-tight break-all">
                  myfarmhouse.vercel.app
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  See details, photos &amp; book a visit
                </p>
              </div>
            </div>
          </div>

          <div className="mx-4 mt-4 mb-4 p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl">
            <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider text-center mb-2">
              📞 Contact Now
            </p>
            <p className="text-white text-center text-lg font-black mb-2">
              {contacts.contactPerson.toUpperCase()}
            </p>
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-2xl" aria-hidden="true">
                📱
              </span>
              <span className="text-xl font-bold">
                {contacts.whatsappDisplay}
              </span>
            </div>
          </div>

          <div className="bg-yellow-500 py-2.5 text-center">
            <p className="text-black font-black text-sm tracking-wide">
              🌟 INVEST • RELAX • ENJOY • GROW 🌟
            </p>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <a
            href={whatsappShare(posterShareMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { source: "share_poster" })}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold transition-colors shadow-lg shadow-emerald-500/30"
          >
            💬 Share on WhatsApp
          </a>
          <button
            onClick={handleNativeShare}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold transition-colors"
          >
            🔗 Share Link
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold transition-colors"
          >
            📋 Copy Link
          </button>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-800 border border-emerald-500/40 text-white text-sm px-5 py-3 rounded-full shadow-xl"
        >
          {toast}
        </div>
      )}
    </section>
  );
}