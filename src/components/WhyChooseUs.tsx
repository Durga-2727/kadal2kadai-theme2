/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WHY_CHOOSE_US } from '../data';
import { Ship, Sun, Award, Truck, ShieldCheck, Inbox } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyChooseUs() {
  const icons = [
    <Ship className="h-6 w-6 text-[#FF6B4A]" />,
    <Sun className="h-6 w-6 text-[#FF6B4A]" />,
    <Award className="h-6 w-6 text-[#FF6B4A]" />
  ];

  return (
    <section id="why-choose-us" className="py-10 sm:py-12 bg-[#FFF8F0] relative overflow-hidden select-none">
      
      {/* Wave Decorative Background (CSS Only) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180 opacity-5">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]" style={{ fill: '#FF6B4A' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,54.05,17.17,81.1,25.38s55.51,16.51,83.82,23.47S262.88,67.24,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="text-[#FF6B4A] text-xs font-bold font-mono tracking-widest uppercase block mb-2">
            The Golden Standard
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-tight">
            Why Thousands of Families Trust Us
          </h2>
          <div className="w-12 h-1 bg-[#FF6B4A] mx-auto mt-4 rounded-full" />
          <p className="text-sm text-slate-500 mt-4 leading-relaxed font-sans">
            We are redefining seafood sourcing for the South Indian household, bridging the gap between coastal harbor authenticity and your premium kitchen table.
          </p>
        </div>

        {/* 3 Grid Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((block, idx) => (
            <motion.div
              key={block.id}
              id={`choose-block-${block.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-[#FFE8E3] shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-start gap-4 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6B4A]/5 rounded-bl-[100px] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
              
              <div className="p-3.5 bg-[#FFF8F0] text-[#1B3864] rounded-xl group-hover:bg-[#FF6B4A] group-hover:text-white transition-all duration-300 shadow-sm">
                {icons[idx] || <Ship className="h-6 w-6" />}
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-slate-800 tracking-tight group-hover:text-[#FF6B4A] transition-colors mb-2">
                  {block.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {block.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
