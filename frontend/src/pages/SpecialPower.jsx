import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaWhatsapp, FaEye, FaGlasses, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const SpecialPower = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        {/* Hero Section */}
        <div className="bg-primary text-white rounded-2xl p-6 md:p-10 mb-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Custom Precision Optical Solutions
            </span>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-3">
              Special Power & High Cylinder Lenses
            </h1>
            <p className="text-sm md:text-base text-gray-200 leading-relaxed mb-6">
              Struggling to find thin, distortion-free glasses for high prescriptions? MAXVISION Ranchi specializes in advanced high-index (1.67, 1.74), high cylindrical, prism, and customized progressive lenses.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/917485067874?text=Hi%20MAXVISION%2C%20I%20need%20assistance%20with%20a%20Special%20Power%20prescription."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm"
              >
                <FaWhatsapp size={16} />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href="tel:7485067874"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all border border-white/20"
              >
                <FaPhoneAlt size={13} />
                <span>Call Optician: 7485067874</span>
              </a>
            </div>
          </div>
        </div>

        {/* What Are Special Power Lenses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
              <FaEye size={20} />
            </div>
            <h3 className="font-bold text-primary text-base mb-2">High Diopter Powers</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Prescriptions higher than -6.00D or +4.00D crafted with ultra-thin 1.67 and 1.74 aspheric high-index materials to eliminate the bulky "coke-bottle" look.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
              <FaGlasses size={20} />
            </div>
            <h3 className="font-bold text-primary text-base mb-2">High Astigmatism / CYL</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cylindrical powers above -2.00D with accurate axis alignment. We calibrate precise digital surfaced toric lenses for crystal-clear peripheral clarity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-4">
              <FaCheckCircle size={20} />
            </div>
            <h3 className="font-bold text-primary text-base mb-2">Customized Progressives</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Wide-corridor progressive lenses customized for reading, computer distance, and driving with zero jump blur or adaptation dizziness.
            </p>
          </div>
        </div>

        {/* Visit Store Banner */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider mb-1">
              <FaMapMarkerAlt />
              <span>Flagship Optical Store In Ranchi</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-primary mb-1">
              Need Manual Prescription Verification?
            </h3>
            <p className="text-xs text-gray-600">
              Visit us for computerized 0.01D autorefractor eye testing and free frame fitting advice.
            </p>
            <p className="text-xs font-semibold text-gray-700 mt-2">
              📍 Shop 4, Sheetal Tower, Taxi Stand, Main Road, Ranchi, Jharkhand
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/stores"
              className="w-full md:w-auto text-center bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
            >
              View Store Location
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SpecialPower;
