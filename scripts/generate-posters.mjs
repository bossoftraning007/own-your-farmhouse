/**
 * Shareable poster generation.
 *
 * Why this exists: the price is rendered into image pixels, so a price change
 * in src/config/site.ts cannot reach a poster that was baked by hand at the old
 * price. Those originals are kept untouched in public/posters/ - this script
 * writes fresh posters alongside them at public/generated/.
 *
 * Layout is generated rather than hand-designed so the price, phone number and
 * QR code are always in sync with the config, and the QR is a real scannable
 * code rather than a link someone has to retype.
 *
 * Run: npm run assets
 */

import { mkdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
/**
 * Source photos live outside public/ on purpose. The hand-made originals in
 * here are priced at the old rate; keeping them in public/ would keep serving
 * them at stable /posters/* URLs next to the new price, which is the exact
 * two-different-numbers problem this script exists to prevent.
 */
const POSTERS = path.join(ROOT, "assets", "posters");
const OUT = path.join(ROOT, "public", "generated");

/** Must match src/config/site.ts. Enforced by the test suite. */
const PRICE_DISPLAY = "₹24,00,000";
const BRAND = "BRIGHT PROPERTIES";
const PROJECT = "GREEN ORCHID FARM LAND";
const WHATSAPP_NUMBER = "919505903371";
const WHATSAPP_DISPLAY = "+91 95059 03371";
const SITE_DISPLAY = "myfarmhouse.vercel.app";

const GREEN = "#34d399";
const DARK = "#0f172a";
const WHITE = "#ffffff";
const SLATE = "#cbd5e1";
const SLATE_DIM = "#94a3b8";

/** 4:5 portrait - the aspect that survives WhatsApp and Instagram cropping. */
const W = 1080;
const H = 1350;

const POSTER_SPECS = [
  {
    slug: "farmhouse",
    photo: "farmhouse.jpeg",
    eyebrow: "GATED 1BHK FARMHOUSE",
    headlineLines: ["YOUR DREAM", "FARMHOUSE"],
    photoFocus: "attention",
    features: [
      "121 sq.yards plot",
      "400 sq.ft built-up",
      "2 years free maintenance",
      "Gated with 24/7 security",
    ],
  },
  {
    slug: "weekend-houses",
    photo: "weekend-houses.jpg",
    eyebrow: "WEEKEND HOMES NEAR NH-44",
    headlineLines: ["WEEKEND", "HOUSE PLOTS"],
    photoFocus: "attention",
    features: [
      "121 sq.yards plot",
      "Fruit plants included",
      "30ft wide internal roads",
      "15 mins from the airport",
    ],
  },
];

/** Build the overlay SVG. All prices/copy come in as arguments, never literals. */
function overlaySvg({ eyebrow, headlineLines, features, qrFile }) {
  const featureRows = features
    .map(
      (f, i) =>
        `<text x="92" y="${906 + i * 40}" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${SLATE}">&#9679; ${f}</text>`,
    )
    .join("\n      ");

  const [line1, line2] = headlineLines;

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#020617" stop-opacity="0.82"/>
        <stop offset="40%" stop-color="#020617" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="#020617" stop-opacity="0.94"/>
      </linearGradient>
      <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${GREEN}"/>
        <stop offset="50%" stop-color="#fbbf24"/>
        <stop offset="100%" stop-color="${GREEN}"/>
      </linearGradient>
      <linearGradient id="price" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#dc2626"/>
        <stop offset="100%" stop-color="#b91c1c"/>
      </linearGradient>
    </defs>

    <rect width="${W}" height="${H}" fill="url(#scrim)"/>
    <rect x="0" y="0" width="${W}" height="10" fill="url(#bar)"/>

    <!-- Brand header -->
    <text x="92" y="112" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="bold" letter-spacing="5" fill="${GREEN}">${BRAND}</text>
    <text x="92" y="160" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="bold" fill="${WHITE}">${PROJECT}</text>

    <!-- Eyebrow badge -->
    <rect x="92" y="196" width="${eyebrow.length * 15 + 56}" height="52" rx="26" fill="#fbbf24"/>
    <text x="${92 + (eyebrow.length * 15 + 56) / 2}" y="230" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="bold" fill="#0f172a">${eyebrow}</text>

    <!-- Headline -->
    <text x="92" y="360" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="bold" fill="${WHITE}">${line1}</text>
    <text x="92" y="444" font-family="Arial, Helvetica, sans-serif" font-size="74" font-weight="bold" fill="${GREEN}">${line2}</text>

    <!-- Price -->
    <rect x="92" y="492" width="896" height="150" rx="24" fill="url(#price)"/>
    <text x="${92 + 448}" y="540" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="bold" letter-spacing="3" fill="#fcd34d">STARTING PRICE</text>
    <text x="${92 + 448}" y="606" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="bold" fill="${WHITE}">${PRICE_DISPLAY}</text>

    <!-- Features -->
    ${featureRows}

    <!-- Location -->
    <text x="92" y="1078" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="bold" fill="${GREEN}">LOCATION</text>
    <text x="92" y="1114" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${WHITE}">Near JP Dargah, Bangalore Highway NH-44, Kothur</text>
    <text x="92" y="1150" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${SLATE}">15 mins from Shamshabad Airport &#183; 2 yrs free maintenance</text>

    <!-- QR + contact -->
    <rect x="92" y="1188" width="896" height="122" rx="20" fill="${WHITE}"/>
    <image href="data:image/png;base64,${qrFile}" x="108" y="1198" width="102" height="102"/>
    <text x="238" y="1232" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#065f46">SCAN FOR DETAILS, PHOTOS &amp; SITE VISIT</text>
    <text x="238" y="1272" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="bold" fill="#0f172a">${WHATSAPP_DISPLAY}</text>
    <text x="238" y="1298" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#475569">${SITE_DISPLAY}</text>

    <!-- Footer strip -->
    <rect x="0" y="1318" width="${W}" height="32" fill="${GREEN}"/>
    <text x="${W / 2}" y="1341" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="bold" fill="#022c22">INVEST &#183; RELAX &#183; ENJOY &#183; GROW</text>
  </svg>`;
}

async function generatePosters() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

  // One QR, reused on every poster: a scan lands on the site, where the phone
  // number and every photo live. Encoded straight from memory - writing it to
  // public/qr first would ship a file nothing reads.
  const qrPng = await QRCode.toBuffer(`https://wa.me/${WHATSAPP_NUMBER}`, {
    type: "png",
    width: 240,
    margin: 1,
    color: { dark: "#0f172a", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });
  const qrBase64 = qrPng.toString("base64");

  for (const spec of POSTER_SPECS) {
    const photoPath = path.join(POSTERS, spec.photo);
    if (!existsSync(photoPath)) {
      console.warn(`  WARN poster photo missing: ${spec.photo}`);
      continue;
    }

    const photo = await readFile(photoPath);
    const background = await sharp(photo)
      .resize(W, 780, { fit: "cover", position: spec.photoFocus })
      .modulate({ brightness: 0.55 })
      .jpeg({ quality: 88 })
      .toBuffer();

    // Photo occupies the top band; the rest of the canvas is the dark panel
    // the overlay draws onto. Built with create+composite because extend()
    // pads the top edge upward, which silently produces a taller canvas.
    const top = await sharp({
      create: { width: W, height: H, channels: 3, background: DARK },
    })
      .composite([{ input: background, top: 0, left: 0 }])
      .png()
      .toBuffer();

    const overlay = Buffer.from(
      overlaySvg({ ...spec, qrFile: qrBase64 }),
      "utf-8",
    );

    const outFile = path.join(OUT, `${spec.slug}.jpg`);
    await sharp(top)
      .composite([{ input: overlay, top: 0, left: 0 }])
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(outFile);

    const { size } = await stat(outFile);

    console.log(
      `  GEN public/generated/${spec.slug}.jpg ${W}x${H} ${PRICE_DISPLAY} (${Math.round(size / 1024)}KB)`,
    );

    // WebP for the page, full-size JPEG stays downloadable.
    await sharp(outFile)
      .webp({ quality: 82 })
      .toFile(path.join(OUT, `${spec.slug}.webp`));
    await sharp(outFile)
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(OUT, `${spec.slug}-sm.webp`));
  }
}

export { generatePosters };

// Always run when invoked directly. The import.meta.url check misfires on
// Windows paths, which silently skipped generation once.
if (
  process.argv[1] &&
  path.resolve(process.argv[1]).replace(/\\/g, "/").endsWith("generate-posters.mjs")
) {
  await generatePosters();
}