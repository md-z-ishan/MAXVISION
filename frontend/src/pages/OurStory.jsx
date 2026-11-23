import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaAward, FaHandshake, FaMapMarkerAlt } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';

const OurStory = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-2xs">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <FaEye />
            <span>Our Journey</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight mb-4">
            About MAXVISION Optical
          </h1>
          <p className="text-sm text-gray-700 leading-relaxed mb-6 font-medium">
            Founded in the heart of Ranchi, Jharkhand, MAXVISION was built on a simple premise: Everyone deserves clear, comfortable, and stylish vision without paying exorbitant markups for quality eyewear.
          </p>

          <div className="space-y-6 text-xs text-gray-600 leading-relaxed mb-8">
            <p>
              From our flagship optical destination at <strong>Sheetal Tower, Main Road, Ranchi</strong>, we blend genuine brand-name frames (such as Ray-Ban, Oakley, Titan Eye+, Fastrack, and Vision Plus) with precision German-engineered robotic lens edging and computerized refraction testing.
            </p>
            <p>
              Whether you need blue-light computer glasses, specialized high-cylinder powers, progressive lenses, or breathable daily disposable contact lenses, our qualified opticians ensure each pair is custom-crafted to your exact pupillary distance (PD) and optical center.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <FaAward className="text-secondary text-xl mx-auto mb-2" />
              <h4 className="font-bold text-primary text-xs mb-1">Authentic Guarantee</h4>
              <p className="text-[11px] text-gray-500">100% genuine frames and ophthalmic-grade lenses.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <FaEye className="text-primary text-xl mx-auto mb-2" />
              <h4 className="font-bold text-primary text-xs mb-1">Computer Eye Testing</h4>
              <p className="text-[11px] text-gray-500">State-of-the-art autorefractor vision assessment.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
              <FaHandshake className="text-emerald-600 text-xl mx-auto mb-2" />
              <h4 className="font-bold text-primary text-xs mb-1">Local Ranchi Roots</h4>
              <p className="text-[11px] text-gray-500">Dedicated local customer care and doorstep fitting.</p>
            </div>
          </div>

          <div className="p-5 bg-primary text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Experience MAXVISION In Person</h4>
              <p className="text-xs text-gray-300 mt-0.5">
                {siteConfig.address}
              </p>
            </div>
            <Link
              to="/stores"
              className="bg-secondary text-white font-bold text-xs px-5 py-2.5 rounded-lg whitespace-nowrap shadow-sm hover:bg-opacity-90 transition-all"
            >
              Visit Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;

