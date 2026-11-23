import React from 'react';
import { FaBriefcase, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';

const WeAreHiring = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-2xs">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <FaBriefcase />
            <span>Careers At MAXVISION</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight mb-4">
            Join the MAXVISION Optical Team
          </h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            We are expanding our retail footprint and doorstep optical care team in Ranchi. If you are passionate about customer service, ophthalmic dispensing, or optical retail sales, we'd love to connect.
          </p>

          <div className="space-y-4 mb-8">
            <div className="p-4 border border-gray-200 rounded-xl hover:border-secondary transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-primary text-sm">Certified Optometrist / Refractionist</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Location: Ranchi (Full-Time)</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Open</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Conduct comprehensive computer eye checkups, evaluate visual acuity, and advise customers on specialized lenses.
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl hover:border-secondary transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-primary text-sm">Optical Retail Sales Consultant</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Location: Ranchi (Full-Time)</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Open</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Assist walk-in clients with frame styling, fitting, lens options, and customer delight.
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-xl hover:border-secondary transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-primary text-sm">Doorstep Eye Care & Home Try-On Executive</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Location: Ranchi City (Full-Time)</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">Open</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Deliver curated home try-on kits and coordinate doorstep eye testing visits for families.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h4 className="font-bold text-primary text-sm mb-2">How to Apply:</h4>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Send your resume or contact details directly to our Ranchi store management via WhatsApp or call our team directly.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi MAXVISION management, I would like to inquire about career opportunities in Ranchi.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-2xs"
              >
                <FaWhatsapp size={14} /> WhatsApp Resume: {siteConfig.primaryPhone}
              </a>
              <a
                href={`tel:${siteConfig.primaryPhone}`}
                className="bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-2xs"
              >
                <FaPhoneAlt size={12} /> Call: {siteConfig.primaryPhone}
              </a>
            </div>
            <p className="text-[11px] text-gray-500 mt-3">
              📍 Walk-in: {siteConfig.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeAreHiring;

