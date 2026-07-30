import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== PROPERTIES (EMPTY - Add real ones here) ====================
const properties: {
  id: number;
  title: string;
  location: string;
  price: string;
  type: string;
  beds: number;
  baths: number;
  sqft: string;
  status: string;
  description: string;
  amenities: string[];
  images: string[];
  mapUrl: string;
  agent: { name: string; phone: string; whatsapp: string };
}[] = [
  // 👉 Add your real properties here later
];

const filterTypes = ["All", "Villa", "Apartment", "Plot", "Penthouse", "Farm House", "Commercial"];

// ==================== QR CODE ====================
function QRCode({ url, size = 150 }: { url: string; size?: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=0f172a&color=ffffff&format=svg`}
        alt="QR Code"
        width={size}
        height={size}
        className="rounded-xl border-2 border-white/10"
      />
      <p className="text-xs text-slate-400">Scan to view property</p>
    </div>
  );
}

// ==================== PROPERTY CARD ====================
function PropertyCard({
  property,
  onClick,
  index,
}: {
  property: (typeof properties)[0];
  onClick: () => void;
  index: number;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const [isImgHovered, setIsImgHovered] = useState(false);

  useEffect(() => {
    if (!isImgHovered) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % property.images.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isImgHovered, property.images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-500"
      onClick={onClick}
    >
      <div
        className="relative h-56 overflow-hidden"
        onMouseEnter={() => setIsImgHovered(true)}
        onMouseLeave={() => {
          setIsImgHovered(false);
          setImgIndex(0);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIndex}
            src={property.images[imgIndex]}
            alt={property.title}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
              property.status === "Ready to Move"
                ? "bg-emerald-500/90 text-white"
                : property.status === "Under Construction"
                ? "bg-amber-500/90 text-black"
                : "bg-blue-500/90 text-white"
            }`}
          >
            {property.status}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-black/50 backdrop-blur-sm text-white/80 border border-white/10">
            {property.type}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <p className="text-2xl font-bold text-white drop-shadow-lg">{property.price}</p>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-amber-400 transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-4">
          <span className="truncate">📍 {property.location}</span>
        </div>

        <div className="flex items-center gap-4 text-sm flex-wrap">
          {property.beds > 0 && (
            <span className="text-slate-300">🛏️ {property.beds} Beds</span>
          )}
          {property.baths > 0 && (
            <span className="text-slate-300">🚿 {property.baths} Baths</span>
          )}
          <span className="text-slate-300">📐 {property.sqft} sqft</span>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== PROPERTY DETAIL MODAL ====================
function PropertyDetail({
  property,
  onClose,
}: {
  property: (typeof properties)[0];
  onClose: () => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [showQR, setShowQR] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative z-10 w-full max-w-4xl mx-4 my-8 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-white/10 overflow-hidden"
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all border border-white/10"
        >
          ✕
        </button>

        <div className="relative h-72 sm:h-96">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImg}
              src={property.images[activeImg]}
              alt={property.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 flex gap-2">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === activeImg ? "border-amber-500 scale-105" : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {property.status}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-white/5 text-white/60 border border-white/10">
                  {property.type}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{property.title}</h2>
              <div className="text-slate-400">📍 {property.location}</div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-400">{property.price}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06] mb-6">
            {property.beds > 0 && (
              <div>
                <p className="text-white font-semibold">🛏️ {property.beds}</p>
                <p className="text-slate-500 text-xs">Bedrooms</p>
              </div>
            )}
            {property.baths > 0 && (
              <div>
                <p className="text-white font-semibold">🚿 {property.baths}</p>
                <p className="text-slate-500 text-xs">Bathrooms</p>
              </div>
            )}
            <div>
              <p className="text-white font-semibold">📐 {property.sqft}</p>
              <p className="text-slate-500 text-xs">Sq. Ft.</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">About This Property</h3>
            <p className="text-slate-400 leading-relaxed">{property.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-slate-300"
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
            <div className="rounded-xl overflow-hidden border border-white/10 h-64">
              <iframe
                src={property.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-white mb-1">Contact Agent</h3>
              <p className="text-slate-400 text-sm mb-2">{property.agent.name}</p>
              <a
                href={`tel:${property.agent.phone}`}
                className="flex items-center justify-center gap-3 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-semibold transition-all"
              >
                📞 Call Now
              </a>
              <a
                href={`https://wa.me/${property.agent.whatsapp}?text=Hi, I'm interested in ${property.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all"
              >
                💬 WhatsApp
              </a>
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center justify-center gap-3 px-5 py-3 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl font-semibold border border-white/10 transition-all"
              >
                {showQR ? "Hide" : "Show"} QR Code
              </button>
            </div>

            <AnimatePresence>
              {showQR && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center p-6 bg-slate-800/50 rounded-xl border border-white/10"
                >
                  <QRCode url={`https://yoursite.com/property/${property.id}`} size={160} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [selectedProperty, setSelectedProperty] = useState<(typeof properties)[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const propertiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = selectedProperty ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedProperty]);

  const filtered = properties.filter((p) => {
    const matchesFilter = activeFilter === "All" || p.type === activeFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const scrollToProperties = () => {
    propertiesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center font-bold text-black text-lg">
              R
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight">OWN YOUR FARMHOUSE</span>
            </div>
          </div>
          <a
            href="https://wa.me/919505903371"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 rounded-full font-medium transition-all"
          >
            💬 WhatsApp
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt="Luxury Property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm mb-8">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              Trusted Since 2005
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
              Find Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Dream Property
              </span>
              <br />
              in Hyderabad
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-lg mb-10 leading-relaxed">
              Premium villas, apartments, plots & commercial spaces. 20+ years of trust.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToProperties}
                className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded-full font-semibold text-base transition-all hover:scale-105"
              >
                View Properties →
              </button>
              <a
                href="tel:+919505903371"
                className="px-7 py-3.5 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-full font-semibold text-base border border-white/10 transition-all hover:scale-105"
              >
                📞 Call Us
              </a>
            </div>

            <div className="flex flex-wrap gap-8 sm:gap-12 mt-16 pt-8 border-t border-white/[0.06]">
              {[
                { value: "500+", label: "Properties Sold" },
                { value: "20+", label: "Years Experience" },
                { value: "98%", label: "Happy Clients" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-amber-400">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROPERTIES */}
      <section ref={propertiesRef} className="relative py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-sm tracking-[0.2em] uppercase mb-4">Our Portfolio</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Featured Properties
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Handpicked premium properties across Hyderabad.
            </p>
          </div>

          {properties.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="🔍 Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/40 transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filterTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveFilter(type)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeFilter === type
                        ? "bg-amber-500 text-black"
                        : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.06]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state OR property grid */}
          {properties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-20 px-6 bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.06] border-dashed rounded-3xl"
            >
              <div className="text-6xl mb-6">🏗️</div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Properties Coming Soon
              </h3>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                We're curating a premium collection of properties. Contact us directly for exclusive early access.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="tel:+919505903371"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-full font-semibold transition-all hover:scale-105"
                >
                  📞 Call Now
                </a>
                <a
                  href="https://wa.me/919505903371?text=Hi, I want to know about your properties"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-semibold transition-all hover:scale-105"
                >
                  💬 WhatsApp Us
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((property, i) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  index={i}
                  onClick={() => setSelectedProperty(property)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            © 2025 OWN YOUR FARMHOUSE. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Hyderabad, Telangana • +91 9505903371
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Contact: R.Ganesh
          </p>
        </div>
      </footer>

      <AnimatePresence>
        {selectedProperty && (
          <PropertyDetail
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}