import { motion } from "framer-motion";
import { amenities, legalDocs, nearbyPlaces } from "../data";
import { directionsLink, location } from "../config/site";
import { trackEvent } from "../lib/analytics";

export function Amenities() {
  return (
    <section
      id="amenities"
      className="py-20 px-4 bg-slate-900/50 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            ✨ World-Class{" "}
            <span className="text-emerald-400">Amenities</span>
          </h2>
          <p className="text-slate-400">
            Everything you need for the perfect farmhouse life.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ scale: 1.05 }}
              className="bg-slate-900 border border-emerald-900/40 rounded-2xl p-5 text-center hover:border-emerald-500/50 transition-colors"
            >
              <span className="text-4xl block mb-3" aria-hidden="true">
                {amenity.icon}
              </span>
              <p className="text-white font-medium text-sm">
                {amenity.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Location() {
  // `q=` form of the embed needs no API key and cannot break when Google's
  // internal pb payload changes.
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    location.searchQuery,
  )}&output=embed`;

  return (
    <section
      id="location"
      className="py-20 px-4 max-w-7xl mx-auto scroll-mt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          📍 Prime <span className="text-emerald-400">Location</span>
        </h2>
        <p className="text-slate-400">{location.address}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="grid content-start gap-3">
          {nearbyPlaces.map((place, index) => (
            <motion.div
              key={place.place}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-slate-900 border border-emerald-900/40 rounded-xl p-4 flex items-center justify-between hover:border-emerald-500/50 transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">
                  {place.icon}
                </span>
                <span className="text-white font-medium">
                  {place.place}
                </span>
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-sm px-3 py-1 rounded-full whitespace-nowrap">
                {place.distance}
              </span>
            </motion.div>
          ))}

          <a
            href={directionsLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("directions_click", { source: "location" })}
            className="mt-2 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            🧭 Get Directions
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-emerald-900/40 min-h-[340px]"
        >
          <iframe
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ minHeight: "340px", border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Green Orchid Farm Land location map"
          />
        </motion.div>
      </div>
    </section>
  );
}

export function Legal() {
  return (
    <section className="py-16 px-4 bg-emerald-950/20 border-y border-emerald-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            📜 Legal <span className="text-emerald-400">Documentation</span>
          </h2>
          <p className="text-slate-400">
            100% legal, transparent and a safe investment 🛡️
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {legalDocs.map((doc, index) => (
            <motion.div
              key={doc.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 text-center"
            >
              <span className="text-2xl block mb-2" aria-hidden="true">
                {doc.icon}
              </span>
              <p className="text-white font-medium text-sm">{doc.title}</p>
              <p className="text-slate-500 text-xs mt-1">{doc.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}