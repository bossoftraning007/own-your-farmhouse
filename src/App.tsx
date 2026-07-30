import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== PROPERTIES ====================
const properties: {
  id: number;
  title: string;
  location: string;
  price: string;
  type: string;
  poster: string;
  description: string;
  amenities: string[];
  mapUrl: string;
  agent: { name: string; phone: string; whatsapp: string };
}[] = [
  {
    id: 1,
    title: "Farmhouse Near Shamshabad Airport",
    location: "Near Shamshabad International Airport, Hyderabad",
    price: "₹21,00,000",
    type: "Farm House",
    poster: "/posters/property-1.jpg",
    description: "Own your dream farmhouse in a prime location near Shamshabad International Airport! Situated in a fast-developing area with excellent future value. Perfect for weekend getaways or long-term investment. Clear title with safe investment guarantee.",
    amenities: [
      "Prime Location",
      "Peaceful Environment",
      "Clear Title & Safe Investment",
      "Fast Development Area",
      "High Future Value",
      "Perfect for Weekend Stay",
      "Near JP Dargah",
      "Near City Bus Limits",
      "Near Microsoft Data Center",
      "Near International Airport"
    ],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.5!2d78.4294!3d17.2403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDE0JzI1LjEiTiA3OMKwMjUnNDUuOCJF!5e0!3m2!1sen!2sin!4v1700000000000",
    agent: {
      name: "R.Ganesh",
      phone: "+919849754071",
      whatsapp: "919849754071"
    }
  }
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

// ==================== PROPERTY CARD (POSTER STYLE) ====================
function PropertyCard({
  property,
  onClick,
  index,
}: {
  property: (typeof properties)[0];
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group cursor-pointer relative rounded-2xl overflow-hidden border-2 border-white/10 hover:border-amber-500/50 transition-all duration-500 shadow-2xl hover:shadow-amber-500/20"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-900">
        <img
          src={property.poster}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-amber-500 text-black px-6 py-3 rounded-full font-bold text-sm shadow-2xl">
            👁️ View Full Details
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded-full font-bold">
              {property.type}
            </span>
            <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full font-semibold">
              📞 Contact
            </span>
          </div>
        </div>

        <div className="absolute top-3 right-3">
          <span className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold animate-pulse shadow-lg">
            🔥 HOT DEAL
          </span>
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

        {/* Full poster image at top */}
        <div className="relative w-full bg-slate-900">
          <img
            src={property.poster}
            alt={property.title}
            className="w-full h-auto max-h-[600px] object-contain"
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Available
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

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">About This Property</h3>
            <p className="text-slate-400 leading-relaxed">{property.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
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
            <h3 className="text-lg font-semibold text-white mb-3">Location on Map</h3>
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
                  <QRCode url={`https://own-your-farmhouse.vercel.app`} size={160} />
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
              Own Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Dream Farmhouse
              </span>
              <br />
              in Hyderabad
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-lg mb-10 leading-relaxed">
              Premium farmhouses, plots & properties. 20+ years of trust.
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
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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