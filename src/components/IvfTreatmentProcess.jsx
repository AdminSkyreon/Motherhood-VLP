'use client';
import React, { useEffect, useState, useRef } from 'react';
import { assetUrl } from '@/lib/assetUrl';

export default function IvfTreatmentProcess({ data }) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null); 
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

  // Agar JSON mein data ya steps nahi hain, toh section render nahi hoga
  if (!data || !data.steps || data.steps.length === 0) {
    return null;
  }

  const formatTitle = (title) => {
    const words = title.split(' ');
    if (words.length > 2) {
      const mid = Math.ceil(words.length / 2);
      return {
        line1: words.slice(0, mid).join(' '),
        line2: words.slice(mid).join(' '),
      };
    }
    return { line1: title, line2: '' };
  };

  return (
    <section 
      ref={sectionRef} 
      className="w-full pt-6 lg:pt-10 pb-4 lg:pb-6 relative z-30 overflow-hidden bg-[#f4f7fb]"
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center">
        
        {/* =====================================================
            SECTION TITLE & SUBTITLE 
        ===================================================== */}
        <div className={`text-center mb-6 lg:mb-8 transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#111111] mb-1 lg:mb-2 tracking-tight leading-tight" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {data.sectionTitle}
          </h2>
          {data.sectionSubtitle && (
            <p 
              className="hidden lg:block text-gray-600 text-base font-medium max-w-xl mx-auto px-4" 
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {data.sectionSubtitle}
            </p>
          )}
        </div>


        {/* =====================================================
            MOBILE VIEW: CIRCULAR GLASS-SLICE JOURNEY
        ===================================================== */}
        <div className="lg:hidden w-full flex flex-col items-center pt-0 pb-2">
          <div
            className="
              relative
              w-[92vw]
              max-w-[360px]
              aspect-square
              rounded-full
              border
              border-dashed
              border-pink-300
              bg-white
              shadow-[0_10px_30px_rgba(0,0,0,0.04)]
              overflow-hidden
            "
          >
            {/* Bluish-Glass Conic Gradient Slices */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                background: `
                  conic-gradient(
                    from -25.7deg,
                    #eaf2fb 0deg 49.4deg,
                    #ffffff 49.4deg 51.4deg,
                    #eaf2fb 51.4deg 100.8deg,
                    #ffffff 100.8deg 102.8deg,
                    #eaf2fb 102.8deg 152.2deg,
                    #ffffff 152.2deg 154.2deg,
                    #eaf2fb 154.2deg 203.6deg,
                    #ffffff 203.6deg 205.6deg,
                    #eaf2fb 205.6deg 255deg,
                    #ffffff 255deg 257deg,
                    #eaf2fb 257deg 306.4deg,
                    #ffffff 306.4deg 308.4deg,
                    #eaf2fb 308.4deg 357.8deg,
                    #ffffff 357.8deg 360deg
                  )
                `,
              }}
            />

            {/* Active Slice Highlight (Exact Slice Shape) */}
            {selectedIndex !== null && (
              <div 
                className="absolute inset-0 bg-pink-50/90 pointer-events-none transition-all duration-300 z-10"
                style={{
                  clipPath: 'polygon(50% 50%, 25% 0%, 75% 0%)',
                  transform: `rotate(${selectedIndex * (360 / data.steps.length)}deg)`,
                  transformOrigin: '50% 50%'
                }}
              />
            )}

            {/* Center Heart Component */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                w-[28%]
                aspect-square
                rounded-full
                bg-white
                border-2
                border-pink-100
                shadow-[0_4px_20px_rgba(236,72,153,0.18)]
                flex
                flex-col
                items-center
                justify-center
                z-30
              "
            >
              <div className="text-rose-500 mb-0.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className="text-[#0B2545] font-bold text-[9.5px] tracking-tight"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Your Journey
              </span>
            </div>

            {/* Mobile Steps mapped radially */}
            {data.steps.map((step, index) => {
              const angle = index * (360 / data.steps.length);
              const formatted = formatTitle(step.title);
              const isActive = selectedIndex === index;

              return (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className="absolute left-1/2 top-1/2 w-[32%] h-[32%] z-20 cursor-pointer"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-112%)`,
                  }}
                >
                  <div
                    className="w-full h-full flex flex-col items-center justify-center text-center px-1 rounded-xl transition-all duration-300"
                    style={{ transform: `rotate(${-angle}deg)` }}
                  >
                    <div className={`font-bold text-[11px] leading-none mb-1 px-1.5 py-0.5 rounded-full transition-colors duration-300 ${
                      isActive ? 'bg-rose-500 text-white shadow-sm' : 'text-[#0B2545]'
                    }`}>
                      {step.stepNumber}
                    </div>

                    <div className="relative w-[22px] h-[22px] mb-1 flex items-center justify-center">
                      <img
                        src={assetUrl(isActive && step.activeIcon ? step.activeIcon : step.icon)}
                        alt={step.title}
                        className="w-full h-full object-contain transition-transform duration-300"
                      />
                    </div>

                    <div
                      className={`font-semibold text-[9.5px] leading-[1.15] text-center max-w-[90px] transition-colors duration-300 ${
                        isActive ? 'text-rose-600 font-bold' : 'text-[#0B2545]'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <div>{formatted.line1}</div>
                      {formatted.line2 && <div>{formatted.line2}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Active Step Description Display */}
          {selectedIndex !== null && (
            <div className="w-full text-center mt-4 px-4 transition-all duration-500">
              <h3 className="text-rose-600 font-bold text-base mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {data.steps[selectedIndex].title}
              </h3>
              <div className="w-8 h-[2px] bg-rose-500 mx-auto mb-2 rounded-full"></div>
              <p className="text-gray-600 text-xs leading-relaxed max-w-xs mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {data.steps[selectedIndex].description}
              </p>
            </div>
          )}
        </div>


        {/* =====================================================
            DESKTOP VIEW: HORIZONTAL TIMELINE
        ===================================================== */}
        <div className="hidden lg:block w-full overflow-x-auto pb-2 pt-1 scrollbar-hide">
          <div className="flex items-start justify-between min-w-[1150px] px-14 relative">
            
            {/* Horizontal Connecting Line */}
            <div className="absolute top-[108px] left-28 right-28 h-[2px] bg-[#d5e0ee] z-0 pointer-events-none"></div>

            {/* Line Dots properly positioned between steps */}
            <div className="absolute top-[108px] left-28 right-28 z-10 pointer-events-none grid grid-cols-6">
              {data.steps.slice(0, -1).map((_, i) => (
                <div key={i} className="flex justify-center items-center relative">
                  <div className={`w-3 h-3 rounded-full border-2 border-[#f4f7fb] shadow-sm absolute -top-[5px] transition-colors duration-300 ${
                    selectedIndex !== null && i === selectedIndex ? 'bg-rose-500' : 'bg-[#152449]'
                  }`}></div>
                </div>
              ))}
            </div>

            {data.steps.map((step, index) => {
              const isActive = selectedIndex === index;

              return (
                <div 
                  key={index} 
                  onClick={() => setSelectedIndex(index)}
                  className={`flex flex-col items-center relative group cursor-pointer transition-all duration-500 transform w-[150px] flex-shrink-0 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  {/* Step Number Badge */}
                  <div className="flex flex-col items-center mb-3 h-12 justify-end z-10">
                    <div className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-full text-xs font-bold flex items-center justify-center shadow-md transition-all duration-300 ${
                      isActive ? 'bg-rose-500 text-white scale-110 shadow-rose-200' : 'bg-[#152449] text-white'
                    }`}>
                      {step.stepNumber}
                    </div>
                    <div className={`w-[2px] h-3 border-l-2 border-dotted mt-1 transition-colors duration-300 ${
                      isActive ? 'border-rose-400' : 'border-gray-300'
                    }`}></div>
                  </div>

                  {/* Main Circular Icon Card */}
                  <div className="relative flex items-center justify-center z-20">
                    <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                      isActive ? 'border-rose-400 shadow-[0_8px_30px_rgba(236,72,153,0.2)] ring-4 ring-rose-50' : 'border-gray-100'
                    }`}>
                      <img 
                        src={assetUrl(isActive && step.activeIcon ? step.activeIcon : step.icon)} 
                        alt={step.title} 
                        className="w-11 h-11 md:w-13 md:h-13 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Title, Dash & Smooth Animated Description Under Each Step */}
                  <div className="mt-4 text-center w-full z-10 flex flex-col items-center">
                    <h3 
                      className={`font-bold text-xs md:text-[13px] leading-snug mb-2 transition-colors duration-300 min-h-[36px] flex items-center justify-center ${
                        isActive ? 'text-rose-600 font-extrabold' : 'text-[#152449]'
                      }`}
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {step.title}
                    </h3>
                    
                    <div className={`w-5 h-[2px] mx-auto rounded-full transition-all duration-300 mb-2 ${
                      isActive ? 'bg-rose-500 w-8' : 'bg-gray-300'
                    }`}></div>

                    {/* Smooth fading and sliding description */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden text-center w-full ${
                      isActive ? 'opacity-100 max-h-40 translate-y-0' : 'opacity-0 max-h-0 -translate-y-2 pointer-events-none'
                    }`}>
                      <p 
                        className="text-gray-600 text-xs md:text-sm leading-relaxed px-1" 
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
}