import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs } from "../data";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-4 max-w-3xl mx-auto scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          <span className="text-emerald-400">Questions</span>{" "}
          <span className="text-white">Answered</span>
        </h2>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.q}
              className="bg-slate-900 border border-emerald-900/40 rounded-xl overflow-hidden"
            >
              <h3>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  id={`faq-button-${index}`}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-white font-medium text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={`text-emerald-400 text-xl transition-transform flex-shrink-0 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-slate-400 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}