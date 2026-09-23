'use client';
import React, { useEffect, useState, useRef } from 'react';
import { assetUrl } from '@/lib/assetUrl';

export default function IvfRecommended({ data }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const handleCardClick = (index) => {
    setActiveCard(activeCard === index ? null : index);
  };

  return (
    <section 
      ref={sectionRef} 
      className="w-full pt-12 pb-16 md:pb-20 relative overflow-x-hidden bg-[#f4f7fb]"
    >
      <div className="max-w-6xl mx-auto px-4 relative z-10 flex flex-col items-center w-full">
        
        {/* Section Title */}
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] text-center mb-10 md:mb-12 leading-tight transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          {data.sectionTitleLine1 && <span>{data.sectionTitleLine1}</span>}
          {data.sectionTitleLine2 && <span className="block mt-1">{data.sectionTitleLine2}</span>}
        </h2>

        {/* Grid Container */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 justify-items-center">
          {data.items.map((item, index) => {
            const isActive = activeCard === index;

            return (
              <div 
                key={index}
                onClick={() => handleCardClick(index)}
                className={`w-full cursor-pointer rounded-2xl shadow-[0_6px_22px_rgba(0,0,0,0.04)] border transition-all duration-300 flex flex-col md:flex-row items-center p-4 md:px-5 md:py-5 group transform text-center md:text-left relative ${
                  isActive 
                    ? 'bg-[#EAA0B4] border-[#EAA0B4] shadow-lg' 
                    : 'bg-white border-gray-100 hover:shadow-[0_10px_28px_rgba(219,80,112,0.1)]'
                } ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Icon Wrapper */}
                <div className={`w-14 h-14 md:w-18 md:h-18 rounded-full flex items-center justify-center flex-shrink-0 mb-3 md:mb-0 md:mr-4 transition-transform duration-300 group-hover:scale-110 z-10 ${
                  isActive ? 'bg-transparent border-0' : 'bg-pink-50/80 border border-pink-100/60 shadow-inner'
                }`}>
                  <img 
                    src={assetUrl(isActive && item.activeIcon ? item.activeIcon : item.icon)} 
                    alt={item.title} 
                    className={`w-12 h-12 md:w-16 md:h-16 object-contain transition-transform duration-300 group-hover:scale-110 scale-125 ${
                      isActive && !item.activeIcon ? 'brightness-0 invert' : ''
                    }`}
                  />
                </div>

                {/* Text Content */}
                <div className="flex-1 w-full">
                  <h3 
                    className={`font-bold leading-snug text-xs md:text-[15px] transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-[#152449]'
                    }`}
                    style={{
                      fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}
                  >
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p 
                      className={`font-medium text-[11px] md:text-sm leading-snug mt-0.5 transition-colors duration-300 ${
                        isActive ? 'text-white/90' : 'text-[#152449]'
                      }`}
                      style={{
                        fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif'
                      }}
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}