import { price } from "../config/site";

export interface Property {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  plot: string;
  house: string;
  bhk: string;
  badge?: string;
  featured: boolean;
  highlights: string[];
  image: { full: string; small: string; alt: string };
}

export interface NavItem {
  id: string;
  label: string;
}

/**
 * Site section order. Shared by the navbar, the mobile menu and the footer so
 * the three can never drift apart, and every entry must match a section id
 * rendered by App.tsx.
 */
export const navItems: NavItem[] = [
  { id: "properties", label: "Properties" },
  { id: "gallery", label: "Gallery" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const properties: Property[] = [
  {
    id: "1bhk-farmhouse",
    name: "1BHK Farmhouse",
    price: price.numeric,
    priceLabel: price.display,
    plot: "121 sq.yards",
    house: "400 sq.ft",
    bhk: "1BHK",
    badge: "Most Popular",
    featured: true,
    highlights: [
      "Approved layout plan",
      "2 years free maintenance",
      "Gated community with 24/7 security",
      "Swimming pool & club house access",
      "Registration & spot registration support",
      "Pattadar pass book ready",
    ],
    image: {
      full: "/generated/farmhouse.webp",
      small: "/generated/farmhouse-sm.webp",
      alt: "1BHK farmhouse exterior at Green Orchid Farm Land, Kothur",
    },
  },
  {
    id: "weekend-house",
    name: "Weekend House",
    price: price.numeric,
    priceLabel: price.display,
    plot: "121 sq.yards",
    house: "400 sq.ft",
    bhk: "1BHK",
    // No discount badge here on purpose. The old badge claimed the unit was
    // reduced from 24 lakhs, which stopped being true the moment 24 lakhs
    // became the asking price. Only re-add one for a price genuinely charged
    // before this one.
    badge: undefined,
    featured: false,
    highlights: [
      "Ideal for weekly family getaways",
      "Approved layout plan",
      "Fruit plants with the plot",
      "30ft internal roads",
      "Gated and guarded",
      "Compound wall and arch entrance",
    ],
    image: {
      full: "/generated/weekend-houses.webp",
      small: "/generated/weekend-houses-sm.webp",
      alt: "Weekend house plot at Green Orchid Farm Land near Kothur",
    },
  },
];

export const galleryImages = [
  {
    full: "/posters/clubhouse.webp",
    small: "/posters/clubhouse-sm.webp",
    alt: "Club house at Green Orchid Farm Land, Kothur",
    label: "🏛️ Club House",
  },
  {
    full: "/generated/farmhouse.webp",
    small: "/generated/farmhouse-sm.webp",
    alt: "Farmhouse at Green Orchid Farm Land, Kothur",
    label: "🏡 Farmhouse",
  },
  {
    full: "/posters/plot.webp",
    small: "/posters/plot-sm.webp",
    alt: "Open plot with fruit plants at Green Orchid Farm Land",
    label: "🌿 Plot",
  },
  {
    full: "/posters/bus.webp",
    small: "/posters/bus-sm.webp",
    alt: "Bus transport facility near Green Orchid Farm Land",
    label: "🚌 Transport",
  },
  {
    full: "/posters/layout.webp",
    small: "/posters/layout-sm.webp",
    alt: "Site layout plan of Green Orchid Farm Land",
    label: "🗺️ Layout Plan",
  },
];

export const amenities = [
  { icon: "🏊", name: "Swimming Pool" },
  { icon: "🏛️", name: "Club House" },
  { icon: "🏏", name: "Cricket Net" },
  { icon: "🛏️", name: "Visitor Rooms" },
  { icon: "🌳", name: "Fruit Plants" },
  { icon: "🛝", name: "Children Play Area" },
  { icon: "🧱", name: "Compound Wall" },
  { icon: "🚪", name: "Arch Entrance Gate" },
  { icon: "🛣️", name: "30ft Wide Roads" },
  { icon: "🔒", name: "24/7 Security" },
  { icon: "🏘️", name: "Gated Community" },
  { icon: "🌲", name: "Park Area" },
];

export const nearbyPlaces = [
  { icon: "🕌", place: "JP Dargah", distance: "1 km" },
  { icon: "💻", place: "Microsoft Data Center", distance: "2 km" },
  { icon: "🏙️", place: "Kothur Town", distance: "7 mins drive" },
  { icon: "✈️", place: "Shamshabad Airport", distance: "15 mins drive" },
  { icon: "🛣️", place: "ORR Exit 16", distance: "15 mins drive" },
  { icon: "🏢", place: "Gachibowli IT SEZ", distance: "30 mins drive" },
  { icon: "🏙️", place: "Hyderabad City", distance: "40 mins drive" },
];

/**
 * Current festive offer, shown on the site and editable from the dashboard.
 *
 * These are dated claims with real-world value attached - a free silver idol
 * and free furniture are promises, not decoration - so they live in data with
 * an explicit end date rather than being scattered through components.
 */
export const currentOffer = {
  title: "Dussehra Special Price",
  price: price.display,
  perks: [
    "100 gram Silver Idol on spot booking",
    "Free furniture on booking",
    "Free family site visit cab on Sundays",
    "121 sq.yards plot + 400 sq.ft 1BHK house",
  ],
  note: "Offer valid for limited bookings. Confirm availability on WhatsApp before you visit.",
} as const;

/**
 * Social proof. Both numbers are the owner's claims and are shown verbatim.
 */
export const trustBadges = [
  { value: "500+", label: "Happy Customers" },
  { value: "4 Years", label: "Of Trust" },
] as const;

/**
 * Ready-to-send WhatsApp broadcasts.
 *
 * These are pasted into WhatsApp by hand, not rendered on the site, so they are
 * stored as plain text and surfaced in the dashboard with a copy button. Kept
 * in data so the price inside them cannot drift from price.display - that
 * mismatch is invisible until a customer is quoted the wrong number.
 */
export const campaigns = [
  {
    id: "dussehra",
    label: "Dussehra Special Price",
    body: [
      "Good morning sir and madam 🙏",
      "*Festival Offer*",
      "",
      `✅ ${price.display}/- Dussehra Special Price`,
      "✅ 100 gram Silver Idol on spot booking",
      "✅ FREE Furniture on booking",
      "✅ FREE Family Site Visit Cab 🚗 - Sunday",
      "✅ 121 sq.yards + 400 sq.ft 1BHK House",
    ].join("\n"),
  },
  {
    id: "project-launch",
    label: "New Project Announcement",
    body: [
      "🌞 GOOD MORNING - BRIGHT CUSTOMERS!",
      "",
      "We at BRIGHT PROPERTIES are happy to present our latest project:",
      `🏡 BEAUTIFUL FARMHOUSE PROJECT @ JUST ${price.numeric / 100000} LAKHS`,
      "",
      "📍 Just 40 minutes drive from Hyderabad",
      "🎁 Farmhouse + Garden + Club House + Swimming Pool + Kids Play Area + Birthday Stage",
      "🏆 500+ Happy Customers - 4 Years of Trust",
      "",
      "For Free Site Visit Contact:",
      "📞 BRIGHT PROPERTIES - 9849754071",
      "9505903371 🤝",
    ].join("\n"),
  },
] as const;

export const legalDocs = [
  { icon: "✅", title: "Approved Layout", detail: "Sanctioned layout plan" },
  {
    icon: "📜",
    title: "Sale Deed with MRO",
    detail: "Registered sale deed",
  },
  {
    icon: "📍",
    title: "Spot Registration",
    detail: "Registration at site",
  },
  {
    icon: "📗",
    title: "Pattadar Pass Book",
    detail: "Ready to apply",
  },
];

export const faqs = [
  {
    q: "What is included in the price?",
    a: `The 1BHK farmhouse unit at ${price.display} includes a 121 sq.yards plot with a 400 sq.ft house, plus 2 years of free maintenance and access to the pool, club house and gated community amenities.`,
  },
  {
    q: "How far is it from Hyderabad airport?",
    a: "About 15 minutes from Shamshabad International Airport, and roughly 30 minutes from Gachibowli IT SEZ. It sits on Bangalore Highway NH-44 near JP Dargah.",
  },
  {
    q: "Can I pay in instalments?",
    a: "Bookings are handled directly with our sales team on WhatsApp or by phone. Call +91 95059 03371 and we will walk you through the available payment schedule.",
  },
  {
    q: "Is site visit allowed?",
    a: "Yes, site visits are available every day, and especially convenient on weekends. Message us on WhatsApp to fix a time and we will share the exact location.",
  },
  {
    q: "Is a free site visit cab available?",
    a: "Yes. We arrange a free family site visit cab on Sundays so you can visit the site together and see the layout, club house and pool in person before you book.",
  },
];