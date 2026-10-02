import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Regression tests for the GA4 bootstrap.
 *
 * GA4 reported zero users while the measurement ID was demonstrably present in
 * the production bundle, so the wiring needs an actual test rather than an
 * assumption. These assert the observable contract: a gtag.js script tag lands
 * in the head, and `js` + `config` land in dataLayer.
 */

const GA_ID = "G-TEST12345";
const GTAG_SRC = "https://www.googletagmanager.com/gtag/js";

/** Re-import the module with a specific measurement ID in place. */
async function loadAnalytics(measurementId?: string) {
  vi.resetModules();
  if (measurementId === undefined) {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
  } else {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", measurementId);
  }
  return import("../lib/analytics");
}

const gtagScripts = () =>
  Array.from(
    document.head.querySelectorAll<HTMLScriptElement>(
      'script[src^="https://www.googletagmanager.com/gtag/js"]',
    ),
  );

beforeEach(() => {
  gtagScripts().forEach((s) => s.remove());
  delete window.dataLayer;
  delete window.gtag;
});

afterEach(() => {
  gtagScripts().forEach((s) => s.remove());
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("initAnalytics with a measurement ID", () => {
  it("injects the gtag.js script into the head", async () => {
    const { initAnalytics, isAnalyticsEnabled } = await loadAnalytics(GA_ID);
    expect(isAnalyticsEnabled()).toBe(true);

    initAnalytics();

    const scripts = gtagScripts();
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe(`${GTAG_SRC}?id=${GA_ID}`);
    expect(scripts[0].async).toBe(true);
  });

  it("queues the js and config commands in dataLayer", async () => {
    const { initAnalytics } = await loadAnalytics(GA_ID);
    initAnalytics();

    expect(Array.isArray(window.dataLayer)).toBe(true);
    expect(window.gtag).toBeTypeOf("function");

    const commands = (window.dataLayer as unknown[][]).map((entry) => entry[0]);
    expect(commands).toContain("js");
    expect(commands).toContain("config");

    const config = (window.dataLayer as unknown[][]).find(
      (entry) => entry[0] === "config",
    );
    expect(config?.[1]).toBe(GA_ID);
  });

  it("is idempotent, so StrictMode double-effects do not double-inject", async () => {
    const { initAnalytics } = await loadAnalytics(GA_ID);

    initAnalytics();
    initAnalytics();
    initAnalytics();

    expect(gtagScripts()).toHaveLength(1);
  });

  it("pushes custom events onto dataLayer after config", async () => {
    const { initAnalytics, trackEvent } = await loadAnalytics(GA_ID);
    initAnalytics();

    trackEvent("whatsapp_click", { source: "hero" });

    const layer = window.dataLayer as unknown[];
    const last = layer[layer.length - 1] as unknown[];
    expect(last[0]).toBe("event");
    expect(last[1]).toBe("whatsapp_click");
    expect(last[2]).toMatchObject({ source: "hero" });
  });
});

describe("initAnalytics without a measurement ID", () => {
  it("injects nothing and does not report itself as enabled", async () => {
    const { initAnalytics, isAnalyticsEnabled } = await loadAnalytics(undefined);

    expect(isAnalyticsEnabled()).toBe(false);
    initAnalytics();

    expect(gtagScripts()).toHaveLength(0);
    // No requests to Google on a fork with no env configured.
    expect(document.querySelector('script[src*="googletagmanager"]')).toBeNull();
  });

  it("still records events to dataLayer for local verification", async () => {
    const { track } = await loadAnalytics(undefined);

    track("lead_submit", { via: "test" });

    expect(window.dataLayer).toEqual([
      { event: "lead_submit", via: "test" },
    ]);
  });

  it("does not throw when gtag is absent", async () => {
    const { trackEvent } = await loadAnalytics(undefined);
    expect(() => trackEvent("call_click", { source: "test" })).not.toThrow();
  });
});
