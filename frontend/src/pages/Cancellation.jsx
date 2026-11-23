import React from 'react';
import { FaBan, FaPhoneAlt, FaWhatsapp, FaInfoCircle } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';

const Cancellation = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-2xs">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <FaBan />
            <span>Order Guidelines</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight mb-2">
            Cancellation Policy
          </h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Please review our cancellation guidelines for frame orders and custom prescription lenses.
          </p>

          <div className="space-y-6 text-xs text-gray-700 leading-relaxed mb-8">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-primary text-sm mb-1.5">Standard Frame Only Orders</h3>
              <p>
                Orders without custom powered lenses can be cancelled before dispatch directly from your <strong>My Orders</strong> dashboard or by notifying our support team via call or WhatsApp. Once cancelled, your inventory stock is automatically released back to the store.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-bold text-primary text-sm mb-1.5">Custom Prescription Lenses</h3>
              <p>
                Prescription lenses are precision-surfaced and edged individually for each customer. Cancellation requests should be submitted as early as possible before physical lab edging begins. If edging has commenced, our team will work with you to find the best resolution.
              </p>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900">
              <h3 className="font-bold text-sm mb-1.5 flex items-center gap-2">
                <FaInfoCircle className="text-amber-700" />
                How to Request Cancellation
              </h3>
              <p>
                To cancel an order quickly, contact our store directly with your Order ID:
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <a
                  href={`tel:${siteConfig.primaryPhone}`}
                  className="bg-amber-900 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <FaPhoneAlt size={11} /> Call: {siteConfig.primaryPhone}
                </a>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi MAXVISION, I would like to cancel my order.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <FaWhatsapp size={13} /> WhatsApp Cancellation
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
            MAXVISION Optical • {siteConfig.address}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cancellation;

