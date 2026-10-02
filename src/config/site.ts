/**
 * Single source of truth for every hardcoded business fact.
 *
 * Previously these values were copy-pasted across ~15 places in App.tsx and
 * index.html, which is how the site ended up shipping two different domains.
 * Change it here and everything follows.
 *
 * NOTE: index.html cannot import this module (it is parsed by Vite before the
 * bundle runs), so the handful of values that also live in index.html must be
 * kept in sync by hand. `npm test` guards against the drift that already bit
 * this project once.
 */

/** Canonical production URL. Used for sitemap, robots, OG tags, QR codes. */
export const SITE_URL = "https://myfarmhouse.vercel.app";

export const business = {
  brand: "Bright Properties",
  /** Short marketing name shown in the navbar / footer / posters. */
  tagline: "Own Your Farmhouse",
  project: "Green Orchid Farm Land",
  type: "HMDA Approved 1BHK Farmhouse",
  area: "Kothur, Hyderabad",
  price: "₹21,00,000",
  priceLabel: "Starting ₹21 Lakhs",
  currency: "₹",
} as const;

export const contacts = {
  /** Primary marketing number. Used in QR code, WhatsApp links, tel: links. */
  whatsapp: "919505903371",
  whatsappDisplay: "+91 95059 03371",
  /** Secondary number for property inquiries. */
  inquiry: "919849754071",
  inquiryDisplay: "+91 98497 54071",
  contactPerson: "R. Ganesh",
  contactRole: "Marketing Director",
} as const;

/**
 * Google Maps embed.
 *
 * The previous value was a hand-forged `pb=` parameter with fabricated
 * coordinates and a placeholder version suffix - it rendered a blank grey box
 * for every visitor. The plain `q=` form is far more robust: it needs no API
 * key, cannot rot when Google changes its internals, and Google geocodes the
 * query itself.
 */
export const location = {
  /** Human readable address, shown in the UI and sent to Google Maps. */
  address: "Near JP Dargah, Bangalore Highway NH-44, Kothur, Hyderabad, Telangana",
  /** Short form for maps search / directions links. */
  searchQuery: "JP Dargah, Kothur, Hyderabad, Telangana",
  latitude: 17.144727,
  longitude: 78.288574,
  postalCode: "509228",
  region: "Telangana",
  country: "IN",
} as const;

/** Build a wa.me deep link, optionally with a prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${contacts.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Build a Google Maps directions URL that opens in any map app. */
export function directionsLink(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    location.searchQuery,
  )}`;
}

/** Absolute URL for an asset in /public. Needed for OG tags and QR codes. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}