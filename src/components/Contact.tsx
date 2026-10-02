import { motion } from "framer-motion";
import { contacts, location, business } from "../config/site";
import { trackEvent } from "../lib/analytics";
import { enquiryMessage } from "../lib/cta";
import { whatsappLink } from "../config/site";
import { LeadForm } from "./LeadForm";

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🤝 Ready to Own Your{" "}
            <span className="text-emerald-400">Farmhouse?</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Site visits available every day, weekends included 🗓️
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-slate-900 border border-emerald-900/40 rounded-2xl p-6 sm:p-8">
            <div className="space-y-5">
              <div>
                <p className="text-slate-400 text-sm">Contact Person</p>
                <p className="text-white font-bold text-lg">
                  {contacts.contactPerson}{" "}
                  <span className="text-slate-400 text-sm font-normal">
                    · {contacts.contactRole}
                  </span>
                </p>
              </div>

              <div>
                <p className="text-slate-400 text-sm">WhatsApp / Call</p>
                <a
                  href={`tel:+${contacts.whatsapp}`}
                  onClick={() => trackEvent("call_click", { source: "contact_card" })}
                  className="text-emerald-400 font-bold text-xl hover:text-emerald-300 transition-colors"
                >
                  {contacts.whatsappDisplay}
                </a>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Property Inquiries</p>
                <a
                  href={`tel:+${contacts.inquiry}`}
                  onClick={() => trackEvent("call_click", { source: "contact_card_secondary" })}
                  className="text-emerald-400 font-bold text-lg hover:text-emerald-300 transition-colors"
                >
                  {contacts.inquiryDisplay}
                </a>
              </div>

              <div>
                <p className="text-slate-400 text-sm">Location</p>
                <p className="text-white text-sm">
                  Near JP Dargah, Bangalore Highway NH-44
                  <br />
                  Kothur, Hyderabad, Telangana
                  <br />
                  <span className="text-slate-500">
                    PIN {location.postalCode}
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href={whatsappLink(enquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click", { source: "contact_card" })}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 rounded-full transition-colors"
                >
                  💬 WhatsApp Now
                </a>
                <a
                  href={`tel:+${contacts.whatsapp}`}
                  onClick={() => trackEvent("call_click", { source: "contact_cta" })}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 font-bold py-3.5 rounded-full transition-colors"
                >
                  📞 Call Now
                </a>
              </div>
            </div>

            {/* Locally generated QR codes - no third-party API at runtime. */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <p className="text-slate-400 text-sm mb-4 text-center">
                Scan to reach us instantly
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                <div className="text-center">
                  <div className="bg-white rounded-xl p-2 aspect-square">
                    <img
                      src="/qr/whatsapp.png"
                      alt={`QR code to WhatsApp ${contacts.whatsappDisplay}`}
                      width={300}
                      height={300}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-2">
                    💬 WhatsApp us
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-xl p-2 aspect-square">
                    <img
                      src="/qr/site.png"
                      alt="QR code to the Green Orchid Farm Land website"
                      width={300}
                      height={300}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-2">
                    🌐 View the site
                  </p>
                </div>
              </div>
            </div>
          </div>

          <LeadForm />
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          {business.brand} · {business.project} · HMDA Approved · Site visits
          daily 9am&ndash;7pm
        </p>
      </div>
    </section>
  );
}