import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".html", ".xml", ".txt", ".json", ".css"]);

const SKIP_DIRECTORIES = new Set([
  "node_modules",
  "dist",
  ".git",
  ".kilo",
  "coverage",
  "scripts",
]);

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

function collectFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRECTORIES.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectFiles(full, out);
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