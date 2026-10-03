# Campaign poster sources

The owner's hand-designed campaign posters. **Not published** — only the
processed copies in `public/generated/` are served, via the admin dashboard's
"Our Campaigns" downloads.

| Source | Published as | Shows |
|---|---|---|
| `dussehra-offer-source.png` | `public/generated/dussehra-offer.jpg` | Dussehra offer: ₹24,00,000, 121 sq.yards + 400 sq.ft 1BHK, silver idol, free furniture, free Sunday cab |
| `farmhouse-24-lakhs-source.jpeg` | `public/generated/farmhouse-24-lakhs.jpg` | ₹24 lakhs, Rangareddy district, gated, electricity & water, near highway and bus stop |

## ⚠️ These do not auto-update on a price change

The other posters in `public/generated/` (`farmhouse`, `weekend-houses`) are
drawn from code by `scripts/generate-posters.mjs`, so `npm run assets` rebuilds
them from the current price.

**These two cannot be.** The text is pixels in a design made by hand, so nothing
in the codebase can change the number inside them.

If the price ever changes, replace the source file here with an updated design,
convert it, and commit both:

```bash
node -e "
const sharp=require('sharp');
sharp('assets/campaign-posters/dussehra-offer-source.png')
  .rotate().resize(1200,null,{withoutEnlargement:true})
  .jpeg({quality:90,mozjpeg:true})
  .toFile('public/generated/dussehra-offer.jpg');
"
```

`npm run build` fails if either published file is missing, so a forgotten
replacement is caught at deploy time rather than shipping a stale price.