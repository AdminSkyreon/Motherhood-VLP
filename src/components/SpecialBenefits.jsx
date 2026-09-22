'use client';
import React, { useEffect, useState } from 'react';

export default function SpecialBenefits({ data }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Triggers entrance animation right after component mounts on page refresh
    setIsLoaded(true);
  }, []);

  // Safety check agar data na mile
  if (!data) return null;

  return (
    <section className="w-full max-w-5xl mx-auto px-4 md:px-6 pt-0 pb-8 overflow-hidden">
      {/* Section Title with Fade-in Animation on Refresh */}
      <h2 className={`text-2xl md:text-3xl font-bold text-[#231F20] text-center mb-6 transition-all duration-700 transform ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        {data.title}
      </h2>

      {/* Cards Container with Smooth Fade-in & Slide-up Animation on Refresh */}
      <div className={`grid grid-cols-2 gap-3.5 md:flex md:flex-row justify-center items-stretch md:items-center md:gap-6 transition-all duration-1000 transform ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {data.cards?.map((card, index) => (
          <div 
            key={index}
            // 'group' class added for hover effects
            className={`group w-full border border-pink-200/60 shadow-[0_10px_30px_rgba(219,80,112,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(219,80,112,0.18)] ${
              // Card 1: Purple Glass gradient | Card 2: Pink Glass gradient
              index === 0 
                ? 'bg-gradient-to-br md:bg-gradient-to-r from-[#EADCF5] via-[#F0E5F8] to-white' 
                : 'bg-gradient-to-br md:bg-gradient-to-r from-[#FDE8EE] via-[#FDF0F3] to-white'
            } ${
              // Mobile: Vertical Stacked Box with proper padding | Desktop: Horizontal Capsule
              'rounded-3xl py-6 px-4 flex flex-col items-center text-center md:max-w-[320px] md:h-[104px] md:rounded-full md:px-4 md:py-0 md:flex-row md:text-left'
            }`}
          >
            {/* Icon Inside Circle with Theme-based Shadow on Hover */}
            <div className={`w-14 h-14 md:w-[52px] md:h-[52px] md:min-w-[52px] md:min-h-[52px] rounded-full bg-white border border-pink-100 shadow-sm flex items-center justify-center shrink-0 mb-3.5 md:mb-0 transition-all duration-300 group-hover:scale-110 ${
              index === 0 
                ? 'group-hover:shadow-[0_0_20px_rgba(180,130,220,0.4)]' 
                : 'group-hover:shadow-[0_0_20px_rgba(230,120,150,0.35)]'
            }`}>
              <img 
                src={card.icon} 
                alt={card.title} 
                className="w-7 h-7 md:w-6 md:h-6 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Text Content Dynamic from JSON */}
            <div className="w-full md:pl-3.5">
              <h3 className="text-xs md:text-[15px] font-bold text-[#231F20] leading-tight">
                {card.title}
              </h3>
              <p className="text-[10px] md:text-[11px] text-gray-600 leading-relaxed mt-1.5 md:mt-0.5">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}