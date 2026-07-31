import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== PROJECT DATA ====================
const project = {
  name: "Green Orchid Farm Land",
  developer: "Bright Properties",
  location: "Near Kothur, JP Dargah, Bangalore Highway NH-44",
  poster: "/posters/farmhouse.jpeg",
  gallery: [
    "/posters/farmhouse.jpeg",
    "/posters/layout.jpg",
    "/posters/clubhouse.jpg",
    "/posters/plot.jpg",
    "/posters/bus.jpg",
  ],
  agent: {
    name: "R. Ganesh",
    designation: "Marketing Director",
    company: "Bright Properties",
    phone: "+919505903371",
    whatsapp: "919505903371"
  }
};

const propertyOptions = [
  {
    id: 1,
    title: "1BHK Farmhouse",
    price: "₹21,00,000",
    plotSize: "121 sq.yards",
    houseSize: "350 sq.ft",
    poster: "/posters/farmhouse.jpeg",
    highlight: "🔥 BEST DEAL",
    highlightColor: "bg-amber-500"
  },
  {
    id: 2,
    title: "2BHK Villa Farmhouse",
    price: "₹35,00,000",
    plotSize: "242 sq.yards",
    houseSize: "350 sq.ft",
    poster: "/posters/clubhouse.jpg",
    highlight: "💎 PREMIUM",
    highlightColor: "bg-emerald-500"
  }
];

const amenities = [
  { icon: "🏊", name: "Swimming Pool" },
  { icon: "🏛️", name: "Club House" },
  { icon: "🏏", name: "Cricket Net" },
  { icon: "🎪", name: "Visitor Rooms" },
  { icon: "🌳", name: "Fruit Plants" },
  { icon: "🎨", name: "Children Play Area" },
  { icon: "🚧", name: "Compound Wall" },
  { icon: "🚪", name: "Arch Entrance Gate" },
  { icon: "🛣️", name: "30 Feet Roads" },
  { icon: "🔒", name: "24/7 Security" },
  { icon: "🏘️", name: "Gated Community" },
  { icon: "🌿", name: "Park Area" }
];

const furniture = [
  "🛏️ Bed", "🌀 Fans", "🍽️ Dining Table", "📺 LED TV",
  "❄️ Fridge", "🔥 Barbecue", "🛋️ Sofa Set", "🪑 4 Chairs"
];

const locationHighlights = [
  { icon: "🕌", place: "JP Dargah", distance: "1 km" },
  { icon: "💻", place: "Microsoft Data Center", distance: "2 km" },
  { icon: "🏘️", place: "Kothur Town", distance: "7 mins drive" },
  { icon: "✈️", place: "Shamshabad Airport", distance: "15 mins drive" },
  { icon: "🛣️", place: "ORR Exit 16", distance: "15 mins drive" },
  { icon: "🏢", place: "Gachibowli IT SEZ", distance: "30 mins drive" }
];

const legalPoints = [
  "✅ HMDA Approved Layout",
  "✅ Sale Deed with MRO",
  "✅ Spot Registration Available",
  "✅ Telangana Government Pattadar Pass Book",
  "✅ Clear Title & Safe Investment",
  "✅ 2 Years FREE Maintenance"
];

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
      <p className="text-xs text-slate-400">Scan to visit site</p>
    </div>
  );
}

// ==================== LIGHTBOX ====================
function Lightbox({ images, startIndex, onClose }: { images: string[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex);
  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl">✕</button>
      <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl">‹</button>
      <img src={images[index]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
      <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl">›</button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">{index + 1} / {images.length}</div>
    </motion.div>
  );
}

// ==================== FLOATING BUTTONS ====================
function FloatingButtons() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${project.agent.whatsapp}?text=Hi, I'm interested in Green Orchid Farm Land`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
      >
        <span className="text-2xl">💬</span>
      </a>
      <a
        href={`tel:${project.agent.phone}`}
        className="w-14 h-14 bg-amber-500 hover:bg-amber-400 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
      >
        <span className="text-2xl">📞</span>
      </a>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);
  const propertiesRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center font-bold text-white text-lg">
              🌿
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight block leading-tight">GREEN ORCHID</span>
              <span className="text-[10px] sm:text-xs text-emerald-400 tracking-wider">FARM LAND</span>
            </div>
          </div>
          <a
            href={`https://wa.me/${project.agent.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-5 py-2 text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 rounded-full font-medium transition-all"
          >
            💬 <span className="hidden sm:inline">Enquire Now</span>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/posters/clubhouse.jpg" alt="Green Orchid" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs sm:text-sm mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              HMDA APPROVED • 72 UNITS • 5.5 ACRES
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-4">
              Green Orchid
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500">
                Farm Land
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mb-3 leading-relaxed">
              Own your weekend farmhouse near Kothur, just minutes from Shamshabad Airport & IT Hub.
            </p>
            <p className="text-emerald-400 font-semibold text-lg mb-8">
              🎪 OFFER: Starting from ₹21 Lakhs Only! 🎪
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => scrollTo(propertiesRef)}
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-semibold text-sm sm:text-base transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
              >
                View Farmhouses →
              </button>
              <a
                href={`tel:${project.agent.phone}`}
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold text-sm sm:text-base border border-white/20 transition-all hover:scale-105"
              >
                📞 Call {project.agent.name}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 pt-8 border-t border-white/10">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400">5.5</p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Acres</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400">72</p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Units</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400">2 Yr</p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Free Maintenance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROPERTIES */}
      <section ref={propertiesRef} className="relative py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-3">Choose Your Home</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Available Farmhouses</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Fully furnished farmhouses with premium amenities.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {propertyOptions.map((prop, i) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl overflow-hidden border-2 border-white/10 hover:border-emerald-500/50 transition-all shadow-2xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                  <img src={prop.poster} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <span className={`${prop.highlightColor} text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg`}>
                      {prop.highlight}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{prop.title}</h3>
                    <p className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-4">{prop.price}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/20">
                        📐 {prop.plotSize}
                      </span>
                      <span className="text-xs bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/20">
                        🏠 {prop.houseSize}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a href={`tel:${project.agent.phone}`} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white text-center py-2.5 rounded-full font-semibold text-sm transition-all">
                        📞 Call
                      </a>
                      <a href={`https://wa.me/${project.agent.whatsapp}?text=Hi, interested in ${prop.title}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-center py-2.5 rounded-full font-semibold text-sm transition-all">
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-emerald-400">✨ Fully Furnished — Included with Every Farmhouse</h3>
            <div className="flex flex-wrap gap-2">
              {furniture.map((item) => (
                <span key={item} className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm">{item}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-3">Project Gallery</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">See Green Orchid In Real</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Tap any photo to view in full screen</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {project.gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightboxIndex(i)}
                className={`relative overflow-hidden rounded-xl cursor-pointer border border-white/10 hover:border-emerald-500/50 transition-all ${
                  i === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-3">World Class Amenities</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Everything You Need</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {amenities.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 sm:p-5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
              >
                <div className="text-3xl mb-2">{a.icon}</div>
                <p className="text-sm sm:text-base font-medium">{a.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-3">Prime Location</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Everything Nearby</h2>
            <p className="text-slate-400 max-w-xl mx-auto">📍 Shamshabad to Kothur, Bangalore Highway NH-44</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {locationHighlights.map((loc, i) => (
              <motion.div
                key={loc.place}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl flex items-center gap-4"
              >
                <div className="text-4xl">{loc.icon}</div>
                <div>
                  <p className="font-semibold text-white">{loc.place}</p>
                  <p className="text-emerald-400 text-sm">{loc.distance}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10 h-64 sm:h-96">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.5!2d78.4294!3d17.2403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDE0JzI1LjEiTiA3OMKwMjUnNDUuOCJF!5e0!3m2!1sen!2sin!4v1700000000000" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
          </div>
        </div>
      </section>

      {/* LEGAL */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-emerald-400 text-sm tracking-[0.2em] uppercase mb-3">100% Safe Investment</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8">Legal & Documentation</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {legalPoints.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-left"
                >
                  <p className="text-base font-medium">{point}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-emerald-900/30 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Ready to Own Your Farmhouse?</h2>
            <p className="text-lg text-slate-300 mb-2">Contact us today for site visit</p>
            <p className="text-emerald-400 font-semibold mb-8">🎪 Limited Time Offer - Only Few Units Left! 🎪</p>

            <div className="inline-block p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl mb-6">
              <p className="text-2xl font-bold mb-1">{project.agent.name}</p>
              <p className="text-emerald-400 text-sm mb-4">{project.agent.designation}, {project.agent.company}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={`tel:${project.agent.phone}`} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold text-lg transition-all hover:scale-105">
                  📞 {project.agent.phone}
                </a>
                <a href={`https://wa.me/${project.agent.whatsapp}?text=Hi, I want to book site visit`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full font-bold text-lg transition-all hover:scale-105">
                  💬 WhatsApp
                </a>
              </div>
            </div>

            <div className="mt-8">
              <button onClick={() => setShowQR(!showQR)} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all">
                {showQR ? "Hide" : "Show"} QR Code to Share
              </button>
              <AnimatePresence>
                {showQR && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6 flex justify-center">
                    <QRCode url="https://own-your-farmhouse.vercel.app" size={180} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🌿</span>
            <span className="font-bold">GREEN ORCHID FARM LAND</span>
          </div>
          <p className="text-slate-500 text-sm">© 2025 Bright Properties. All rights reserved.</p>
          <p className="text-slate-600 text-xs mt-2">Near Kothur, JP Dargah • R. Ganesh - {project.agent.phone}</p>
        </div>
      </footer>

      <FloatingButtons />

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox images={project.gallery} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}