import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock, FaPhone, FaDirections, FaStore } from 'react-icons/fa';
import { motion } from 'framer-motion';

const stores = [
  {
    id: 1,
    name: "MAXVISION – Taxi Stand",
    address: "Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand 834001",
    timings: "10:00 AM – 8:30 PM",
    phone: "7485067874",
    tag: "Flagship Store",
    tagColor: "bg-green-100 text-green-700",
    clickable: true,
    // Google Maps search URL for the address
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Sheetal+Tower+Taxi+Stand+Main+Road+Ranchi+Jharkhand",
  },
  {
    id: 2,
    name: "MAXVISION – Daily Market",
    address: "Daily Market, Ranchi, Jharkhand",
    timings: "10:00 AM – 8:00 PM",
    phone: "Coming Soon",
    tag: "Opening Soon",
    tagColor: "bg-yellow-100 text-yellow-700",
    clickable: false,
    mapUrl: null,
  },
  {
    id: 3,
    name: "MAXVISION – Over Bridge",
    address: "Over Bridge, Ranchi, Jharkhand",
    timings: "10:00 AM – 8:00 PM",
    phone: "Coming Soon",
    tag: "Opening Soon",
    tagColor: "bg-yellow-100 text-yellow-700",
    clickable: false,
    mapUrl: null,
  },
  {
    id: 4,
    name: "MAXVISION – Argora",
    address: "Argora, Ranchi, Jharkhand",
    timings: "10:00 AM – 8:00 PM",
    phone: "Coming Soon",
    tag: "Opening Soon",
    tagColor: "bg-yellow-100 text-yellow-700",
    clickable: false,
    mapUrl: null,
  },
  {
    id: 5,
    name: "MAXVISION – Harmu",
    address: "Harmu, Ranchi, Jharkhand",
    timings: "10:00 AM – 8:00 PM",
    phone: "Coming Soon",
    tag: "Opening Soon",
    tagColor: "bg-yellow-100 text-yellow-700",
    clickable: false,
    mapUrl: null,
  },
];

const StoreCard = ({ store, index }) => {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (store.clickable && store.mapUrl) {
      window.open(store.mapUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        bg-white rounded-2xl border-2 p-5 sm:p-6 flex flex-col gap-4 transition-all duration-300
        ${store.clickable
          ? 'border-gray-200 hover:border-secondary hover:shadow-xl cursor-pointer hover:-translate-y-0.5'
          : 'border-gray-100 opacity-75 cursor-not-allowed'
        }
      `}
    >
      {/* Header: Store Info & Status Badge (Clean flex layout with zero overlap) */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-lg shrink-0
            ${store.clickable ? 'bg-secondary' : 'bg-gray-400'}`}>
            <FaStore />
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg text-primary leading-tight">{store.name}</h3>
            <p className="text-xs text-gray-400 font-medium">MAXVISION Optical</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 whitespace-nowrap ${store.tagColor}`}>
          {store.tag}
        </span>
      </div>

      {/* Address */}
      <div className="flex items-start gap-3 text-gray-600">
        <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
        <span className="text-xs sm:text-sm leading-relaxed">{store.address}</span>
      </div>

      {/* Timings */}
      <div className="flex items-center gap-3 text-gray-600">
        <FaClock className="text-secondary flex-shrink-0" />
        <span className="text-xs sm:text-sm">{store.timings}</span>
      </div>

      {/* Phone */}
      <div className="flex items-center gap-3 text-gray-600">
        <FaPhone className="text-emerald-600 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium">
          {store.phone !== 'Coming Soon'
            ? <>
                <a href="tel:7485067874" onClick={e => e.stopPropagation()} className="hover:underline text-secondary font-bold">7485067874</a>
                <span className="mx-1 text-gray-300">|</span>
                <a href="tel:7033353140" onClick={e => e.stopPropagation()} className="hover:underline text-secondary font-bold">7033353140</a>
              </>
            : <span className="text-gray-400">Coming Soon</span>
          }
        </span>
      </div>

      {/* CTA Button */}
      {store.clickable ? (
        <div className={`mt-2 flex items-center gap-2 justify-center w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200
          ${hovered ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary border border-secondary/20'}`}>
          <FaDirections className="text-base" />
          Get Directions on Google Maps
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-center w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gray-50 text-gray-400 border border-gray-200">
          🔒 &nbsp;Location Coming Soon
        </div>
      )}
    </motion.div>
  );
};

const Stores = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            Find Your Nearest Store
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            MAXVISION Store Locator
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Visit us at our stores across Ranchi. Click on any active store to get directions via Google Maps.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-sm font-semibold">
            <FaMapMarkerAlt className="text-red-400" />
            Ranchi, Jharkhand · 2500+ Happy Customers
          </div>
        </motion.div>
      </div>

      {/* Store Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Our Locations</h2>
            <p className="text-gray-500 text-sm mt-1">1 store active · 4 locations opening soon</p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full border border-blue-200">
            🟢 1 Store Open Now
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, i) => (
            <StoreCard key={store.id} store={store} index={i} />
          ))}
        </div>

        {/* Help Banner */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Need Help Finding Us?</h3>
            <p className="text-gray-500 text-sm mt-1">Call us directly and we'll guide you to the store.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="tel:7485067874"
              className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <FaPhone /> 7485067874
            </a>
            <a
              href="tel:7033353140"
              className="flex items-center gap-2 bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
            >
              <FaPhone /> 7033353140
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stores;
