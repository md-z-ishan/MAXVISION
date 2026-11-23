import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';

const FloatingWhatsApp = () => {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMsg)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MAXVISION on WhatsApp"
      className="fixed bottom-5 right-5 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:p-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
    >
      <FaWhatsapp className="text-2xl sm:text-3xl" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
        Chat with Us
      </span>
    </a>
  );
};

export default FloatingWhatsApp;

