import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaGlasses, FaCheckCircle, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';

const BuyingGuide = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-2xs">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <FaBookOpen />
            <span>Eyewear Selection Guide</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight mb-4">
            How to Choose the Perfect Eyeglasses
          </h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Selecting the right eyewear involves choosing the proper frame geometry for your face shape, the appropriate lens index for your prescription power, and specialized coatings for your lifestyle.
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-secondary pl-4">
              <h3 className="font-bold text-primary text-base mb-1">1. Match Your Face Shape</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                • <strong>Round Faces:</strong> Square, rectangle, and angular geometric frames add contour.<br />
                • <strong>Square Faces:</strong> Round, oval, and aviator frames soften strong jawlines.<br />
                • <strong>Oval Faces:</strong> Most versatile; suitable for wayfarer, aviator, and cat-eye frames.<br />
                • <strong>Heart Faces:</strong> Light metal rimless or semi-rimless frames balance the forehead.
              </p>
            </div>

            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-bold text-primary text-base mb-1">2. Lens Index by Prescription Power</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                • <strong>Standard Index (1.50):</strong> Ideal for low powers between 0.00D and +/- 2.00D.<br />
                • <strong>Mid Index (1.56):</strong> Recommended for mild powers between +/- 2.00D and +/- 4.00D.<br />
                • <strong>High Index (1.61 - 1.67):</strong> Ultra-light and slim lenses for powers between +/- 4.00D and +/- 8.00D.<br />
                • <strong>Super High Index (1.74):</strong> Maximum thinness for strong prescriptions (+/- 8.00D and above).
              </p>
            </div>

            <div className="border-l-4 border-emerald-600 pl-4">
              <h3 className="font-bold text-primary text-base mb-1">3. Essential Lens Coatings</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                • <strong>Anti-Glare / Anti-Reflective (AR):</strong> Reduces headlights glare during night driving and removes reflection in video calls.<br />
                • <strong>Blue Light Filter:</strong> Shields eyes from prolonged screen fatigue, laptops, and mobile usage.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              Need personalized advice? Visit our flagship Ranchi store or contact our optical team.
            </p>
            <div className="flex gap-2">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-2xs"
              >
                <FaWhatsapp /> WhatsApp Support
              </a>
              <Link to="/products" className="bg-primary text-white font-bold text-xs px-4 py-2 rounded-lg shadow-2xs">
                Explore Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyingGuide;

