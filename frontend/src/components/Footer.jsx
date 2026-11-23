import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhoneAlt, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';

const Footer = () => {
  return (
    <footer className="bg-[#000042] text-white pt-14 pb-8 border-t border-[#000030]">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        
        {/* Brand & Contact Overview */}
        <div>
          <Link to="/" className="text-2xl md:text-3xl font-black tracking-tighter mb-2 inline-block">
            {siteConfig.storeName}
          </Link>
          <p className="text-gray-300 mb-4 text-xs">
            {siteConfig.tagline}. High quality optical eyewear & contact lenses in Ranchi.
          </p>
          <div className="text-xs text-gray-300 space-y-2 mb-5">
            <p className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-secondary shrink-0 mt-0.5" />
              <span>{siteConfig.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-secondary shrink-0" />
              <span>{siteConfig.primaryPhone} , {siteConfig.secondaryPhone}</span>
            </p>
          </div>
          <div className="flex space-x-3.5">
            <a href={siteConfig.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-secondary text-xl transition-colors"><FaFacebook /></a>
            <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-secondary text-xl transition-colors"><FaInstagram /></a>
            <a href={siteConfig.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-secondary text-xl transition-colors"><FaTwitter /></a>
            <a href={siteConfig.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-secondary text-xl transition-colors"><FaYoutube /></a>
          </div>
        </div>
        
        {/* Services */}
        <div>
          <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-white border-b border-gray-700/60 pb-1">
            Services
          </h3>
          <ul className="space-y-2.5 text-gray-300 text-xs">
            <li><Link to="/stores" className="hover:text-secondary transition-colors">Store Locator & Ranchi Store</Link></li>
            <li><Link to="/try-at-home" className="hover:text-secondary transition-colors">Free Try @ Home Ranchi</Link></li>
            <li><Link to="/try-on" className="hover:text-secondary transition-colors">Virtual 3D Try-On</Link></li>
            <li><Link to="/buying-guide" className="hover:text-secondary transition-colors">Eyewear Buying Guide</Link></li>
            <li><Link to="/frame-size" className="hover:text-secondary transition-colors">Frame Size & Measurements</Link></li>
            <li><Link to="/special-power" className="hover:text-secondary transition-colors">Special Power Lenses</Link></li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-white border-b border-gray-700/60 pb-1">
            About Us
          </h3>
          <ul className="space-y-2.5 text-gray-300 text-xs">
            <li><Link to="/our-story" className="hover:text-secondary transition-colors">Our Story</Link></li>
            <li><Link to="/we-are-hiring" className="hover:text-secondary transition-colors">We Are Hiring</Link></li>
            <li><Link to="/contact-us" className="hover:text-secondary transition-colors">Contact Us</Link></li>
            <li>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors flex items-center gap-1.5"
              >
                <FaWhatsapp className="text-emerald-400" /> WhatsApp Store Support
              </a>
            </li>
          </ul>
        </div>

        {/* Help & Policies */}
        <div>
          <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-white border-b border-gray-700/60 pb-1">
            Help & Policies
          </h3>
          <ul className="space-y-2.5 text-gray-300 text-xs">
            <li><Link to="/faqs" className="hover:text-secondary transition-colors">FAQ's</Link></li>
            <li><Link to="/returns-exchanges" className="hover:text-secondary transition-colors">Returns & Adjustments</Link></li>
            <li><Link to="/cancellation" className="hover:text-secondary transition-colors">Cancellation Policy</Link></li>
            <li><Link to="/orders" className="hover:text-secondary transition-colors">Track My Order</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-xs px-4 flex flex-col sm:flex-row items-center justify-between container mx-auto">
        <p>&copy; {new Date().getFullYear()} {siteConfig.storeName}. All Rights Reserved.</p>
        <p className="mt-2 sm:mt-0 text-[11px] text-gray-500">
          Precision Optics • Ranchi, Jharkhand
        </p>
      </div>
    </footer>
  );
};

export default Footer;
