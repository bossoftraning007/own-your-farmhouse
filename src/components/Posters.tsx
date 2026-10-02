import { useState } from "react";
import { motion } from "framer-motion";
import { trackEvent } from "../lib/analytics";
import {
  copyToClipboard,
  posterShareMessage,
  SHARE_URL,
  shareOrCopy,
  whatsappShare,
} from "../lib/share";

const posters = [
  {
    full: "/posters/farmhouse.webp",
    posterJpeg: "/posters/farmhouse.jpeg",
    alt: "Green Orchid Farm Land farmhouse marketing poster",
    downloadName: "green-orchid-farmhouse.jpg",
    title: "Farmhouse",
  },
  {
    full: "/posters/weekend-houses.webp",
    posterJpeg: "/posters/weekend-houses.jpg",
    alt: "Green Orchid Farm Land weekend houses marketing poster",
    downloadName: "green-orchid-weekend-houses.jpg",
    title: "Weekend Houses",
  },
];

export function Posters() {
  const [toast, setToast] = useState<string | null>(null);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2400);
  };

  const handleDownload = (title: string) => {
    trackEvent("poster_download", { poster: title });
    flash("Poster downloading — share it anywhere! 📥");
  };

  const handleShare = async () => {
    trackEvent("whatsapp_click", { source: "posters_section" });
    window.open(whatsappShare(posterShareMessage), "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(SHARE_URL);
    trackEvent("poster_download", { poster: "copy_link" });
    flash(ok ? "Link copied! 🎉" : "Could not copy — long-press the address bar instead.");
  };

  const handleNativeShare = async () => {
    const result = await shareOrCopy(
      SHARE_URL,
      "Green Orchid Farm Land",
      posterShareMessage,
    );
    if (result === "copied") flash("Link copied! 🎉");
    if (result === "failed") flash("Sharing unavailable — use WhatsApp instead.");
  };

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-3">
            📸 Our Campaigns
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Download &amp; Share These Posters
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            High resolution posters ready for WhatsApp, Instagram and print.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {posters.map((poster, index) => (
            <motion.div
              key={poster.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl overflow-hidden border-2 border-white/10 hover:border-emerald-500/50 transition-colors shadow-2xl"
            >
              <img
                src={poster.full}
                alt={poster.alt}
                loading="lazy"
                decoding="async"
                width={640}
                height={800}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <a
                  href={poster.posterJpeg}
                  download={poster.downloadName}
                  onClick={() => handleDownload(poster.title)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-full font-bold text-sm shadow-2xl"
                >
                  📥 Download Poster
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold transition-colors"
          >
            💬 Share on WhatsApp
          </button>
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

        <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl max-w-2xl mx-auto">
          <h3 className="text-emerald-400 font-bold text-lg mb-3">
            💡 How to use these posters
          </h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li>📸 Share directly on WhatsApp status and groups</li>
            <li>📱 Post as a story on Instagram and Facebook</li>
            <li>
              🖨️ Print at a local Xerox shop and stick at tea stalls, shops and
              notice boards
            </li>
            <li>
              📱 The QR code sends people straight to this site, where they can
              call or WhatsApp you
            </li>
            <li>
              🎯 Post in 5 WhatsApp groups daily for free reach — that is most of
              what a small ad budget would buy
            </li>
          </ul>
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