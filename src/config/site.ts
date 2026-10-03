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

/**
 * Price.
 *
 * Held as separate fields because the price appears in several different
 * notations, and they used to be retyped by hand in ~12 places. The first real
 * price change (21 -> 24 lakhs) is what proved that a single `price` string was
 * not enough: the numeric form is needed for schema.org, and the abbreviated
 * form for meta descriptions and share text.
 *
 * Change `display`, `numeric`, `headline`, `short` and `onwards` together -
 * they describe one number in five notations and none of them can be derived
 * from another reliably. `numeric` is asserted against `display` by the test
 * suite so the two cannot drift.
 *
 * Then run `npm run assets` to regenerate the images. The price is rendered
 * into poster pixels, so source edits alone do not update them.
 */
export const price = {
  /** Full display form, e.g. "₹24,00,000". Shown on cards, posters, JSON-LD. */
  display: "₹24,00,000",
  /** Integer rupees for schema.org offers and any numeric comparison. */
  numeric: 2400000,
  /** "Starting ₹24 Lakhs" - headline form for hero and social copy. */
  headline: "Starting ₹24 Lakhs",
  /** "₹24L" - compact form for meta descriptions, badges, share text. */
  short: "₹24L",
  /** "₹24 Lakhs onwards" - range form used in enquiry messages. */
  onwards: "₹24 Lakhs onwards",
} as const;

export const business = {
  brand: "Bright Properties",
  /** Short marketing name shown in the navbar / footer / posters. */
  tagline: "Own Your Farmhouse",
  project: "Green Orchid Farm Land",
  type: "1BHK Farmhouse",
  area: "Kothur, Hyderabad",
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

/**
 * Search snippet copy.
 *
 * Lengths are deliberate and tested. Google truncates titles around 580px
 * (roughly 60-65 characters) and descriptions around 155-160. The previous
 * title was 87 characters and the description 203, so both were being cut off
 * mid-word on every search result.
 */
export const seo = {
  title: "1BHK Farmhouse for Sale near Kothur, Hyderabad | Gated Community",
  // Interpolated from `price` so a price change cannot miss this string, which
  // is the single most-read text on the whole site.
  description: `1BHK farmhouse near Kothur on NH-44, Hyderabad. 121 sq.yards plot, pool, club house, gated. From ${price.short}. Call 95059 03371.`,
  ogImage: "/og/og-image.jpg",
  ogImageAlt: `${business.project} - ${business.type} near JP Dargah, Kothur, Hyderabad. Starting ${price.display}.`,
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