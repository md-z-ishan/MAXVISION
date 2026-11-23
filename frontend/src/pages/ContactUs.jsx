import React from 'react';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt, FaClock, FaEnvelope, FaDirections } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';

const ContactUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-2xs">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <FaPhoneAlt />
            <span>Customer Assistance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight mb-2">
            Contact MAXVISION Ranchi
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Have questions about your prescription power, frame fitting, or order tracking? Reach out to our Ranchi optical team directly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Direct Connect Options */}
            <div className="space-y-4">
              <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                    <FaWhatsapp size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 text-sm">Instant WhatsApp Support</h3>
                    <p className="text-xs text-emerald-700">Quick answers for prescriptions & orders</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-2xs"
                >
                  <FaWhatsapp size={14} /> Open WhatsApp (+91 {siteConfig.whatsappNumber.slice(2)})
                </a>
              </div>

              <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center">
                    <FaPhoneAlt size={15} />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-sm">Direct Phone Calls</h3>
                    <p className="text-xs text-gray-600">Speak directly with our store optician</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <a
                    href={`tel:${siteConfig.primaryPhone}`}
                    className="inline-flex items-center gap-1.5 bg-primary hover:bg-opacity-90 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
                  >
                    <FaPhoneAlt size={11} /> Call {siteConfig.primaryPhone}
                  </a>
                  <a
                    href={`tel:${siteConfig.secondaryPhone}`}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:border-primary text-primary font-bold text-xs px-3.5 py-2 rounded-lg transition-colors"
                  >
                    <FaPhoneAlt size={11} /> Call {siteConfig.secondaryPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Store Address & Hours */}
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-secondary shrink-0 mt-1" size={16} />
                <div>
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-1">Flagship Store Location</h4>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    {siteConfig.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                <FaClock className="text-secondary shrink-0 mt-1" size={16} />
                <div>
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-1">Working Hours</h4>
                  <p className="text-xs text-gray-700 font-medium">
                    {siteConfig.hours}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=Sheetal+Tower+Main+Road+Ranchi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold text-xs py-2.5 rounded-lg shadow-2xs hover:bg-opacity-90 transition-all"
                >
                  <FaDirections /> Get Driving Directions on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

