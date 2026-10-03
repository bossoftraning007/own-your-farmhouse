import { useEffect } from "react";
import {
  absoluteUrl,
  business,
  contacts,
  location,
  price,
  seo,
  SITE_URL,
} from "../config/site";
import { faqs } from "../data";

/**
 * index.html holds the tags Google reads on first crawl, but social scrapers
 * (WhatsApp, Facebook, X) share whatever is in the HTML. This component keeps
 * the head consistent at runtime so the canonical URL, title and share image
 * can never drift from the config module.
 */

const OG_IMAGE = seo.ogImage;

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export function Seo() {
  useEffect(() => {
    const title = seo.title;
    const description = seo.description;
    const image = absoluteUrl(OG_IMAGE);

    document.title = title;
    upsertCanonical(SITE_URL);

    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", SITE_URL);
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    upsertMeta('meta[property="og:image:width"]', "property", "og:image:width", "1200");
    upsertMeta('meta[property="og:image:height"]', "property", "og:image:height", "630");
    upsertMeta('meta[property="og:image:type"]', "property", "og:image:type", "image/jpeg");
    upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", seo.ogImageAlt);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", business.brand);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    upsertMeta('meta[name="twitter:image:alt"]', "name", "twitter:image:alt", seo.ogImageAlt);

    upsertStructuredData();
  }, []);

  return null;
}

function upsertStructuredData() {
  const scriptId = "ld-json-realestate";
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": `${SITE_URL}/#agent`,
        name: `${business.brand} - ${business.project}`,
        description: `${business.type} for sale near ${location.address}`,
        url: SITE_URL,
        telephone: `+${contacts.whatsapp}`,
        image: absoluteUrl(OG_IMAGE),
        priceRange: price.display,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Near JP Dargah, Bangalore Highway NH-44",
          addressLocality: "Kothur",
          addressRegion: location.region,
          postalCode: location.postalCode,
          addressCountry: location.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: location.latitude,
          longitude: location.longitude,
        },
        areaServed: [
          { "@type": "City", name: "Hyderabad" },
          { "@type": "AdministrativeArea", name: "Telangana" },
        ],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "19:00",
        },
      },
      {
        "@type": "Product",
        "@id": `${SITE_URL}/#product`,
        name: `${business.project} - ${business.type}`,
        image: absoluteUrl("/generated/farmhouse.jpg"),
        description: `HMDA approved 1BHK farmhouse on a 121 sq.yards plot with 350 sq.ft built-up area, in a gated community with swimming pool and club house.`,
        brand: { "@type": "Brand", name: business.brand },
        offers: {
          "@type": "Offer",
          price: String(price.numeric),
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: SITE_URL,
          seller: { "@id": `${SITE_URL}/#agent` },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        // Generated from the visible FAQ data so every question on the page is
        // eligible for a rich result. This used to be a hand-copied subset,
        // which meant most questions were silently ineligible and the copy
        // could drift from what visitors actually read.
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = scriptId;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}