import { motion } from "framer-motion";
import { business, contacts, price } from "../config/site";
import { trackEvent } from "../lib/analytics";
import { enquiryMessage } from "../lib/cta";
import { whatsappLink } from "../config/site";

interface Props {
  onViewProperties: () => void;
}

const stats = [
  { label: "Total Units", value: "72" },
  { label: "Total Acres", value: "5.5" },
  { label: "Free Maintenance", value: "2 Yrs" },
];

export function Hero({ onViewProperties }: Props) {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{
          backgroundImage: "url('/posters/clubhouse-sm.webp')",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/70 to-slate-950"
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-1 rounded-full mb-6">
            🌿 HMDA Approved — Near Kothur, Hyderabad
          </span>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            {business.project.split(" ").slice(0, 2).join(" ")}{" "}
            <span className="text-emerald-400">
              {business.project.split(" ").slice(2).join(" ")}
            </span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Your dream farmhouse awaits 🏡 — gated community with swimming pool
            &amp; club house on Bangalore Highway NH-44, starting{" "}
            <strong className="text-emerald-400">{price.display}</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewProperties}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-3 rounded-full transition-colors"
            >
              🏠 View Properties
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={whatsappLink(enquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { source: "hero" })}
              className="border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 font-bold px-8 py-3 rounded-full transition-colors"
            >
              💬 Chat on WhatsApp
            </motion.a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3"
              >
                <p className="text-emerald-400 font-bold text-xl">
                  {stat.value}
                </p>
                <p className="text-slate-300 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-slate-400 text-sm">
            Site visits daily · Call{" "}
            <a
              href={`tel:+${contacts.whatsapp}`}
              onClick={() => trackEvent("call_click", { source: "hero" })}
              className="text-emerald-400 hover:text-emerald-300"
            >
              {contacts.whatsappDisplay}
            </a>
          </p>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 text-2xl"
        aria-hidden="true"
      >
        ↓
      </motion.div>
    </section>
  );
}