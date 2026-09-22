'use client';
import React, { useEffect, useState, useRef } from 'react';

export default function OurServices({ data }) {
  const [isVisible, setIsVisible] = useState(false);
  // activeCard state track karegi ki kaunsa card click hua hai
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

  // Agar JSON mein data ya services nahi hain, toh section render nahi hoga
  if (!data || !data.services || data.services.length === 0) {
    return null;
  }

  // Card par click handle karne ke liye function
  const handleCardClick = (index) => {
    // Agar wahi card dubara click ho to band ho jaye, warna naya open ho
    setActiveCard(activeCard === index ? null : index);
  };

  return (
    <section 
      ref={sectionRef} 
      className="w-full pt-4 pb-16 md:pb-20 relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${data.backgroundImage})` }}
    >
      {/* Light overlay to keep the fixed background bright and clean */}
      <div className="absolute inset-0 bg-white/50"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
        
        {/* Section Title placed right at the top */}
        <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] text-center mb-5 md:mb-7 leading-tight transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          {data.sectionTitle}
        </h2>

        {/* Services Grid */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {data.services.map((item, index) => {
            const isLast = index === data.services.length - 1;
            const isActive = activeCard === index; // Check if this specific card is active

            return (
              <div 
                key={index}
                onClick={() => handleCardClick(index)} // Click Event yaha hai
                className={`bg-white/95 cursor-pointer backdrop-blur-md rounded-2xl shadow-[0_6px_22px_rgba(0,0,0,0.05)] border border-white/60 hover:shadow-[0_10px_28px_rgba(219,80,112,0.12)] transition-all duration-500 flex ${
                  isLast 
                    ? `col-span-2 mx-auto w-[85%] max-w-sm flex-row px-5 py-3 lg:col-span-1 lg:w-full lg:flex-col lg:text-center lg:px-5 lg:py-5.5 ${isActive ? 'items-start' : 'items-center'}` 
                    : 'flex-col items-center text-center px-4 py-4 lg:px-5 lg:py-5.5'
                } group transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Pink Icon Circle Wrapper */}
                <div className={`rounded-full bg-pink-50 flex items-center justify-center border border-pink-100 transition-transform duration-300 group-hover:scale-110 shadow-inner ${
                  isLast ? `w-10 h-10 lg:w-12 lg:h-12 mr-4 lg:mr-0 lg:mb-2.5 flex-shrink-0 ${isActive ? 'mt-1 lg:mt-0' : ''}` : 'w-11 h-11 lg:w-12 lg:h-12 mb-2.5 flex-shrink-0'
                }`}>
                  <img 
                    src={item.icon} 
                    alt={item.title} 
                    className="w-4.5 h-4.5 lg:w-6 lg:h-6 object-contain"
                  />
                </div>

                {/* Text Content */}
                <div className={`${isLast ? 'text-left lg:text-center w-full' : 'text-center w-full'}`}>
                  {/* Service Title (Turns Pink when Clicked/Active) */}
                  <h3 
                    className={`font-bold mb-0.5 transition-colors duration-300 ${
                      isActive ? 'text-[#db5070]' : 'text-[#152449]'
                    }`}
                    style={{
                      fontSize: '14.5px',
                      fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif'
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  {item.subtitle && (
                    <p 
                      className={`text-[11px] md:text-xs leading-snug transition-colors duration-300 ${
                        isActive ? 'text-gray-700 font-medium' : 'text-gray-500'
                      }`}
                      style={{
                        fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif'
                      }}
                    >
                      {item.subtitle}
                    </p>
                  )}

                  {/* Hidden Description (Smoothly expands on click using CSS Grid trick) */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out w-full ${
                      isActive ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p 
                        className="text-gray-700 text-xs md:text-[13px] leading-relaxed"
                        style={{ fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif' }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}