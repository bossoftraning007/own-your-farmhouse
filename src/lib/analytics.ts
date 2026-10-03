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

/** Injected by Vite at build time. Console log confirms it reached the bundle. */
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

/**
 * dataLayer entries must be array-like `arguments` objects.
 *
 * Rest parameters produce a real `Array`, and gtag.js silently ignores those -
 * so the `config` command never becomes a page_view and NO collect request is
 * ever sent. The symptom is a measurement ID that is present in the bundle,
 * gtag.js loading with a 200, an apparently healthy dataLayer... and a GA4
 * property that reports zero users forever.
 *
 * Verified in headless Chrome against the same measurement ID:
 *   push(arguments) -> 2 collect requests (204)
 *   push(array)      -> 0 collect requests
 *
 * Declared with no parameters so `arguments` is the real arguments object.
 * Assigning it to `window.gtag` is fine: a function taking no arguments is
 * assignable to the wider gtag signature.
 */
function pushToDataLayer(): void {
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments as unknown as unknown[]);
}

/** Inject the GA4 loader. Safe to call repeatedly. */
export function initAnalytics(): void {
  // Diagnostic logs. `import.meta.env.VITE_GA_MEASUREMENT_ID` is substituted
  // at build time, so these prove whether the env var reached the build.
  console.info(
    "[analytics] resolved VITE_GA_MEASUREMENT_ID =",
    JSON.stringify(MEASUREMENT_ID),
  );

  if (loaded) {
    console.info("[analytics] already initialised, skipping");
    return;
  }
  if (!MEASUREMENT_ID) {
    console.warn(
      "[analytics] no VITE_GA_MEASUREMENT_ID - set it in Vercel (Settings > Environment Variables) and redeploy",
    );
    return;
  }
  if (typeof window === "undefined") {
    console.warn("[analytics] no window object, skipping");
    return;
  }

  loaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = pushToDataLayer;
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    send_page_view: true,
  });

  console.info("[analytics] gtag config called ->", MEASUREMENT_ID);
  console.info(
    "[analytics] script tag src =",
    script.src,
    "| in head:",
    document.head.contains(script),
  );
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