import { describe, expect, it } from "vitest";
import {
  amenities,
  faqs,
  galleryImages,
  legalDocs,
  navItems,
  nearbyPlaces,
  properties,
} from "../data";
import { existsSync } from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");

describe("site data integrity", () => {
  it("ships at least two property variants", () => {
    // The site previously had a single property card, which reads as
    // "one unit left" rather than "a development with options".
    expect(properties.length).toBeGreaterThanOrEqual(2);
  });

  it("gives every property a unique id, price and highlights", () => {
    const ids = properties.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const property of properties) {
      expect(property.name).toBeTruthy();
      expect(property.price).toBeGreaterThan(0);
      expect(property.highlights.length).toBeGreaterThanOrEqual(3);
      expect(property.plot).toMatch(/sq/);
    }
  });

  it("references image files that actually exist in /public", () => {
    const referenced = [
      ...properties.map((p) => p.image.full),
      ...properties.map((p) => p.image.small),
      ...galleryImages.map((g) => g.full),
      ...galleryImages.map((g) => g.small),
    ];

    const missing = referenced.filter((src) => !existsSync(path.join(PUBLIC_DIR, src)));
    expect(missing).toEqual([]);
  });

  it("gives every gallery image alt text for accessibility and SEO", () => {
    for (const image of galleryImages) {
      expect(image.alt.length).toBeGreaterThan(10);
      expect(image.label).toBeTruthy();
    }
  });

  it("keeps the gallery label unique", () => {
    const labels = galleryImages.map((g) => g.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("lists nearby places with a distance each", () => {
    expect(nearbyPlaces.length).toBeGreaterThanOrEqual(5);
    for (const place of nearbyPlaces) {
      expect(place.distance).toMatch(/\d/);
    }
  });

  it("claims HMDA approval in the legal documents", () => {
    expect(legalDocs.some((d) => /HMDA/i.test(d.title))).toBe(true);
  });

  it("answers the buyer's most common questions in the FAQ", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(5);
    for (const faq of faqs) {
      expect(faq.q.length).toBeGreaterThan(10);
      expect(faq.a.length).toBeGreaterThan(30);
    }
    expect(faqs.some((f) => /HMDA/i.test(f.q + f.a))).toBe(true);
    expect(faqs.some((f) => /airport/i.test(f.q + f.a))).toBe(true);
  });

  it("has amenities to fill the amenity grid", () => {
    expect(amenities.length).toBeGreaterThanOrEqual(10);
  });
});

describe("navigation", () => {
  const sectionIds = [
    "top",
    "properties",
    "gallery",
    "amenities",
    "location",
    "faq",
    "contact",
  ];

  it("only links to sections that actually exist on the page", () => {
    // A nav entry pointing at a missing section scrolls nowhere and looks
    // broken on mobile. Guard it against the data drifting from the markup.
    for (const item of navItems) {
      expect(sectionIds).toContain(item.id);
    }
  });

  it("has no duplicate nav entries", () => {
    const ids = navItems.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every nav entry a human label", () => {
    for (const item of navItems) {
      expect(item.label.length).toBeGreaterThan(2);
    }
  });
});