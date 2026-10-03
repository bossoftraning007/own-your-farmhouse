/**
 * Structural verification of the generated posters.
 *
 * Two sharp/jsQR behaviours make naive verification silently pass or fail for
 * the wrong reason, so both are worked around explicitly:
 *
 *  1. `.stats()` reports whole-image statistics and ignores any preceding
 *     `.extract()`, so it cannot be used to measure a region. Means and
 *     standard deviations are computed from raw bytes instead.
 *  2. jsQR requires RGBA. A greyscale raw buffer is rejected outright.
 *
 * The QR is embedded in the overlay as a base64 data-URI <image>. SVG renderers
 * do not always resolve those, so a poster can look correct while carrying an
 * unrenderable QR. Decoding the QR out of the finished JPEG is the only proof
 * a phone can actually scan it.
 */
import sharp from "sharp";
import jsQR from "jsqr";
import { existsSync } from "node:fs";

const W = 1080;
const H = 1350;

/** Must match overlaySvg() in generate-posters.mjs. */
const PRICE_BAND = { left: 92, top: 492, width: 896, height: 150 };
const HEADLINE_BAND = { left: 92, top: 300, width: 760, height: 160 };
/** White QR panel, with the quiet zone jsQR needs. */
const QR_BOX = { left: 92, top: 1188, width: 150, height: 122 };

const EXPECTED_QR = "https://wa.me/919505903371";

const posters = [
  "public/generated/farmhouse.jpg",
  "public/generated/weekend-houses.jpg",
];

async function rawOf(file, region) {
  const { data, info } = await sharp(file)
    .extract(region)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

function meanStdev(data, channels) {
  let sum = 0;
  let sumSq = 0;
  const n = data.length / channels;
  for (let i = 0; i < data.length; i += channels) {
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    sum += lum;
    sumSq += lum * lum;
  }
  const mean = sum / n;
  return { mean, stdev: Math.sqrt(sumSq / n - mean * mean) };
}

let failed = false;
const fail = (m) => {
  console.log(`  FAIL ${m}`);
  failed = true;
};
const ok = (m) => console.log(`  ok   ${m}`);

for (const file of posters) {
  console.log(`\n${file}`);
  if (!existsSync(file)) {
    fail("missing - run `npm run assets`");
    continue;
  }

  const meta = await sharp(file).metadata();
  if (meta.width !== W || meta.height !== H) {
    fail(`dimensions ${meta.width}x${meta.height}, expected ${W}x${H}`);
    continue;
  }
  ok(`dimensions ${meta.width}x${meta.height}`);

  // Price band must be the red price pill.
  const price = await rawOf(file, PRICE_BAND);
  let r = 0;
  let g = 0;
  let b = 0;
  const pn = price.data.length / price.info.channels;
  for (let i = 0; i < price.data.length; i += price.info.channels) {
    r += price.data[i];
    g += price.data[i + 1];
    b += price.data[i + 2];
  }
  r /= pn;
  g /= pn;
  b /= pn;
  console.log(`  price band mean RGB: ${r.toFixed(0)},${g.toFixed(0)},${b.toFixed(0)}`);
  if (r > 120 && r > g + 60 && r > b + 60) ok("price pill rendered red");
  else fail(`price band is not the red pill (r=${r.toFixed(0)})`);

  // Price text must punch through the pill: a red band with no white in it
  // means the "Rs 24,00,000" glyphs did not render.
  let brightInPill = 0;
  for (let i = 0; i < price.data.length; i += price.info.channels) {
    const lum =
      0.2126 * price.data[i] + 0.7152 * price.data[i + 1] + 0.0722 * price.data[i + 2];
    if (lum > 170) brightInPill++;
  }
  const pct = (brightInPill / pn) * 100;
  console.log(`  bright (text) pixels in pill: ${pct.toFixed(1)}%`);
  if (pct > 3 && pct < 60) ok("price text visible on the pill");
  else fail(`price text coverage ${pct.toFixed(1)}% - glyphs likely missing`);

  // Headline band must contain text, not a flat fill.
  const head = await rawOf(file, HEADLINE_BAND);
  const h = meanStdev(head.data, head.info.channels);
  console.log(`  headline band mean ${h.mean.toFixed(0)} stdev ${h.stdev.toFixed(0)}`);
  if (h.stdev > 25) ok("headline text rendered");
  else fail(`headline band flat (stdev ${h.stdev.toFixed(0)}) - text missing`);

  // QR must decode, with a quiet zone and in RGBA for jsQR.
  const qr = await sharp(file)
    .extract(QR_BOX)
    .removeAlpha()
    .greyscale()
    .normalise()
    .resize(QR_BOX.width * 4, QR_BOX.height * 4, { kernel: "nearest", fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // sharp keeps the greyscale crop at 1 channel and will not widen it back, so
  // the greyscale is expanded to RGBA here. jsQR hard-requires 4 channels.
  if (qr.info.channels !== 1) {
    fail(`QR crop is ${qr.info.channels} channels, expected 1 greyscale`);
    continue;
  }
  const px = qr.info.width * qr.info.height;
  const rgba = new Uint8ClampedArray(px * 4);
  for (let i = 0; i < px; i++) {
    const v = qr.data[i];
    rgba[i * 4] = v;
    rgba[i * 4 + 1] = v;
    rgba[i * 4 + 2] = v;
    rgba[i * 4 + 3] = 255;
  }

  const decoded = jsQR(rgba, qr.info.width, qr.info.height);
  if (!decoded) fail("QR did not decode - embedded data-URI did not render");
  else if (decoded.data !== EXPECTED_QR) fail(`QR points to ${decoded.data}`);
  else ok(`QR scans to ${decoded.data}`);
}

console.log(
  failed
    ? "\nRESULT: posters FAILED verification"
    : "\nRESULT: posters verified - price, headline and QR all render",
);
process.exit(failed ? 1 : 0);
