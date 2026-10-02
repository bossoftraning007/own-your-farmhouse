import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { contacts } from "../config/site";
import { trackEvent } from "../lib/analytics";
import { whatsappLink } from "../config/site";
import { isValidEmail, isValidIndianPhone } from "../lib/validate";

/**
 * Optional Formspree endpoint. Set in `.env`:
 *   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
 *
 * Left unset, the form still works: submitting opens WhatsApp with the
 * visitor's details already typed in. That way we never lose a lead just
 * because a third-party form service is down or unset.
 */

const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;

type Status = "idle" | "submitting" | "sent" | "error";

interface FormFields {
  name: string;
  phone: string;
  email: string;
  purpose: string;
  message: string;
}

const emptyFields: FormFields = {
  name: "",
  phone: "",
  email: "",
  purpose: "1BHK Farmhouse",
  message: "",
};

/**
 * Lead capture form.
 *
 * With Formspree configured it POSTs the enquiry. Without it, submitting opens
 * WhatsApp with the details already typed in - so the site captures leads even
 * on a fresh fork with no environment set up.
 */
export function LeadForm() {
  const [fields, setFields] = useState<FormFields>(emptyFields);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>(
    {},
  );

  const update = (key: keyof FormFields) => (value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormFields, string>> = {};
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const message = [
      `New enquiry from the website`,
      "",
      `Name: ${fields.name}`,
      `Phone: ${fields.phone}`,
      fields.email ? `Email: ${fields.email}` : "",
      `Interested in: ${fields.purpose}`,
      fields.message ? `Notes: ${fields.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    trackEvent("lead_submit", {
      purpose: fields.purpose,
      has_email: Boolean(fields.email),
      via: ENDPOINT ? "formspree" : "whatsapp_fallback",
    });

    if (!ENDPOINT) {
      window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
      setStatus("sent");
      setFields(emptyFields);
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
        body: JSON.stringify(fields),
      });
      if (!response.ok) throw new Error(`Formspree returned ${response.status}`);

      setStatus("sent");
      setFields(emptyFields);
    } catch {
      // Never strand a lead on a network failure: fall back to WhatsApp.
      window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
      setStatus("sent");
    }
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
          <p className="text-white font-semibold mb-1">Request received</p>
          <p className="text-slate-400 text-sm">
            WhatsApp should have opened with your details. If it did not, call
            us on{" "}
            <a
              href={`tel:+${contacts.whatsapp}`}
              className="text-emerald-400 font-semibold"
            >
              {contacts.whatsappDisplay}
            </a>
            .
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-slate-400 hover:text-emerald-400 text-sm underline underline-offset-4"
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