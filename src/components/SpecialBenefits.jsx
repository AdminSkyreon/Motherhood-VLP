'use client';
import React, { useEffect, useState } from 'react';
import { assetUrl } from '@/lib/assetUrl';

export default function SpecialBenefits({ data }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Triggers entrance animation right after component mounts on page refresh
    setIsLoaded(true);
  }, []);

  // Safety check agar data na mile
  if (!data) return null;

  return (
    <section className="w-full bg-[#f4f7fb] relative z-10 py-8 px-2 sm:px-4 md:px-6 overflow-hidden" style={{ backgroundColor: '#f4f7fb' }}>
      <div className="max-w-5xl mx-auto w-full">
        {/* Section Title with Fade-in Animation on Refresh */}
        <h2 className={`text-2xl md:text-3xl font-bold text-[#231F20] text-center mb-6 transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`} style={{ color: '#231F20' }}>
          {data.title}
        </h2>

        {/* Cards Container: Side-by-side (grid-cols-2) on mobile & capsule layout on desktop */}
        <div className={`grid grid-cols-2 gap-2 sm:gap-3.5 md:flex md:flex-row justify-center items-stretch md:items-center md:gap-6 transition-all duration-1000 transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {data.cards?.map((card, index) => (
            <div 
              key={index}
              // 'group' class added for hover effects
              className={`group w-full border border-pink-200/60 shadow-[0_10px_30px_rgba(219,80,112,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(219,80,112,0.18)] ${
                // Card 1 & Card 2: Solid light background colors for mobile, gradient for desktop
                index === 0 
                  ? 'bg-[#F3EAFB] md:bg-gradient-to-r md:from-[#EADCF5] md:via-[#F0E5F8] md:to-white' 
                  : 'bg-[#FDF0F3] md:bg-gradient-to-r md:from-[#FDE8EE] md:via-[#FDF0F3] md:to-white'
              } ${
                // Mobile: Vertical Stacked Box side-by-side | Desktop: Horizontal Capsule
                'rounded-2xl sm:rounded-3xl py-4 px-2.5 sm:px-4 flex flex-col items-center text-center md:max-w-[320px] md:h-[104px] md:rounded-full md:px-4 md:py-0 md:flex-row md:text-left'
              }`}
              style={{
                backgroundColor: index === 0 ? '#F3EAFB' : '#FDF0F3'
              }}
            >
              {/* Icon Inside Circle with Theme-based Shadow on Hover */}
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-[52px] md:h-[52px] md:min-w-[52px] md:min-h-[52px] rounded-full bg-white border border-pink-100 shadow-sm flex items-center justify-center shrink-0 mb-2 sm:mb-3.5 md:mb-0 transition-all duration-300 group-hover:scale-110 ${
                index === 0 
                  ? 'group-hover:shadow-[0_0_20px_rgba(180,130,220,0.4)]' 
                  : 'group-hover:shadow-[0_0_20px_rgba(230,120,150,0.35)]'
              }`} style={{ backgroundColor: '#ffffff' }}>
                <img 
                  src={assetUrl(card.icon)} 
                  alt={card.title} 
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Text Content Dynamic from JSON */}
              <div className="w-full md:pl-3.5">
                <h3 className="text-[11px] sm:text-xs md:text-[15px] font-bold text-[#231F20] leading-tight" style={{ color: '#231F20' }}>
                  {card.title}
                </h3>
                <p className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-600 leading-relaxed mt-1 md:mt-0.5" style={{ color: '#4B5563' }}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}