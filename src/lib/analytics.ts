/**
 * Analytics.
 *
 * GA4 loads only when a measurement ID is present. Without one, every function
 * here is a no-op, so the site behaves identically on a fork or a local run and
 * never fires requests to Google that go nowhere.
 *
 * Set the ID in `.env`:
 *   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *
 * To create one for free: analytics.google.com -> Admin -> Data streams ->
 * Web. It takes about two minutes and gives you Search Console + GA4 together.
 *
 * Until that ID is set the site still tracks into `dataLayer` only, which is
 * enough to verify wiring in devtools without shipping analytics to nobody.
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as
  | string
  | undefined;

let loaded = false;

type GtagArgs = [command: string, ...rest: unknown[]];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/** Inject the GA4 loader. Safe to call repeatedly. */
export function initAnalytics(): void {
  if (loaded || !MEASUREMENT_ID || typeof window === "undefined") return;
  loaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: GtagArgs) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    send_page_view: true,
  });
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(MEASUREMENT_ID);
}

/**
 * Named events, kept in one place so GA4 reporting does not silently fragment
 * across "whatsapp_click", "WhatsApp_Click" and "wa_click".
 */
export type AnalyticsEvent =
  | "whatsapp_click"
  | "call_click"
  | "email_click"
  | "directions_click"
  | "poster_download"
  | "gallery_open"
  | "lead_submit"
  | "nav_click";

export function trackEvent(
  event: AnalyticsEvent,
  params: Record<string, unknown> = {},
): void {
  if (!MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", event, params);
}

/**
 * Plain first-party fallback: also push to dataLayer so anything listening in
 * devtools or GTM sees it even if the tag never loads.
 */
export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  trackEvent(event, params);
}