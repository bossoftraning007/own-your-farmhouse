import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { galleryImages } from "../data";
import { trackEvent } from "../lib/analytics";

export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((current) =>
      current === null
        ? null
        : current === 0
          ? galleryImages.length - 1
          : current - 1,
    );
  }, []);

  const next = useCallback(() => {
    setLightboxIndex((current) =>
      current === null
        ? null
        : current === galleryImages.length - 1
          ? 0
          : current + 1,
    );
  }, []);

  // Escape closes, arrows navigate. Without this the lightbox is unusable for
  // anyone on a keyboard.
  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          close();
          break;
        case "ArrowLeft":
          event.preventDefault();
          prev();
          break;
        case "ArrowRight":
          event.preventDefault();
          next();
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, close, prev, next]);

  // Return focus to the thumbnail that opened the lightbox on close.
  useEffect(() => {
    if (lightboxIndex === null) {
      lastFocused.current?.focus();
      lastFocused.current = null;
    }
  }, [lightboxIndex]);

  const openAt = (index: number) => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setLightboxIndex(index);
    trackEvent("gallery_open", { image: galleryImages[index].label });
  };

  const activeImage =
    lightboxIndex === null ? null : galleryImages[lightboxIndex];

  return (
    <>
      <section
        id="gallery"
        className="py-20 px-4 max-w-7xl mx-auto scroll-mt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            📸 <span className="text-emerald-400">Gallery</span>
          </h2>
          <p className="text-slate-400">Tap any photo to view it larger 🔍</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.button
              key={image.label}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => openAt(index)}
              className="relative cursor-pointer rounded-2xl overflow-hidden border border-emerald-900/40 hover:border-emerald-500/50 transition-colors text-left"
              aria-label={`Open larger view: ${image.alt}`}
            >
              <img
                src={image.small}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                width={640}
                height={426}
                className="w-full h-48 md:h-56 object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent"
                aria-hidden="true"
              />
              <span className="absolute bottom-3 left-3 text-white font-medium text-sm">
                {image.label}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {activeImage && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.alt}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage.full}
                alt={activeImage.alt}
                className="w-full max-h-[75vh] object-contain rounded-2xl mx-auto"
              />

              <button
                ref={closeButtonRef}
                onClick={close}
                className="absolute -top-2 right-0 sm:top-4 sm:right-4 bg-slate-800 hover:bg-slate-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl"
                aria-label="Close image viewer"
              >
                ✕
              </button>

              <button
                onClick={prev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-emerald-700 text-white w-11 h-11 rounded-full flex items-center justify-center text-xl"
                aria-label="Previous image"
              >
                ←
              </button>

              <button
                onClick={next}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-emerald-700 text-white w-11 h-11 rounded-full flex items-center justify-center text-xl"
                aria-label="Next image"
              >
                →
              </button>

              <p className="text-center text-slate-300 mt-4 text-sm">
                {activeImage.label} — {lightboxIndex + 1} /{" "}
                {galleryImages.length}
              </p>
              <p className="text-center text-slate-500 text-xs mt-1 hidden sm:block">
                Use ← → arrow keys to browse, Esc to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}