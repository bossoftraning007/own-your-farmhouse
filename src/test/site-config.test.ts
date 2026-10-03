import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  contacts,
  directionsLink,
  location,
  price,
  SITE_URL,
  whatsappLink,
} from "../config/site";

/**
 * These tests exist because the site previously shipped two different domains:
 * the SEO tags said myfarmhouse.vercel.app while the QR code and every
 * WhatsApp share link said own-your-farmhouse.vercel.app. Visitors scanning a
 * poster landed on a different URL than the one Google had indexed.
 */
const RETIRED_DOMAINS = ["own-your-farmhouse.vercel.app"];

describe("site config", () => {
  it("exposes exactly one canonical domain", () => {
    expect(SITE_URL).toBe("https://myfarmhouse.vercel.app");
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("does not reference any retired domain anywhere", () => {
    const serialised = JSON.stringify({
      SITE_URL,
      contacts,
      location,
      whatsapp: whatsappLink("hi"),
      directions: directionsLink(),
      absolute: absoluteUrl("/og/og-image.jpg"),
    });

    for (const domain of RETIRED_DOMAINS) {
      expect(serialised).not.toContain(domain);
    }
  });

  it("builds wa.me links against the primary contact number", () => {
    expect(whatsappLink()).toBe(`https://wa.me/${contacts.whatsapp}`);
    expect(whatsappLink()).toContain("919505903371");
  });

  it("url-encodes the prefilled WhatsApp message", () => {
    const link = whatsappLink("Hello 👋 ₹21,00,000");
    expect(link).toContain("?text=");
    expect(link).not.toContain(" ");
    expect(decodeURIComponent(link.split("?text=")[1])).toContain("₹21,00,000");
  });

  it("builds a directions link for the search query", () => {
    const link = directionsLink();
    expect(link).toContain("https://www.google.com/maps/dir/?api=1");
    expect(decodeURIComponent(link)).toContain("Kothur");
  });

  it("resolves asset URLs against the canonical domain", () => {
    expect(absoluteUrl("/og/og-image.jpg")).toBe(
      "https://myfarmhouse.vercel.app/og/og-image.jpg",
    );
  });

  it("stores wa.me-ready numbers that are valid Indian mobiles", () => {
    // wa.me needs the country code; the local number is the last 10 digits.
    for (const number of [contacts.whatsapp, contacts.inquiry]) {
      expect(number).toMatch(/^91[6-9]\d{9}$/);
      expect(number.slice(2)).toMatch(/^[6-9]\d{9}$/);
    }
  });

  it("has plausible coordinates for Kothur, Hyderabad", () => {
    expect(location.latitude).toBeGreaterThan(17);
    expect(location.latitude).toBeLessThan(17.5);
    expect(location.longitude).toBeGreaterThan(78);
    expect(location.longitude).toBeLessThan(78.5);
  });
});

/**
 * The price object holds one number in five notations. Nothing derives one
 * from another, so editing `display` alone would leave `numeric` advertising
 * the old figure to Google while the page shows the new one.
 */
describe("price", () => {
  it("keeps the numeric form equal to the display form", () => {
    expect(Number(price.display.replace(/\D/g, ""))).toBe(price.numeric);
  });

  it("agrees across the abbreviated notations", () => {
    const lakhs = Number(price.short.replace(/\D/g, ""));
    expect(lakhs * 100000).toBe(price.numeric);
    expect(price.headline).toContain(String(lakhs));
    expect(price.onwards).toContain(String(lakhs));
  });
});