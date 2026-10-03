/**
 * Asset generation for Green Orchid Farm Land site.
 *
 * Run: npm run assets
 *
 * Produces:
 *   public/qr/whatsapp.png     - QR to the WhatsApp contact number
 *   public/qr/site.png         - QR to the live site URL
 *   public/og/og-image.jpg     - 1200x630 social share image
 *   public/posters/*.webp      - WebP versions of every poster image
 *   public/posters/*-sm.webp   - small WebP for thumbnails / low bandwidth
 *
 * Everything is generated locally so the site never depends on a third-party
 * image or QR API at runtime.
 */

import { mkdir, readdir, readFile, rm, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const POSTERS = path.join(PUBLIC, "posters");
const QR_DIR = path.join(PUBLIC, "qr");
const OG_DIR = path.join(PUBLIC, "og");

/** Single source of truth. Kept in sync with src/config/site.ts */
const SITE_URL = "https://myfarmhouse.vercel.app";
const WHATSAPP_NUMBER = "919505903371";

/**
 * The price is rendered into image pixels, so it has to be repeated here.
 * src/config/site.ts is the authority; `npm test` fails if the two disagree,
 * because a stale price baked into a poster is the one bug no code change can
 * catch.
 */
const PRICE_DISPLAY = "₹24,00,000";
const PRICE_SHORT = "₹24L";

const AVATAR = {
  green: "#10b981",
  dark: "#0f172a",
  white: "#ffffff",
};

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

/* ------------------------------------------------------------------ */
/* QR codes                                                            */
/* ------------------------------------------------------------------ */

async function generateQrCodes() {
  await ensureDir(QR_DIR);

  const codes = [
    {
      file: "whatsapp.png",
      data: `https://wa.me/${WHATSAPP_NUMBER}`,
      color: `#0b5d3b`,
    },
    {
      file: "site.png",
      data: SITE_URL,
      color: AVATAR.dark,
    },
  ];

  for (const { file, data, color } of codes) {
    const buffer = await QRCode.toBuffer(data, {
      type: "png",
      width: 600,
      margin: 2,
      color: { dark: color, light: "#ffffff" },
      errorCorrectionLevel: "H",
    });
    await writeFile(path.join(QR_DIR, file), buffer);
    console.log(`  QR  public/qr/${file} -> ${data}`);
  }
}

/* ------------------------------------------------------------------ */
/* WebP conversion                                                     */
/* ------------------------------------------------------------------ */

/**
 * Original -> webp map. Every entry gets:
 *   <name>.webp     max width 1400 (hero / full size use)
 *   <name>-sm.webp  max width 640  (grid thumbnails)
 *
 * Several source files have doubled extensions (bus.jpg.jpeg, layout.jpg.png),
 * so every trailing image extension is stripped, not just the last one.
 */
const IMAGE_MAX_WIDTH = 1400;
const IMAGE_SM_MAX_WIDTH = 640;

const baseName = (file) => file.replace(/(\.(?:jpe?g|png|webp))+$/i, "");

async function convertToWebp() {
  await ensureDir(POSTERS);
  const files = (await readdir(POSTERS)).filter(
    (f) => !/\.webp$/i.test(f) && /\.(jpe?g|png)$/i.test(f),
  );

  // Remove outputs from a previous run whose base names no longer match.
  const wanted = new Set(files.flatMap((f) => [`${baseName(f)}.webp`, `${baseName(f)}-sm.webp`]));
  for (const existing of await readdir(POSTERS)) {
    if (/\.webp$/i.test(existing) && !wanted.has(existing)) {
      await rm(path.join(POSTERS, existing));
      console.log(`  RM   posters/${existing} (stale output)`);
    }
  }

  let savedBytes = 0;

  for (const file of files) {
    const src = path.join(POSTERS, file);
    const name = baseName(file);
    const input = await readFile(src);
    const originalSize = input.length;

    const large = await sharp(input)
      .resize({ width: IMAGE_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const small = await sharp(input)
      .resize({ width: IMAGE_SM_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 76 })
      .toBuffer();

    await writeFile(path.join(POSTERS, `${name}.webp`), large);
    await writeFile(path.join(POSTERS, `${name}-sm.webp`), small);

    savedBytes += originalSize - large.length;
    console.log(
      `  IMG ${file} ${(originalSize / 1024).toFixed(0)}KB -> ` +
        `${name}.webp ${(large.length / 1024).toFixed(0)}KB, ` +
        `${name}-sm.webp ${(small.length / 1024).toFixed(0)}KB`,
    );
  }

  console.log(
    `  -> saved ~${(savedBytes / 1024).toFixed(0)}KB on full-size images alone`,
  );
}

/* ------------------------------------------------------------------ */
/* Open Graph / Twitter share image                                    */
/* ------------------------------------------------------------------ */

async function generateOgImage() {
  await ensureDir(OG_DIR);
  const W = 1200;
  const H = 630;

  const heroPath = path.join(POSTERS, "clubhouse.jpg.jpeg");
  const heroBuffer = await readFile(heroPath);

  // Background photo, scaled and darkened for text legibility
  const background = await sharp(heroBuffer)
    .resize(W, H, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.45 })
    .jpeg({ quality: 88 })
    .toBuffer();

  const brandLine = "BRIGHT PROPERTIES  ·  OWN YOUR FARMHOUSE";

  const svgOverlay = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#020617" stop-opacity="0.85"/>
        <stop offset="45%" stop-color="#020617" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#020617" stop-opacity="0.95"/>
      </linearGradient>
      <linearGradient id="emeraldBar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#34d399"/>
        <stop offset="50%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="#34d399"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#top)"/>

    <rect x="64" y="60" width="${W - 128}" height="6" rx="3" fill="url(#emeraldBar)"/>

    <text x="64" y="118" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="bold" letter-spacing="4" fill="${AVATAR.green}">${brandLine}</text>

    <text x="64" y="222" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="${AVATAR.white}">Green Orchid</text>
    <text x="64" y="304" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="${AVATAR.green}">Farm Land</text>

    <text x="64" y="366" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#cbd5e1">Gated 1BHK Farmhouse &#183; 121 sq.yards</text>

    <rect x="64" y="404" width="360" height="76" rx="38" fill="#dc2626"/>
    <text x="244" y="455" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="bold" fill="${AVATAR.white}">${PRICE_DISPLAY}</text>

    <text x="452" y="434" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="bold" fill="#fbbf24">GATED COMMUNITY</text>
    <text x="452" y="466" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#e2e8f0">Pool &#183; Club House &#183; Gated</text>

    <line x1="64" y1="516" x2="${W - 64}" y2="516" stroke="#1e293b" stroke-width="2"/>

    <text x="64" y="560" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#e2e8f0">Near Kothur &#183; JP Dargah &#183; Bangalore Highway NH-44</text>
    <text x="64" y="596" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="${AVATAR.green}" font-weight="bold">+91 95059 03371&#160;&#160;&#183;&#160;&#160;Starting ${PRICE_SHORT}&#160;&#160;&#183;&#160;&#160;15 mins from Shamshabad Airport</text>
  </svg>`);

  const outPath = path.join(OG_DIR, "og-image.jpg");
  await sharp(background)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);

  const { size } = await stat(outPath);
  console.log(`  OG  public/og/og-image.jpg ${W}x${H} ${(size / 1024).toFixed(0)}KB`);
}

/* ------------------------------------------------------------------ */
/* robots.txt + sitemap.xml                                            */
/* ------------------------------------------------------------------ */

/**
 * These are regenerated on every build so `lastmod` can never go stale
 * again - the previous sitemap was pinned to 2024-12-01, which told Google
 * the content had not changed in nearly two years.
 */
async function generateCrawlFiles() {
  const today = new Date().toISOString().slice(0, 10);

  await writeFile(
    path.join(PUBLIC, "robots.txt"),
    `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
    "utf-8",
  );
  console.log("  GEN  public/robots.txt");

  await writeFile(
    path.join(PUBLIC, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
    "utf-8",
  );
  console.log(`  GEN  public/sitemap.xml (lastmod ${today})`);
}

/* ------------------------------------------------------------------ */
/* Consistency guards                                                  */
/* ------------------------------------------------------------------ */

/**
 * The two domains this project has gone by. Only SITE_URL may appear in the
 * built output; a leftover old domain in a QR code or share link sends
 * visitors somewhere else entirely.
 */
const STALE_DOMAINS = ["own-your-farmhouse.vercel.app"];

async function checkForStaleDomains() {
  const distDir = path.join(ROOT, "dist");
  if (!existsSync(distDir)) {
    console.log("  SKIP stale domain check (no dist/ yet - run after build)");
    return;
  }

  const files = [];
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.(js|css|html|xml|txt|svg)$/i.test(entry.name)) files.push(full);
    }
  };
  await walk(distDir);

  const offenders = [];
  for (const file of files) {
    const contents = await readFile(file, "utf-8");
    for (const domain of STALE_DOMAINS) {
      if (contents.includes(domain)) {
        offenders.push(`${path.relative(ROOT, file)} contains ${domain}`);
      }
    }
  }

  if (offenders.length > 0) {
    console.error(`  FAIL stale domain found in build output:\n    ${offenders.join("\n    ")}`);
    process.exitCode = 1;
  } else {
    console.log(`  OK  no stale domains in ${files.length} built files`);
  }
}

/**
 * Every image path referenced from source must actually exist in /public.
 * A missing hero image is invisible in code review and obvious to customers.
 */
async function verifyAssetReferences() {
  const missing = [];
  const required = [
    // Price-bearing posters are generated by generate-posters.mjs. The
    // hand-made originals they are built from are deliberately NOT published:
    // they are priced at the old rate and would keep serving it from
    // /posters/* next to the current price.
    "generated/farmhouse.jpg",
    "generated/farmhouse.webp",
    "generated/farmhouse-sm.webp",
    "generated/weekend-houses.jpg",
    "generated/weekend-houses.webp",
    "generated/weekend-houses-sm.webp",
    // Hand-designed by the owner and committed as-is. The price is baked into
    // these as pixels, so unlike the generated posters above they CANNOT be
    // rebuilt by `npm run assets` - a price change means replacing these two
    // files by hand. They are checked here so a missing file fails the build.
    "generated/dussehra-offer.jpg",
    "generated/farmhouse-24-lakhs.jpg",
    // Display images: webp for the page, jpeg kept for downloads and OG tags
    "posters/clubhouse.webp",
    "posters/clubhouse-sm.webp",
    "posters/clubhouse.jpg.jpeg",
    "posters/bus.webp",
    "posters/bus-sm.webp",
    "posters/bus.jpg.jpeg",
    "posters/plot.webp",
    "posters/plot-sm.webp",
    "posters/plot.jpg.jpeg",
    "posters/layout.webp",
    "posters/layout-sm.webp",
    "posters/layout.jpg.png",
    // Locally generated
    "qr/whatsapp.png",
    "qr/site.png",
    "og/og-image.jpg",
    "favicon.svg",
  ];

  for (const rel of required) {
    if (!existsSync(path.join(PUBLIC, rel))) missing.push(rel);
  }

  if (missing.length > 0) {
    console.error(
      `  FAIL missing assets referenced by the site:\n    ${missing.join("\n    ")}`,
    );
    process.exitCode = 1;
  } else {
    console.log(`  OK  all ${required.length} required assets present`);
  }
}

/* ------------------------------------------------------------------ */

async function main() {
  const verifyOnly = process.argv.includes("--verify-only");

  if (verifyOnly) {
    console.log("Verifying generated assets...\n");
    await verifyAssetReferences();
    console.log("");
    await checkForStaleDomains();
    console.log("\nDone.");
    return;
  }

  console.log("Generating assets for Green Orchid Farm Land...\n");
  await generateQrCodes();
  console.log("");
  await convertToWebp();
  console.log("");
  await generateOgImage();
  console.log("");
  await generateCrawlFiles();
  console.log("");
  await verifyAssetReferences();
  console.log("");
  await checkForStaleDomains();
  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});