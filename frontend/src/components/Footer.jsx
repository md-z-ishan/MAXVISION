import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#000042] text-white pt-16 pb-8">
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h2 className="text-3xl font-black tracking-tighter mb-4">MAXVISION</h2>
          <p className="text-gray-300 mb-6 text-sm">See the Future Clearly.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-[#329c92] text-2xl transition-colors"><FaFacebook /></a>
            <a href="#" className="hover:text-[#329c92] text-2xl transition-colors"><FaTwitter /></a>
            <a href="#" className="hover:text-[#329c92] text-2xl transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-[#329c92] text-2xl transition-colors"><FaYoutube /></a>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-6 text-white">Services</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Store Locator</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Buying Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Frame Size</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6 text-white">About Us</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">We Are Hiring</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6 text-white">Help</h3>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">FAQ's</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns/Exchanges</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cancellation</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
        <p>&copy; 2026 MAXVISION. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
