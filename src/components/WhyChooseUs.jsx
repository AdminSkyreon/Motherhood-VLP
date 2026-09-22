'use client';
import React, { useEffect, useState, useRef } from 'react';
import { assetUrl } from '@/lib/assetUrl';

export default function WhyChooseUs({ data }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
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

  // Agar JSON mein data ya stats nahi hain, toh section render nahi hoga
  if (!data || !data.stats || data.stats.length === 0) {
    return null;
  }

  return (
    <section 
      ref={sectionRef} 
      className="w-full pt-0 pb-4 md:pb-6 my-0 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-sky-50/50 backdrop-blur-md shadow-sm relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] text-center mb-6 md:mb-10 leading-tight transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}>
          {data.sectionTitle} <br className="hidden md:block" />
          <span className="text-[#231F20]">{data.sectionHighlight}</span>
        </h2>

        {/* Cards Grid Container */}
        <div className={`w-full grid grid-cols-2 lg:flex lg:flex-nowrap justify-center items-center gap-3 md:gap-2 px-1 transition-all duration-1000 delay-200 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {data.stats.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div key={index} className="flex items-center justify-center lg:justify-start shrink-0">
                
                {/* Card Box */}
                <div 
                  onClick={() => setActiveIndex(index)}
                  className={`bg-white rounded-[24px] border transition-all duration-300 flex flex-col items-center text-center relative w-full lg:w-[181.27px] cursor-pointer group hover:-translate-y-1 ${
                    isActive 
                      ? 'border-[#DB5070] shadow-[0_10px_30px_rgba(219,80,112,0.2)]' 
                      : 'border-gray-100 shadow-[0_6px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(219,80,112,0.15)]'
                  }`}
                  style={{
                    height: '210px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    paddingLeft: '11.2px',
                    paddingRight: '11.2px',
                    justifyContent: 'flex-start',
                    gap: '14px'
                  }}
                >
                  
                  {/* Icon Circle Frame */}
                  <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm ${
                    isActive 
                      ? 'bg-[#DB5070] border-[#DB5070]' 
                      : 'bg-blue-50/90 border-blue-100 group-hover:bg-blue-100/80'
                  }`}>
                    <img 
                      src={assetUrl(item.icon)} 
                      alt={item.label} 
                      className={`w-7 h-7 object-contain transition-all duration-300 ${
                        isActive ? 'brightness-0 invert' : 'brightness-100'
                      }`}
                    />
                  </div>

                  {/* Content Group */}
                  <div className="flex flex-col items-center justify-center w-full">
                    <span 
                      className={`text-[28px] font-extrabold tracking-tight block mb-1 transition-colors duration-300 ${
                        isActive ? 'text-[#DB5070]' : 'text-[#0057A4]'
                      }`}
                      style={{
                        fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif'
                      }}
                    >
                      {item.number}
                    </span>

                    <p className="text-[12px] md:text-[13px] font-semibold text-gray-600 leading-snug">
                      {item.label}
                    </p>
                  </div>

                </div>

                {/* Connecting Dotted Line & Dot */}
                {index < data.stats.length - 1 && (
                  <div className="hidden lg:flex items-center">
                    <div className="w-6 xl:w-8 border-t-2 border-dotted border-blue-300 relative flex items-center justify-center">
                      {item.dotColor && (
                        <span className={`absolute w-3 h-3 rounded-full border-2 bg-white ${
                          item.dotColor === 'pink' 
                            ? 'border-[#DB5070]' 
                            : 'border-blue-600'
                        }`} />
                      )}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}