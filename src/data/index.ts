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
    price: 2100000,
    priceLabel: "₹21,00,000",
    plot: "121 sq.yards",
    house: "350 sq.ft",
    bhk: "1BHK",
    badge: "Most Popular",
    featured: true,
    highlights: [
      "HMDA approved layout",
      "2 years free maintenance",
      "Gated community with 24/7 security",
      "Swimming pool & club house access",
      "Registration & spot registration support",
      "Pattadar pass book ready",
    ],
    image: {
      full: "/posters/farmhouse.webp",
      small: "/posters/farmhouse-sm.webp",
      alt: "1BHK farmhouse exterior at Green Orchid Farm Land, Kothur",
    },
  },
  {
    id: "weekend-house",
    name: "Weekend House",
    price: 2100000,
    priceLabel: "₹21,00,000",
    plot: "121 sq.yards",
    house: "350 sq.ft",
    bhk: "1BHK",
    badge: "Was ₹24L",
    featured: false,
    highlights: [
      "Ideal for weekly family getaways",
      "HMDA approved layout",
      "Fruit plants with the plot",
      "30ft internal roads",
      "Gated and guarded",
      "Compound wall and arch entrance",
    ],
    image: {
      full: "/posters/weekend-houses.webp",
      small: "/posters/weekend-houses-sm.webp",
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
    full: "/posters/farmhouse.webp",
    small: "/posters/farmhouse-sm.webp",
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
];

export const legalDocs = [
  { icon: "✅", title: "HMDA Approved", detail: "Approved layout plan" },
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
    q: "Is the layout HMDA approved?",
    a: "Yes. The layout is HMDA approved, which means the plots carry clear title and can be registered through a sale deed with the MRO.",
  },
  {
    q: "What is included in the price?",
    a: "The 1BHK farmhouse unit at ₹21,00,000 includes a 121 sq.yards plot with a 350 sq.ft house, plus 2 years of free maintenance and access to the pool, club house and gated community amenities.",
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
];