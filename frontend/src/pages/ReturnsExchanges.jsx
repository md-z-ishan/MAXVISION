import React from 'react';
import { FaExchangeAlt, FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';

const ReturnsExchanges = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-2xs">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <FaExchangeAlt />
            <span>Store Policy</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight mb-2">
            Returns & Exchanges Policy
          </h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            At MAXVISION, your optical clarity and physical comfort are our topmost priorities.
          </p>

          <div className="space-y-6 text-xs text-gray-700 leading-relaxed mb-8">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-primary text-sm mb-1.5 flex items-center gap-2">
                <FaCheckCircle className="text-secondary" />
                Frame Fitting & Alignment Adjustment
              </h3>
              <p>
                If your new frames feel tight behind the ears, loose on the bridge, or misaligned, you are welcome to visit our Ranchi store anytime for complimentary in-person optical temple fitting and nose-pad adjustments by our technicians.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-primary text-sm mb-1.5 flex items-center gap-2">
                <FaCheckCircle className="text-secondary" />
                Prescription Vision Comfort Guarantee
              </h3>
              <p>
                Custom prescription lenses are edged to the specific parameters provided in your prescription. In case you experience visual adaptation difficulties or blurriness, our optometrist will re-verify your prescription power and pupil optical center to ensure your lenses match your clinical needs.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-primary text-sm mb-1.5 flex items-center gap-2">
                <FaCheckCircle className="text-secondary" />
                Damaged or Defective Deliveries
              </h3>
              <p>
                In the rare event that an item arrives with manufacturing defects or shipping damage, please notify us immediately upon delivery with a photo on WhatsApp or phone so our team can arrange prompt replacement or resolution.
              </p>
            </div>
          </div>

          <div className="p-5 bg-primary text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Need help with an existing order?</h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Contact our Ranchi optical team directly: {siteConfig.primaryPhone}
              </p>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi MAXVISION, I would like to request assistance regarding return/exchange of my order.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-2xs whitespace-nowrap hover:bg-emerald-700 transition-colors"
            >
              <FaWhatsapp /> Contact on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;

