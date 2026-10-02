# Green Orchid Farm Land — website

Marketing site for **Green Orchid Farm Land** (Bright Properties): an HMDA
approved 1BHK farmhouse development near Kothur / JP Dargah on Bangalore
Highway NH-44, Hyderabad.

- **Live:** https://myfarmhouse.vercel.app
- **Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 3 · Framer Motion
- **Hosting:** Vercel, auto-deploying from `main`

---

## Quick start

```bash
npm install
npm run dev          # local dev server on :5173
npm run build        # assets -> typecheck -> bundle -> verify
npm run preview      # serve the production build on :4173
npm run check        # lint + typecheck + tests + build
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Generates assets, typechecks, bundles, then verifies the output |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run lint` | ESLint across the project |
| `npm run typecheck` | `tsc` without emitting |
| `npm test` | Vitest, 53 tests |
| `npm run test:coverage` | Vitest with V8 coverage |
| `npm run assets` | Regenerates QR codes, WebP images, OG image, sitemap |
| `npm run check` | Everything CI runs |

---

## Project layout

```
src/
  config/site.ts        <- single source of truth: domain, phone, price, location
  data/index.ts         <- properties, gallery, amenities, nearby, legal, FAQs, nav
  lib/
    analytics.ts        <- GA4 loader + named event tracking
    cta.ts              <- shared enquiry message copy
    share.ts            <- WhatsApp share links, clipboard, native share
    validate.ts         <- phone / email validation
  components/           <- one file per section, plus Navbar / Seo / ErrorBoundary
  test/                 <- unit, component and repo-guardrail tests
scripts/
  generate-assets.mjs   <- QR + WebP + OG image + robots/sitemap generator
public/
  posters/              <- source images, generated WebP, downloadable JPEGs
  qr/                   <- generated locally, no third-party QR API
  og/og-image.jpg       <- 1200x630 social share image
```

### Where do I change business details?

Almost everything is in **`src/config/site.ts`**: canonical URL, WhatsApp
number, secondary number, contact person, price, and the map coordinates.

Prices and property details are in **`src/data/index.ts`**.

`index.html` duplicates a handful of these because crawlers read it before the
JavaScript bundle runs. `npm test` fails the build if those two drift apart —
that guard exists because the site once shipped two different domains at once.

---

## Assets

QR codes, the social share image, WebP conversions and `sitemap.xml` are all
generated locally:

```bash
npm run assets
```

This produces:

- `public/qr/whatsapp.png` and `public/qr/site.png` — generated with `qrcode`,
  so the site never depends on an external QR API being up.
- `public/og/og-image.jpg` — 1200x630 Open Graph image built with `sharp`.
- `public/posters/*.webp` and `*-sm.webp` — full-size and thumbnail variants.
- `public/robots.txt` and `public/sitemap.xml` — `lastmod` regenerated on every
  run so it cannot go stale.

The script then **fails the build** if any image the site references is
missing, or if a retired domain reappears anywhere in `dist/`.

---

## Optional configuration

Copy `.env.example` to `.env`. Neither variable is required.

| Variable | Effect when unset |
| --- | --- |
| `VITE_GA_MEASUREMENT_ID` | No analytics script loads; events still go to `dataLayer` |
| `VITE_FORMSPREE_ENDPOINT` | Lead form falls back to opening WhatsApp with the details prefilled |

---

## Analytics events

With a GA4 ID set, these are reported:

`whatsapp_click`, `call_click`, `directions_click`, `poster_download`,
`gallery_open`, `lead_submit`, `nav_click` — each tagged with a `source`
identifying which button was tapped, so you can see whether the hero CTA or
the floating button is actually producing calls.

---

## SEO

- Canonical URL, Open Graph and Twitter tags are set in `index.html` **and**
  re-asserted at runtime by `src/components/Seo.tsx`.
- JSON-LD is emitted as an `@graph`: `RealEstateAgent`, `Product` with price and
  availability, and `FAQPage`.
- `sitemap.xml` and `robots.txt` are generated on every build.
- Google Search Console verification is in `index.html` — do not remove it.

After deploying, submit `https://myfarmhouse.vercel.app/sitemap.xml` in Search
Console.

---

## Testing

53 tests across five files:

- `site-config.test.ts` — canonical domain is the only domain referenced.
- `data.test.ts` — property data integrity, and every referenced image exists.
- `lead-form-validation.test.ts` — Indian phone and email rules.
- `components.test.tsx` — mobile menu, FAQ accordion, lead form submission,
  and full-page structure (every nav target exists, no empty hrefs, QR codes
  are local).
- `repo-guardrails.test.ts` — walks the repo and fails if a retired domain, the
  old public QR API, or the placeholder Google Maps payload ever comes back.

---

## Deployment

Push to `main`; Vercel rebuilds automatically. `npm run build` runs on Vercel
too, so assets are regenerated and verified on every deploy. CI runs lint,
typecheck, tests and build on every pull request.