import React from 'react';
import { Link } from 'react-router-dom';
import { FaRulerCombined, FaGlasses, FaCheck } from 'react-icons/fa';

const FrameSize = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-2xs">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <FaRulerCombined />
            <span>Dimensions & Fit Guide</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tight mb-4">
            Understanding Eyewear Frame Sizing
          </h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Finding comfortable glasses starts with understanding the three key measurements printed inside your current frame arm (temple): Lens Width, Bridge Width, and Temple Length (e.g. <strong>52 [] 18 - 140</strong>).
          </p>

          {/* Size Breakdown Table */}
          <div className="overflow-x-auto mb-8 border border-gray-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-primary font-black uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-3.5">Frame Size Category</th>
                  <th className="p-3.5">Total Frame Width</th>
                  <th className="p-3.5">Lens Width</th>
                  <th className="p-3.5">Best Suited For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td className="p-3.5 font-bold text-primary">Narrow / Small</td>
                  <td className="p-3.5">&lt; 130 mm</td>
                  <td className="p-3.5">48 - 50 mm</td>
                  <td className="p-3.5">Petite face profiles and narrow temples</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-primary">Medium (Standard)</td>
                  <td className="p-3.5">130 - 138 mm</td>
                  <td className="p-3.5">51 - 53 mm</td>
                  <td className="p-3.5">Over 70% of adults; standard universal fit</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-primary">Wide / Extra Wide</td>
                  <td className="p-3.5">&gt; 139 mm</td>
                  <td className="p-3.5">54 - 58 mm</td>
                  <td className="p-3.5">Broader facial features; avoids arm pinching</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6">
            <h4 className="font-bold text-primary text-sm mb-2">How to Check Sizing on MAXVISION:</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every product page lists the exact <strong>Frame Size</strong> (Narrow, Medium, Wide) and <strong>Frame Shape</strong>. If you are unsure between two sizes, our standard <strong>Medium</strong> provides the most comfortable universal fit.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <Link to="/try-on" className="text-secondary font-bold text-xs hover:underline flex items-center gap-1.5">
              <FaGlasses /> Try virtual 3D Try-On
            </Link>
            <Link to="/products" className="bg-primary text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-2xs">
              Shop by Your Size
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameSize;

