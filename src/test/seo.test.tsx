import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { render } from "@testing-library/react";
import App from "../App";
import { Seo } from "../components/Seo";
import { seo, SITE_URL } from "../config/site";
import { faqs } from "../data";

/**
 * Search snippet guardrails.
 *
 * The title was 87 characters and the description 203, so Google truncated
 * both mid-word on every result. Lengths are now pinned, and because
 * index.html cannot import the config module, these tests also fail if the
 * static HTML drifts from the runtime values.
 */

const indexHtml = readFileSync(
  path.resolve(process.cwd(), "index.html"),
  "utf-8",
);

const GOOGLE_TITLE_LIMIT = 65;
const GOOGLE_DESCRIPTION_LIMIT = 160;

describe("title tag", () => {
  it("fits within Google's title limit", () => {
    expect(seo.title.length).toBeLessThanOrEqual(GOOGLE_TITLE_LIMIT);
  });

  it("leads with the money keyword, not the project name", () => {
    expect(seo.title.toLowerCase()).toMatch(/farmhouse/);
    expect(seo.title.toLowerCase()).toContain("kothur");
    // Location first, brand later - brand name buries the searchable terms.
    expect(seo.title.indexOf("Kothur")).toBeLessThan(
      seo.title.indexOf("Green Orchid") === -1
        ? Number.MAX_SAFE_INTEGER
        : seo.title.indexOf("Green Orchid"),
    );
  });

  it("is identical in index.html and the config", () => {
    expect(indexHtml).toContain(`<title>${seo.title}</title>`);
  });

  it("sets the same title on the document at runtime", () => {
    render(<Seo />);
    expect(document.title).toBe(seo.title);
  });
});

describe("meta description", () => {
  it("fits within Google's description limit", () => {
    expect(seo.description.length).toBeLessThanOrEqual(GOOGLE_DESCRIPTION_LIMIT);
  });

  it("includes a price and a call to action", () => {
    expect(seo.description).toMatch(/₹/);
    expect(seo.description).toMatch(/Call/);
  });

  it("is identical in index.html and the config", () => {
    expect(indexHtml).toContain(`content="${seo.description}"`);
  });
});

describe("social share tags", () => {
  const required = [
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'property="og:image:width"',
    'property="og:image:height"',
    'property="og:image:type"',
    'property="og:image:alt"',
    'property="og:url"',
    'property="og:type"',
    'name="twitter:card"',
    'name="twitter:title"',
    'name="twitter:description"',
    'name="twitter:image"',
    'name="twitter:image:alt"',
    'rel="canonical"',
  ];

  it("every tag a WhatsApp or X preview depends on is present", () => {
    for (const attr of required) {
      expect(indexHtml).toContain(attr);
    }
  });

  it("uses absolute URLs for the share image", () => {
    expect(indexHtml).toContain(`property="og:image"`);
    expect(indexHtml).toContain(SITE_URL);
    expect(indexHtml).not.toMatch(/og:image"\s+content="\/og\//);
  });

  it("declares the canonical URL in index.html", () => {
    expect(indexHtml).toContain(
      `<link rel="canonical" href="${SITE_URL}/" />`,
    );
  });
});

describe("structured data", () => {
  function readLdJson() {
    render(<Seo />);
    const script = document.getElementById("ld-json-realestate");
    expect(script).not.toBeNull();
    return JSON.parse(script?.textContent ?? "{}");
  }

  it("emits agent, product and FAQ in one graph", () => {
    const ld = readLdJson();
    const types = ld["@graph"].map((n: { "@type": string }) => n["@type"]);
    expect(types).toContain("RealEstateAgent");
    expect(types).toContain("Product");
    expect(types).toContain("FAQPage");
  });

  it("covers every visible FAQ, so all are eligible for rich results", () => {
    const ld = readLdJson();
    const faqNode = ld["@graph"].find(
      (n: { "@type": string }) => n["@type"] === "FAQPage",
    );
    expect(faqNode.mainEntity).toHaveLength(faqs.length);
    expect(faqNode.mainEntity.map((q: { name: string }) => q.name)).toEqual(
      faqs.map((f) => f.q),
    );
  });

  it("advertises the price with a currency on the product", () => {
    const ld = readLdJson();
    const product = ld["@graph"].find(
      (n: { "@type": string }) => n["@type"] === "Product",
    );
    expect(product.offers.price).toBe("2100000");
    expect(product.offers.priceCurrency).toBe("INR");
    expect(product.offers.availability).toContain("InStock");
  });

  it("carries the phone number and geo for local intent", () => {
    const ld = readLdJson();
    const agent = ld["@graph"].find(
      (n: { "@type": string }) => n["@type"] === "RealEstateAgent",
    );
    expect(agent.telephone).toMatch(/^\+91\d{10}$/);
    expect(agent.geo.latitude).toBeGreaterThan(17);
    expect(agent.areaServed).toContainEqual({ "@type": "City", name: "Hyderabad" });
  });
});

describe("headings and alt text on the rendered page", () => {
  it("uses exactly one H1", () => {
    const { container } = render(<App />);
    // Several H1s split keyword focus across the document.
    expect(container.querySelectorAll("h1")).toHaveLength(1);
  });

  it("keeps the H1 brand-visible and keyword-relevant", () => {
    render(<App />);
    const h1 = document.querySelector("h1");
    expect(h1?.textContent?.replace(/\s+/g, " ").trim()).toContain(
      "Green Orchid",
    );
  });

  it("puts location keywords in a real heading, not only body copy", () => {
    render(<App />);
    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3"),
    ).map((h) => h.textContent?.replace(/\s+/g, " ").trim() ?? "");

    const joined = headings.join(" | ").toLowerCase();
    expect(joined).toContain("kothur");
    expect(joined).toContain("nh-44");
  });

  it("gives every content image a descriptive alt attribute", () => {
    const { container } = render(<App />);
    const images = Array.from(container.querySelectorAll("img"));

    expect(images.length).toBeGreaterThan(3);
    for (const img of images) {
      const alt = img.getAttribute("alt");
      expect(alt, `missing alt on ${img.getAttribute("src")}`).toBeTruthy();
      expect(alt!.length).toBeGreaterThan(8);
      expect(alt!.toLowerCase()).not.toBe("image");
      expect(alt!.toLowerCase()).not.toBe("photo");
    }
  });

  it("does not point any image at a file that is missing", () => {
    const { container } = render(<App />);
    const publicDir = path.resolve(process.cwd(), "public");
    const missing = Array.from(container.querySelectorAll("img"))
      .map((i) => i.getAttribute("src") ?? "")
      .filter((src) => src.startsWith("/"))
      .filter((src) => !existsSync(path.join(publicDir, src)));

    expect(missing).toEqual([]);
  });
});