import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaWhatsapp } from 'react-icons/fa';
import { siteConfig } from '../config/siteConfig';

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How do I provide my eye prescription for glasses?",
      a: "You can easily upload a clear photo or PDF of your doctor's prescription during checkout, enter your spherical/cylindrical power manually, or opt to share it with our optician over WhatsApp after placing your order."
    },
    {
      q: "Can I try frames in person before purchasing?",
      a: "Yes! You can visit our store at Shop 4, Sheetal Tower, Main Road, Ranchi, or use our 'Try @ Home' service where our optician brings a curated kit of 50+ frames to your home in Ranchi for free."
    },
    {
      q: "Are the frames and lenses 100% genuine?",
      a: "Absolutely. All branded frames (Ray-Ban, Oakley, Titan Eye+, Fastrack, Vision Plus) and lenses come directly from authorized distributors with genuine manufacturer packaging and warranty cards."
    },
    {
      q: "What lens options do you offer for high-power prescriptions?",
      a: "We specialize in ultra-thin 1.67 and 1.74 high-index lenses, high-cylinder toric optics, and customized wide-field progressive lenses designed to eliminate eye strain."
    },
    {
      q: "How does local store pickup work?",
      a: "At checkout, choose 'Store Pickup' to collect your finished glasses directly from our Ranchi store with free in-person custom temple alignment and fitting adjustments."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-2xs">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <FaQuestionCircle />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight mb-2">
            Help & FAQs
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Answers to common questions regarding ordering, prescription lenses, store pickup, and delivery.
          </p>

          <div className="space-y-3 mb-8">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 font-bold text-sm text-primary hover:bg-gray-50 focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {openIndex === idx ? <FaChevronUp className="text-secondary shrink-0" /> : <FaChevronDown className="text-gray-400 shrink-0" />}
                </button>
                {openIndex === idx && (
                  <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed bg-gray-50/50 border-t border-gray-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-primary">Still have questions?</h4>
              <p className="text-xs text-gray-500">Our Ranchi optical team is available daily.</p>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-2xs"
            >
              <FaWhatsapp /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;

