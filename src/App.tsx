import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// 🏡 OWN YOUR FARMHOUSE — Green Orchid Farm Land
// Built by: Student Dev for Dad's Business 💚
// ============================================

// ---------- TYPE DEFINITIONS ----------
interface Property {
  id: number;
  name: string;
  price: string;
  plot: string;
  house: string;
  bhk: string;
  emoji: string;
  features: string[];
}

interface GalleryImage {
  src: string;
  alt: string;
  label: string;
}

interface Amenity {
  icon: string;
  name: string;
}

interface NearbyPlace {
  icon: string;
  place: string;
  distance: string;
}

// ---------- DATA ----------
const properties: Property[] = [
  {
    id: 1,
    name: "1BHK Farmhouse",
    price: "₹21,00,000",
    plot: "121 sq.yards",
    house: "350 sq.ft",
    bhk: "1BHK",
    emoji: "🏠",
    features: [
      "HMDA Approved",
      "2 Year Free Maintenance",
      "Gated Community",
      "Swimming Pool & Club House",
    ],
  },
];

const galleryImages: GalleryImage[] = [
  {
    src: "/posters/farmhouse.jpeg",
    alt: "Farmhouse View",
    label: "🏡 Farmhouse",
  },
  {
    src: "/posters/bus.jpg.jpeg",
    alt: "Bus Facility",
    label: "🚌 Transport",
  },
  {
    src: "/posters/clubhouse.jpg.jpeg",
    alt: "Club House",
    label: "🏊 Club House",
  },
  {
    src: "/posters/layout.jpg.png",
    alt: "Layout Plan",
    label: "🗺️ Layout",
  },
  {
    src: "/posters/plot.jpg.jpeg",
    alt: "Plot View",
    label: "🌿 Plot",
  },
];

const amenities: Amenity[] = [
  { icon: "🏊", name: "Swimming Pool" },
  { icon: "🏠", name: "Club House" },
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

const nearbyPlaces: NearbyPlace[] = [
  { icon: "🕌", place: "JP Dargah", distance: "1 km" },
  { icon: "💻", place: "Microsoft Data Center", distance: "2 km" },
  { icon: "🏙️", place: "Kothur Town", distance: "7 mins drive" },
  { icon: "✈️", place: "Shamshabad Airport", distance: "15 mins drive" },
  { icon: "🛣️", place: "ORR Exit 16", distance: "15 mins drive" },
  { icon: "🏢", place: "Gachibowli IT SEZ", distance: "30 mins drive" },
];

const legalDocs: string[] = [
  "✅ HMDA Approved",
  "📜 Sale Deed with MRO",
  "📍 Spot Registration",
  "📗 Telangana Pattadar Pass Book",
];

// ---------- MAIN APP ----------
export default function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const propertiesRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openLightbox = (index: number) => {
    setActiveImage(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = () =>
    setActiveImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );

  const nextImage = () =>
    setActiveImage((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );

  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-emerald-400 font-bold text-sm leading-none">
                OWN YOUR FARMHOUSE
              </p>
              <p className="text-slate-400 text-xs">Bright Properties</p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <button
              onClick={() => scrollToSection(propertiesRef)}
              className="hover:text-emerald-400 transition-colors"
            >
              Properties
            </button>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="hover:text-emerald-400 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/919505903371"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all flex items-center gap-2"
          >
            <span>💬</span>
            <span className="hidden sm:inline">WhatsApp Us</span>
          </a>

        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/posters/clubhouse.jpg.jpeg')" }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-slate-950/70" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm px-4 py-1 rounded-full mb-6">
              🌿 HMDA Approved — Near Kothur, Hyderabad
            </span>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Green Orchid{" "}
              <span className="text-emerald-400">Farm Land</span>
            </h1>

            <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Your dream farmhouse awaits 🏡 — Gated community with swimming
              pool & club house on Bangalore Highway NH-44
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(propertiesRef)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-3 rounded-full transition-all"
              >
                🏠 View Properties
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/919505903371"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 font-bold px-8 py-3 rounded-full transition-all"
              >
                💬 Chat on WhatsApp
              </motion.a>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { label: "Total Units", value: "72" },
                { label: "Total Acres", value: "5.5" },
                { label: "Maintenance", value: "2 Yrs Free" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3"
                >
                  <p className="text-emerald-400 font-bold text-xl">
                    {stat.value}
                  </p>
                  <p className="text-slate-300 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>

          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 text-2xl"
        >
          ↓
        </motion.div>

      </section>

      {/* ===== PROPERTIES SECTION ===== */}
      <section ref={propertiesRef} className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            🏠 Our <span className="text-emerald-400">Property</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            HMDA Approved farmhouse — your perfect investment! 🌿
          </p>
        </motion.div>

        {/* Single card centered */}
        <div className="flex justify-center">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-slate-900 border border-emerald-900/40 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all w-full max-w-md"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 p-6 text-center">
                <span className="text-6xl">{property.emoji}</span>
                <h3 className="text-xl font-bold text-white mt-3">
                  {property.name}
                </h3>
                <p className="text-3xl font-bold text-emerald-400 mt-2">
                  {property.price}
                </p>
              </div>

              {/* Card Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-slate-400 text-xs">Plot Size</p>
                    <p className="text-white font-semibold text-sm">
                      {property.plot}
                    </p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-3 text-center">
                    <p className="text-slate-400 text-xs">House Size</p>
                    <p className="text-white font-semibold text-sm">
                      {property.house}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {property.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-slate-300 text-sm"
                    >
                      <span className="text-emerald-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/919505903371"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 rounded-xl transition-all"
                >
                  💬 Enquire Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            📸 <span className="text-emerald-400">Gallery</span>
          </h2>
          <p className="text-slate-400">
            Click any image to view it bigger! 🔍
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => openLightbox(index)}
              className="relative cursor-pointer rounded-2xl overflow-hidden border border-emerald-900/40 hover:border-emerald-500/50 transition-all"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 md:h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-white font-medium text-sm">
                  {image.label}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-slate-950/40">
                <span className="text-white text-3xl">🔍</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[activeImage].src}
                alt={galleryImages[activeImage].alt}
                className="w-full max-h-[80vh] object-contain rounded-2xl"
              />

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl"
              >
                ✕
              </button>

              {/* Prev Button */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-emerald-700 text-white w-10 h-10 rounded-full flex items-center justify-center"
              >
                ←
              </button>

              {/* Next Button */}
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-emerald-700 text-white w-10 h-10 rounded-full flex items-center justify-center"
              >
                →
              </button>

              {/* Image Label */}
              <p className="text-center text-slate-300 mt-4 text-sm">
                {galleryImages[activeImage].label} — {activeImage + 1} /{" "}
                {galleryImages.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== AMENITIES SECTION ===== */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              ✨ World-Class{" "}
              <span className="text-emerald-400">Amenities</span>
            </h2>
            <p className="text-slate-400">
              Everything you need for the perfect farmhouse life!
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ scale: 1.05 }}
                className="bg-slate-900 border border-emerald-900/40 rounded-2xl p-5 text-center hover:border-emerald-500/50 transition-all"
              >
                <span className="text-4xl block mb-3">{amenity.icon}</span>
                <p className="text-white font-medium text-sm">{amenity.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION SECTION ===== */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            📍 Prime <span className="text-emerald-400">Location</span>
          </h2>
          <p className="text-slate-400">
            Near Kothur, JP Dargah, Bangalore Highway NH-44, Hyderabad
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Nearby Places */}
          <div className="grid grid-cols-1 gap-3">
            {nearbyPlaces.map((place, index) => (
              <motion.div
                key={place.place}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900 border border-emerald-900/40 rounded-xl p-4 flex items-center justify-between hover:border-emerald-500/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{place.icon}</span>
                  <span className="text-white font-medium">{place.place}</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-sm px-3 py-1 rounded-full">
                  {place.distance}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Google Maps */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-emerald-900/40 min-h-[300px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30455.955851817747!2d78.08!3d17.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDA0JzQ4LjAiTiA3OMKwMDQnNDguMCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ minHeight: "300px", border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Green Orchid Farm Land Location"
            />
          </motion.div>

        </div>
      </section>

      {/* ===== LEGAL DOCUMENTATION SECTION ===== */}
      <section className="py-16 px-4 bg-emerald-950/20 border-y border-emerald-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              📜 Legal <span className="text-emerald-400">Documentation</span>
            </h2>
            <p className="text-slate-400">
              100% legal, transparent, and safe investment! 🛡️
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {legalDocs.map((doc, index) => (
              <motion.div
                key={doc}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 text-center"
              >
                <p className="text-white font-medium text-sm">{doc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section ref={contactRef} className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🤝 Ready to Own Your{" "}
              <span className="text-emerald-400">Farmhouse?</span>
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Contact us today! Site visits available on weekends. 🗓️
            </p>

            {/* Contact Card */}
            <div className="bg-slate-900 border border-emerald-900/40 rounded-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">

                {/* Contact Details */}
                <div className="text-left space-y-4">
                  <div>
                    <p className="text-slate-400 text-sm">Contact Person</p>
                    <p className="text-white font-bold text-lg">
                      R. Ganesh (Marketing Director)
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">WhatsApp / Call</p>
                    <a
                      href="tel:+919505903371"
                      className="text-emerald-400 font-bold text-xl hover:text-emerald-300 transition-colors"
                    >
                      +91 9505903371
                    </a>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Property Inquiries</p>
                    <a
                      href="tel:+919849754071"
                      className="text-emerald-400 font-bold text-lg hover:text-emerald-300 transition-colors"
                    >
                      +91 9849754071
                    </a>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Location</p>
                    <p className="text-white text-sm">
                      Near Kothur, JP Dargah
                      <br />
                      Bangalore Highway NH-44
                      <br />
                      Hyderabad
                    </p>
                  </div>
                </div>

                {/* ✅ REAL QR CODE */}
                <div className="bg-slate-800 border border-emerald-900/40 rounded-2xl p-6 text-center">
                  <div className="w-36 h-36 bg-white rounded-xl flex items-center justify-center mb-3 p-2">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https://wa.me/919505903371"
                      alt="WhatsApp QR Code"
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                  <p className="text-slate-400 text-xs">📱 Scan to WhatsApp Us</p>
                  <p className="text-emerald-400 text-xs font-bold mt-1">
                    +91 9505903371
                  </p>
                </div>

              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/919505903371"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-full text-lg transition-all flex items-center justify-center gap-2"
              >
                <span>💬</span> WhatsApp Now
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:+919505903371"
                className="border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 font-bold px-8 py-4 rounded-full text-lg transition-all flex items-center justify-center gap-2"
              >
                <span>📞</span> Call Now
              </motion.a>
            </div>

          </motion.div>
        </div>
      </section>
      {/* ========== SHAREABLE POSTER SECTION ========== */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-3">📱 Share With Anyone</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Share This Poster
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-2">
              Screenshot & share on WhatsApp, Instagram, Facebook
            </p>
            <p className="text-emerald-400 text-sm">
              📸 Right-click below → Save Image
            </p>
          </motion.div>

          {/* THE BEAUTIFUL POSTER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-md bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/30 border-2 border-emerald-500/30"
          >
            {/* Decorative top pattern */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-400" />

            {/* Header with Logo */}
            <div className="pt-8 pb-4 px-6 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="text-4xl">🌿</span>
                <div className="text-left">
                  <p className="text-emerald-400 text-xs tracking-widest font-bold">BRIGHT PROPERTIES</p>
                  <p className="text-white text-xl font-black tracking-tight">GREEN ORCHID</p>
                </div>
              </div>
              <div className="inline-block px-4 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full uppercase tracking-wider">
                🎪 HMDA Approved
              </div>
            </div>

            {/* Main Image */}
            <div className="relative mx-4 rounded-2xl overflow-hidden border-2 border-emerald-500/30">
              <img 
                src="/posters/clubhouse.jpg.jpeg" 
                alt="Green Orchid Farm Land"
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-2xl font-black leading-tight drop-shadow-lg">
                  YOUR DREAM
                </p>
                <p className="text-emerald-400 text-3xl font-black leading-tight drop-shadow-lg">
                  FARMHOUSE
                </p>
              </div>
            </div>

            {/* Price Section */}
            <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-center">
              <p className="text-yellow-300 text-xs font-bold tracking-wider uppercase mb-1">💫 Special Price</p>
              <p className="text-white text-3xl font-black">₹21,00,000</p>
              <p className="text-white/80 text-xs">1BHK Farmhouse • 121 sq.yards</p>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-2 mx-4 mt-4">
              <div className="bg-white/5 border border-emerald-500/20 rounded-lg p-2.5 text-center">
                <div className="text-2xl mb-1">🏊</div>
                <p className="text-white text-xs font-semibold">Swimming Pool</p>
              </div>
              <div className="bg-white/5 border border-emerald-500/20 rounded-lg p-2.5 text-center">
                <div className="text-2xl mb-1">🏛️</div>
                <p className="text-white text-xs font-semibold">Club House</p>
              </div>
              <div className="bg-white/5 border border-emerald-500/20 rounded-lg p-2.5 text-center">
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-white text-xs font-semibold">24/7 Security</p>
              </div>
              <div className="bg-white/5 border border-emerald-500/20 rounded-lg p-2.5 text-center">
                <div className="text-2xl mb-1">🌳</div>
                <p className="text-white text-xs font-semibold">Fruit Plants</p>
              </div>
            </div>

            {/* Location Highlights */}
            <div className="mx-4 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 text-center">📍 Prime Location</p>
              <div className="space-y-1 text-white text-xs">
                <p>✈️ 15 mins from <span className="text-emerald-400 font-bold">Shamshabad Airport</span></p>
                <p>💻 2 km from <span className="text-emerald-400 font-bold">Microsoft Data Center</span></p>
                <p>🏢 30 mins from <span className="text-emerald-400 font-bold">Gachibowli IT</span></p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="mx-4 mt-4 p-4 bg-white rounded-xl">
              <div className="flex items-center gap-3">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://own-your-farmhouse.vercel.app&bgcolor=ffffff&color=000000&format=svg"
                  alt="Scan QR Code"
                  width={100}
                  height={100}
                  className="rounded-lg border-2 border-emerald-500"
                />
                <div className="flex-1">
                  <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1">📱 Scan to Visit</p>
                  <p className="text-slate-800 text-sm font-black leading-tight">
                    own-your-farmhouse.vercel.app
                  </p>
                  <p className="text-slate-600 text-xs mt-1">See details, photos & book visit</p>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mx-4 mt-4 mb-4 p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl">
              <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider text-center mb-2">📞 Contact Now</p>
              <p className="text-white text-center text-lg font-black mb-2">R. GANESH</p>
              <div className="flex items-center justify-center gap-2 text-white">
                <span className="text-2xl">📱</span>
                <span className="text-xl font-bold">+91 9505903371</span>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="bg-yellow-500 py-2.5 text-center">
              <p className="text-black font-black text-sm tracking-wide">
                🌟 INVEST • RELAX • ENJOY • GROW 🌟
              </p>
            </div>
          </motion.div>

          {/* Action Buttons Below Poster */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <a
              href={`https://wa.me/?text=Check%20out%20this%20amazing%20farmhouse!%20🏡%0A%0A🌿%20Green%20Orchid%20Farm%20Land%0A📍%20Near%20Kothur,%20Hyderabad%0A💰%20Starting%20₹21%20Lakhs%0A%0AView%20details:%20https://own-your-farmhouse.vercel.app`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
            >
              💬 Share on WhatsApp
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText("https://own-your-farmhouse.vercel.app");
                alert("Link copied! Share it anywhere 🎉");
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold transition-all hover:scale-105 border border-white/20"
            >
              📋 Copy Link
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-emerald-400 font-bold text-lg mb-3">💡 How to Share This Poster:</h3>
            <div className="space-y-2 text-slate-300 text-sm">
              <p>📸 <strong>Screenshot</strong> the poster above</p>
              <p>💬 <strong>Share</strong> on WhatsApp Status, Instagram Story, Facebook</p>
              <p>🖨️ <strong>Print</strong> and stick at shops, tea stalls, notice boards</p>
              <p>📱 <strong>QR code</strong> - people scan it → opens your website instantly!</p>
              <p>🎁 <strong>Tip:</strong> Share in 5 WhatsApp groups daily = 500+ views/day FREE!</p>
            </div>
          </div>
        </div>
      </section>
      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 border-t border-emerald-900/30 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Brand */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span className="text-2xl">🌿</span>
                <p className="text-emerald-400 font-bold">OWN YOUR FARMHOUSE</p>
              </div>
              <p className="text-slate-500 text-sm">Bright Properties</p>
              <p className="text-slate-500 text-xs mt-1">
                Green Orchid Farm Land — HMDA Approved
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex gap-6 text-sm text-slate-400">
              <button
                onClick={() => scrollToSection(propertiesRef)}
                className="hover:text-emerald-400 transition-colors"
              >
                Properties
              </button>
              <button
                onClick={() => scrollToSection(contactRef)}
                className="hover:text-emerald-400 transition-colors"
              >
                Contact
              </button>
              <a
                href="https://wa.me/919505903371"
                className="hover:text-emerald-400 transition-colors"
              >
                WhatsApp
              </a>
            </div>

            {/* Copyright */}
            <p className="text-slate-600 text-xs text-center">
              © 2024 Bright Properties. All rights reserved.
            </p>

          </div>
        </div>
      </footer>

      {/* ===== FLOATING BUTTONS ===== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">

        {/* WhatsApp Float */}
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href="https://wa.me/919505903371"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-400 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-emerald-900/50"
          title="WhatsApp Us"
        >
          💬
        </motion.a>

        {/* Call Float */}
        <motion.a
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          href="tel:+919505903371"
          className="bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-blue-900/50"
          title="Call Us"
        >
          📞
        </motion.a>

      </div>

    </div>
  );
}