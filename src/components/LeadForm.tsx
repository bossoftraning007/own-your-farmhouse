import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { contacts, whatsappLink } from "../config/site";
import { trackEvent } from "../lib/analytics";
import { isValidEmail, isValidIndianPhone } from "../lib/validate";
import { buildLeadMessage, emptyLeadFields, type LeadFields } from "../lib/lead";

/**
 * Optional Formspree endpoint. Set in `.env`:
 *   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
 *
 * Left unset, the form still works: submitting opens WhatsApp with the
 * visitor's details already typed in. That way we never lose a lead just
 * because a third-party form service is down or unset.
 */

const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;

type Status = "idle" | "submitting" | "sent";

export function LeadForm() {
  const [fields, setFields] = useState<LeadFields>(emptyLeadFields);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFields, string>>>(
    {},
  );

  /**
   * The deep link the visitor needs in the success state.
   *
   * `window.open` cannot be trusted to report success: with `noopener` the
   * spec requires it to return null whether or not the popup opened, and iOS
   * Safari blocks it outright in plenty of contexts. So the popup is treated as
   * a convenience and this link is treated as the actual delivery mechanism -
   * it is always rendered, and it is a real anchor, so it cannot be suppressed.
   */
  const [handoff, setHandoff] = useState<{ url: string; label: string } | null>(
    null,
  );

  const update = (key: keyof LeadFields) => (value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof LeadFields, string>> = {};
    if (fields.name.trim().length < 2) next.name = "Please enter your name";
    if (!isValidIndianPhone(fields.phone)) {
      next.phone = "Enter a valid 10-digit mobile number";
    }
    if (fields.email && !isValidEmail(fields.email)) {
      next.email = "Enter a valid email or leave it blank";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  /**
   * Hand the enquiry to WhatsApp.
   *
   * Attempts the popup inside the submit gesture, then always records the link
   * so the success state can offer a tap-through if the popup did not appear.
   */
  const handOffToWhatsApp = (next: LeadFields, via: string) => {
    const url = whatsappLink(buildLeadMessage(next));

    window.open(url, "_blank", "noopener,noreferrer");
    setHandoff({ url, label: next.purpose });
    setStatus("sent");
    setFields(emptyLeadFields);

    trackEvent("lead_submit", {
      purpose: next.purpose,
      has_email: Boolean(next.email),
      via,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const submitted = fields;

    if (!ENDPOINT) {
      handOffToWhatsApp(submitted, "whatsapp_only");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitted),
      });
      if (!response.ok) throw new Error(`Formspree returned ${response.status}`);

      // Stored by email, so WhatsApp is still offered as a fast confirmation.
      setHandoff({
        url: whatsappLink(buildLeadMessage(submitted)),
        label: submitted.purpose,
      });
      setStatus("sent");
      setFields(emptyLeadFields);
    } catch {
      // Never strand a lead on a network failure: fall back to WhatsApp.
      handOffToWhatsApp(submitted, "formspree_failed");
    }
  };

  const reset = () => {
    setStatus("idle");
    setHandoff(null);
  };

  const inputClass = (hasError?: string) =>
    `w-full bg-slate-800 border rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-emerald-500 ${
      hasError ? "border-red-500" : "border-slate-700"
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-slate-900 border border-emerald-900/40 rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-xl font-bold text-white mb-1">
        📋 Request a Callback
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        Fill this in and we will call you back, usually within the hour during
        business times.
      </p>

      {status === "sent" ? (
        <div
          className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-6 text-center"
          role="status"
        >
          <p className="text-3xl mb-2">✅</p>
          <p className="text-white font-semibold mb-1">
            Details captured
          </p>

          {handoff ? (
            <>
              {/*
                The enquiry is only truly delivered once the message reaches
                WhatsApp. The popup above is a convenience that iOS Safari and
                some popup blockers suppress, so this block is the guarantee -
                a real anchor that can never be blocked.
              */}
              <p className="text-slate-300 text-sm mb-4">
                One last tap to send it to us on WhatsApp — if a WhatsApp tab
                already opened, you can close it and use this button instead.
              </p>

              <a
                href={handoff.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("whatsapp_click", {
                    source: "lead_form_success_fallback",
                  })
                }
                className="flex w-full items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-colors"
              >
                💬 Send my details on WhatsApp
              </a>

              <p className="text-slate-500 text-xs mt-3 mb-1">
                About {handoff.label} · your details are already filled in
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <a
                  href={`tel:+${contacts.whatsapp}`}
                  onClick={() =>
                    trackEvent("call_click", { source: "lead_form_success" })
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  📞 Call {contacts.whatsappDisplay}
                </a>
                <a
                  href={`tel:+${contacts.inquiry}`}
                  onClick={() =>
                    trackEvent("call_click", {
                      source: "lead_form_success_secondary",
                    })
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-600 hover:bg-slate-800 text-slate-200 font-semibold py-3 rounded-xl transition-colors"
                >
                  📞 {contacts.inquiryDisplay}
                </a>
              </div>
              <p className="text-slate-500 text-xs mt-3">
                Prefer to talk? We answer 9am–7pm, every day.
              </p>
            </>
          ) : (
            <p className="text-slate-400 text-sm">
              We have your details and will call you back. If it is urgent, call{" "}
              <a
                href={`tel:+${contacts.whatsapp}`}
                className="text-emerald-400 font-semibold"
              >
                {contacts.whatsappDisplay}
              </a>
              .
            </p>
          )}

          <button
            onClick={reset}
            className="mt-5 text-slate-400 hover:text-emerald-400 text-sm underline underline-offset-4"
          >
            Send another enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="grid gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="lead-name"
                className="block text-slate-300 text-sm mb-1.5"
              >
                Your name <span className="text-red-400">*</span>
              </label>
              <input
                id="lead-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Ramesh Kumar"
                value={fields.name}
                onChange={(e) => update("name")(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "lead-name-error" : undefined}
                className={inputClass(errors.name)}
              />
              {errors.name && (
                <p id="lead-name-error" className="text-red-400 text-xs mt-1.5">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lead-phone"
                className="block text-slate-300 text-sm mb-1.5"
              >
                Mobile number <span className="text-red-400">*</span>
              </label>
              <input
                id="lead-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="95059 03371"
                value={fields.phone}
                onChange={(e) => update("phone")(e.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "lead-phone-error" : undefined}
                className={inputClass(errors.phone)}
              />
              {errors.phone && (
                <p id="lead-phone-error" className="text-red-400 text-xs mt-1.5">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="lead-email"
                className="block text-slate-300 text-sm mb-1.5"
              >
                Email <span className="text-slate-500">(optional)</span>
              </label>
              <input
                id="lead-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={fields.email}
                onChange={(e) => update("email")(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "lead-email-error" : undefined}
                className={inputClass(errors.email)}
              />
              {errors.email && (
                <p id="lead-email-error" className="text-red-400 text-xs mt-1.5">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lead-purpose"
                className="block text-slate-300 text-sm mb-1.5"
              >
                Interested in
              </label>
              <select
                id="lead-purpose"
                value={fields.purpose}
                onChange={(e) => update("purpose")(e.target.value)}
                className={`${inputClass()} appearance-none`}
              >
                <option>1BHK Farmhouse</option>
                <option>Weekend House</option>
                <option>Plot only</option>
                <option>Site visit</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="lead-message"
              className="block text-slate-300 text-sm mb-1.5"
            >
              Anything else? <span className="text-slate-500">(optional)</span>
            </label>
            <textarea
              id="lead-message"
              rows={3}
              placeholder="Budget, preferred plot size, timeline..."
              value={fields.message}
              onChange={(e) => update("message")(e.target.value)}
              className={`${inputClass()} resize-y`}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            {status === "submitting" ? "Sending…" : "📲 Send Enquiry on WhatsApp"}
          </button>

          <p className="text-slate-500 text-xs text-center">
            We never share your number. Or call directly on{" "}
            <a
              href={`tel:+${contacts.whatsapp}`}
              onClick={() => trackEvent("call_click", { source: "lead_form" })}
              className="text-emerald-400"
            >
              {contacts.whatsappDisplay}
            </a>
          </p>
        </form>
      )}
    </motion.div>
  );
}