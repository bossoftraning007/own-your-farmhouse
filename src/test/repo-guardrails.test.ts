import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { price } from "../config/site";

/**
 * A repo-wide guard.
 *
 * The QR code, the poster share text and the sitemap all used to point at
 * own-your-farmhouse.vercel.app while SEO pointed at myfarmhouse.vercel.app.
 * That class of bug is invisible in review because every individual line looks
 * correct. This test walks the source and fails if the retired domain, the old
 * public QR API, or the placeholder Google Maps payload ever comes back.
 */

const ROOT = process.cwd();

const FORBIDDEN = [
  {
    needle: "own-your-farmhouse.vercel.app",
    why: "retired domain - the canonical URL is myfarmhouse.vercel.app (see src/config/site.ts)",
  },
  {
    needle: "api.qrserver.com",
    why: "third-party QR API - QR codes are generated locally into public/qr/",
  },
  {
    needle: "4v1234567890",
    why: "placeholder Google Maps pb parameter that rendered a blank map",
  },
];

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".html", ".xml", ".txt", ".json", ".css"]);

const SKIP_DIRECTORIES = new Set([
  "node_modules",
  "dist",
  ".git",
  ".kilo",
  "coverage",
  "scripts",
]);

/**
 * The price is rendered into pixels, so the asset scripts repeat it. They are
 * excluded from the scan above because they legitimately enumerate retired
 * domains, but a stale price in them is never legitimate - so they are scanned
 * for prices separately, with "scripts" included.
 */
const PRICE_SKIP_DIRECTORIES = new Set(
  [...SKIP_DIRECTORIES].filter((dir) => dir !== "scripts"),
);

/**
 * The project sold at 21 lakhs before moving to 24. Nothing should still
 * advertise 21: a visitor who sees both numbers cannot tell which is real, and
 * the cheaper one is the one that gets them excited.
 */
const STALE_PRICES = [
  "21,00,000",
  "2100000",
  "₹21",
  "Rs 21",
  "Rs. 21",
  "21 Lakhs",
  "21L",
];

/**
 * The HMDA approval claim was removed from the whole site at the owner's
 * request. It is a strong trust signal and a valuable search keyword, so this
 * is here to make removing it a deliberate act rather than an accident that
 * gets reverted by a well-meaning copy edit.
 */
const RETIRED_CLAIMS = [
  {
    needle: "HMDA",
    why: "the approval claim was removed site-wide at the owner's request",
  },
  {
    needle: "350 sq.ft",
    why: "built-up area is 400 sq.ft across every property and asset",
  },
];

/**
 * This file necessarily contains the strings it forbids, so exclude itself
 * and every other test file - tests legitimately encode forbidden values in
 * order to assert on them.
 */
const SELF = fileURLToPath(import.meta.url);
const isTestFile = (file: string) => {
  const normalised = path.resolve(file).split(path.sep).join("/");
  return normalised === SELF.split(path.sep).join("/") || normalised.includes("/src/test/");
};

function collectFiles(
  dir: string,
  skip: Set<string> = SKIP_DIRECTORIES,
  out: string[] = [],
): string[] {
  for (const entry of readdirSync(dir)) {
    if (skip.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectFiles(full, skip, out);
    } else if (
      SCAN_EXTENSIONS.has(path.extname(entry)) &&
      !isTestFile(full)
    ) {
      out.push(full);
    }
  }
  return out;
}

describe("repository guardrails", () => {
  const files = collectFiles(ROOT);

  it("found source files to scan", () => {
    expect(files.length).toBeGreaterThan(5);
  });

  for (const { needle, why } of FORBIDDEN) {
    it(`never contains "${needle}" - ${why}`, () => {
      const offenders = files.filter((file) =>
        readFileSync(file, "utf-8").includes(needle),
      );
      expect(
        offenders.map((f) => path.relative(ROOT, f)),
      ).toEqual([]);
    });
  }

  it("keeps the generated QR codes committed", () => {
    // If these are missing the contact CTAs render as broken images.
    for (const qr of ["public/qr/whatsapp.png", "public/qr/site.png"]) {
      expect(statSync(path.join(ROOT, qr)).size).toBeGreaterThan(1000);
    }
  });

  it("keeps the Open Graph share image committed", () => {
    expect(statSync(path.join(ROOT, "public/og/og-image.jpg")).size).toBeGreaterThan(5000);
  });

  it("does not reference the unused Vite template asset from source", () => {
    // robots.txt may disallow it, but no component or entry file should load it.
    const offenders = files
      .filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
      .filter((f) => readFileSync(f, "utf-8").includes("vite.svg"));

    expect(offenders.map((f) => path.relative(ROOT, f))).toEqual([]);
  });
});

/**
 * The price cannot be verified by reading the source alone, because a large
 * part of it is baked into generated images. These guards cover the two places
 * the number can silently go stale: a hand-edited literal, and an asset script
 * that no longer agrees with src/config/site.ts.
 */
describe("pricing stays canonical", () => {
  const priceFiles = collectFiles(ROOT, PRICE_SKIP_DIRECTORIES);

  it("finds the price-bearing sources to scan", () => {
    // Includes scripts/, which the retired-domain scan skips.
    expect(
      priceFiles.some((f) => f.replace(/\\/g, "/").endsWith("generate-posters.mjs")),
    ).toBe(true);
  });

  for (const needle of STALE_PRICES) {
    it(`no longer advertises "${needle}"`, () => {
      const offenders = priceFiles.filter((file) =>
        readFileSync(file, "utf-8").includes(needle),
      );
      expect(
        offenders.map((f) => path.relative(ROOT, f).replace(/\\/g, "/")),
      ).toEqual([]);
    });
  }

  for (const { needle, why } of RETIRED_CLAIMS) {
    it(`never mentions "${needle}" - ${why}`, () => {
      const offenders = priceFiles
        .filter((file) => new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(readFileSync(file, "utf-8")))
        .map((f) => path.relative(ROOT, f).replace(/\\/g, "/"));

      expect(offenders).toEqual([]);
    });
  }

  it("has exactly one source of truth for the price", () => {
    // price.display must appear as an imported binding, never as a literal
    // typed into a component.
    const literals = priceFiles
      .filter((f) => f.replace(/\\/g, "/").includes("/src/"))
      .filter((f) => readFileSync(f, "utf-8").includes(`"${price.display}"`));

    expect(literals.map((f) => path.relative(ROOT, f).replace(/\\/g, "/"))).toEqual([
      "src/config/site.ts",
    ]);
  });

  // Both asset scripts render the price as pixels, which no amount of source
  // review would catch. Each declares the exact canonical strings it draws.
  const ASSET_SCRIPT_EXPECTATIONS: Record<string, string[]> = {
    "scripts/generate-assets.mjs": [
      `PRICE_DISPLAY = "${price.display}"`,
      `PRICE_SHORT = "${price.short}"`,
    ],
    "scripts/generate-posters.mjs": [`PRICE_DISPLAY = "${price.display}"`],
  };

  for (const [script, declarations] of Object.entries(ASSET_SCRIPT_EXPECTATIONS)) {
    it(`keeps ${script} in sync with src/config/site.ts`, () => {
      const src = readFileSync(path.join(ROOT, script), "utf-8");
      for (const declaration of declarations) {
        expect(src).toContain(declaration);
      }
    });
  }

  it("index.html quotes the current price", () => {
    const html = readFileSync(path.join(ROOT, "index.html"), "utf-8");
    expect(html).toContain(price.display);
    expect(html).toContain(price.short);
  });

  it("serves the price-bearing posters from /generated", () => {
    // The hand-made originals are priced at the old rate. They live outside
    // public/ as photo sources only; nothing may link to a /posters/ path for
    // them, and nothing may publish them.
    const offenders = priceFiles
      .filter((f) => f.replace(/\\/g, "/").includes("/src/"))
      .filter((f) =>
        /\/posters\/(farmhouse|weekend-houses)\.(webp|jpe?g)/.test(
          readFileSync(f, "utf-8"),
        ),
      );

    expect(offenders.map((f) => path.relative(ROOT, f).replace(/\\/g, "/"))).toEqual([]);
  });

  it("does not publish the superseded price-bearing originals", () => {
    // A file left in public/ keeps being served at a stable URL by Vercel even
    // after every in-app reference moves away, so a shared or indexed link
    // still shows the retired price. They belong in assets/posters/.
    const published = path.join(ROOT, "public", "posters");
    const offenders = readdirSync(published).filter((f) =>
      /^(farmhouse|weekend-houses)\./i.test(f),
    );

    expect(offenders).toEqual([]);
  });

  it("keeps the unpublished originals available as photo sources", () => {
    // Moving them out of public/ must not delete the only copy of the photo.
    for (const original of ["farmhouse.jpeg", "weekend-houses.jpg"]) {
      expect(statSync(path.join(ROOT, "assets", "posters", original)).size).toBeGreaterThan(10000);
    }
  });

  it("keeps the regenerated posters committed", () => {
    for (const poster of ["farmhouse", "weekend-houses"]) {
      expect(
        statSync(path.join(ROOT, `public/generated/${poster}.jpg`)).size,
      ).toBeGreaterThan(10000);
    }
  });

  it("keeps the owner's hand-designed campaign posters committed", () => {
    // These two are not rebuilt by `npm run assets` - the price is pixels in a
    // hand-made design. On a price change they must be replaced by hand, and
    // this is the reminder that they exist and are worth checking.
    for (const poster of ["dussehra-offer", "farmhouse-24-lakhs"]) {
      expect(
        statSync(path.join(ROOT, `public/generated/${poster}.jpg`)).size,
      ).toBeGreaterThan(10000);
    }
  });

  it("does not advertise a discount that does not exist", () => {
    // "Was 24L" became false advertising once 24 lakhs became the real price.
    const offenders = priceFiles.filter((file) =>
      /was\s*₹?\s*24/i.test(readFileSync(file, "utf-8")),
    );
    expect(
      offenders.map((f) => path.relative(ROOT, f).replace(/\\/g, "/")),
    ).toEqual([]);
  });
});