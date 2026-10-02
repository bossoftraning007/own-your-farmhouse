import { useEffect } from "react";
import { absoluteUrl, business, contacts, location, SITE_URL } from "../config/site";

/**
 * index.html holds the tags Google reads on first crawl, but social scrapers
 * (WhatsApp, Facebook, X) share whatever is in the HTML. This component keeps
 * the head consistent at runtime so the canonical URL, title and share image
 * can never drift from the config module.
 */

const OG_IMAGE = "/og/og-image.jpg";

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
    const title = `${business.project} | ${business.type} Near Kothur Hyderabad | HMDA Approved ${business.price}`;
    const description = `Buy HMDA approved 1BHK farmhouse near Kothur on Bangalore Highway NH-44, Hyderabad. Starting ${business.price}. Swimming pool, club house, gated community, 15 mins from Shamshabad Airport. Call ${contacts.whatsappDisplay}.`;
    const image = absoluteUrl(OG_IMAGE);

    document.title = title;
    upsertCanonical(SITE_URL);

    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", SITE_URL);
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", business.brand);
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);

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
        priceRange: business.price,
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
        image: absoluteUrl("/posters/farmhouse.jpeg"),
        description: `HMDA approved 1BHK farmhouse on a 121 sq.yards plot with 350 sq.ft built-up area, in a gated community with swimming pool and club house.`,
        brand: { "@type": "Brand", name: business.brand },
        offers: {
          "@type": "Offer",
          price: "2100000",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: SITE_URL,
          seller: { "@id": `${SITE_URL}/#agent` },
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Is the layout HMDA approved?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The layout is HMDA approved with a registered sale deed, so the plots can be registered through the MRO.",
            },
          },
          {
            "@type": "Question",
            name: "How far is the site from Hyderabad airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "About 15 minutes from Shamshabad International Airport and roughly 30 minutes from Gachibowli IT SEZ.",
            },
          },
          {
            "@type": "Question",
            name: "Are site visits available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, site visits are available every day, with extra availability on weekends. Message on WhatsApp to fix a time.",
            },
          },
        ],
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