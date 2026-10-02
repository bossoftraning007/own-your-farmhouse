import { motion } from "framer-motion";
import { properties } from "../data";
import { business } from "../config/site";
import { trackEvent } from "../lib/analytics";
import { enquiryMessage } from "../lib/cta";
import { whatsappLink } from "../config/site";

export function Properties() {
  return (
    <section
      id="properties"
      className="py-20 px-4 max-w-7xl mx-auto scroll-mt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          🏠 Our <span className="text-emerald-400">Properties</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          HMDA approved layouts in Kothur — book your weekend house before the
          good plots go. 🌿
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {properties.map((property, index) => (
          <motion.article
            key={property.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -6 }}
            className="bg-slate-900 border border-emerald-900/40 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors flex flex-col"
          >
            <div className="relative">
              <img
                src={property.image.small}
                alt={property.image.alt}
                loading="lazy"
                decoding="async"
                width={640}
                height={426}
                className="w-full h-52 object-cover"
              />
              {property.badge && (
                <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {property.badge}
                </span>
              )}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-white">{property.name}</h3>
              <p className="text-3xl font-bold text-emerald-400 mt-1">
                {property.priceLabel}
              </p>

              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="bg-slate-800 rounded-xl p-3 text-center">
                  <p className="text-slate-400 text-xs">Plot Size</p>
                  <p className="text-white font-semibold text-sm">
                    {property.plot}
                  </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-3 text-center">
                  <p className="text-slate-400 text-xs">House Size</p>
                  <p className="text-white font-semibold text-sm">
                    {property.house}
                  </p>
                </div>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {property.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-slate-300 text-sm"
                  >
                    <span className="text-emerald-400" aria-hidden="true">
                      ✓
                    </span>
                    {highlight}
                  </li>
                ))}
              </ul>

              <a
                href={whatsappLink(enquiryMessage(property.name))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("whatsapp_click", {
                    source: `property_card_${property.id}`,
                  })
                }
                className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-colors"
              >
                💬 Enquire About {property.bhk}
              </a>
              <p className="text-center text-slate-500 text-xs mt-2">
                {business.brand} · Kothur, Hyderabad
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}