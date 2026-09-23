'use client';
import React, { useEffect, useState, useRef } from 'react';
import { assetUrl } from '@/lib/assetUrl';

export default function BestIvfHospital({ data }) {
  const [isVisible, setIsVisible] = useState(false);
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

  // Agar JSON mein data, features ya overviewParagraphs nahi hain, toh section render nahi hoga
  if (!data || !data.features || !data.overviewParagraphs) {
    return null;
  }

  return (
    <section 
      ref={sectionRef} 
      className="w-full pt-0 pb-12 md:pb-16 my-0 bg-[#F0F5FA] md:bg-gradient-to-br md:from-blue-50/70 md:via-indigo-50/40 md:to-sky-50/50 shadow-sm relative overflow-x-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] text-center mb-4 md:mb-6 leading-tight transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
        }`}>
          {data.sectionTitle}
        </h2>

        {/* Main Content Grid with balanced gap */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center justify-center">
          
          {/* Left Side: Features Stack */}
          <div className={`lg:col-span-5 w-full flex flex-col gap-2.5 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            {data.features.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl px-3.5 py-3 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_25px_rgba(219,80,112,0.1)] transition-all duration-300 flex items-center gap-3.5 group hover:-translate-y-0.5 w-full max-w-lg"
              >
                {/* Icon Wrapper with clean zoom effect */}
                <div className="shrink-0 flex items-center justify-center">
                  <img 
                    src={assetUrl(item.icon)} 
                    alt={item.title} 
                    className="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Text Content */}
                <div className="flex flex-col justify-center">
                  <h3 
                    className="font-bold mb-0.5 leading-snug transition-colors duration-300"
                    style={{
                      fontSize: '15.04px',
                      color: '#152449',
                      fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="leading-snug"
                    style={{
                      fontSize: '13.12px',
                      color: '#6E7789',
                      fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Overview Description Box (Original Size Restored) */}
          <div className={`lg:col-span-7 w-full transition-all duration-1000 delay-200 transform ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.05)] flex flex-col justify-center space-y-4 w-full max-w-xl">
              {data.overviewParagraphs.map((para, index) => (
                <p 
                  key={index} 
                  className="leading-relaxed"
                  style={{
                    fontSize: '15.2px',
                    color: '#000000',
                    fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}