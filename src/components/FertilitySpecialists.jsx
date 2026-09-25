'use client';
import React, { useEffect, useState, useRef } from 'react';
import { GraduationCap, Stethoscope, MapPin, Calendar } from 'lucide-react';
import { assetUrl } from '@/lib/assetUrl';

export default function FertilitySpecialists({ data }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [showBookNow, setShowBookNow] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.top <= windowHeight * 0.75) {
          setShowBookNow(true);
        } else {
          setShowBookNow(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Shared Smooth Scroll Handler for Form Focus
  const scrollToForm = (e) => {
    if (e) e.preventDefault();
    const fullNameInput = document.getElementById('fullNameInput');
    
    if (fullNameInput) {
      const elementPosition = fullNameInput.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 120;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        fullNameInput.focus();
        fullNameInput.classList.add('ring-4', 'ring-[#DB5070]', 'border-[#DB5070]', 'transition-all', 'duration-500');
        
        setTimeout(() => {
          fullNameInput.classList.remove('ring-4', 'ring-[#DB5070]', 'border-[#DB5070]');
        }, 2000);
      }, 400);
      
    } else {
      if (data?.bookAction?.link) {
        window.location.href = data.bookAction.link;
      }
    }
  };

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="w-full pt-0 pb-4 md:pb-6 my-0 bg-[#F0F5FA] md:bg-gradient-to-br md:from-blue-50/70 md:via-indigo-50/40 md:to-sky-50/50 border-b border-blue-100/60 shadow-sm relative overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 pt-1 flex flex-col items-center">
        
        {/* Section Title */}
        <h2 className={`text-[24px] md:text-3xl lg:text-4xl font-bold text-[#111111] text-center mb-2 md:mb-3 max-w-[340px] md:max-w-none leading-tight transition-all duration-700 transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          {data.title || "Meet Our Fertility & IVF Specialists"}
        </h2>

        {/* Doctor Cards Container */}
        <div className={`w-full flex md:flex-wrap flex-nowrap overflow-x-auto md:overflow-visible justify-start md:justify-center items-start gap-4 pb-4 md:pb-0 px-2 scrollbar-thin transition-all duration-1000 transform ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {data.items.map((doc, index) => {
            const isActive = activeCard === index;

            return (
              <div 
                key={index}
                onClick={() => setActiveCard(activeCard === index ? null : index)}
                className={`bg-white rounded-[24px] p-4 md:p-5 border border-gray-100 shadow-[0_6px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(219,80,112,0.12)] transition-all duration-300 flex flex-col items-center text-center relative group hover:-translate-y-1 w-[280px] md:w-[320px] shrink-0 cursor-pointer select-none ${
                  isActive ? 'translate-y-1.5 shadow-[0_12px_30px_rgba(219,80,112,0.12)]' : ''
                }`}
              >
                {/* Doctor Image Container with Top Ring Icon */}
                <div className="relative mb-3 mt-1 transition-transform duration-500 group-hover:scale-105">
                  
                  {/* Top Corner Ring/Heart Icon */}
                  <div className="absolute -top-1.5 right-4 z-20 w-6 h-6 bg-white rounded-full p-0.5 shadow-sm border border-pink-100 flex items-center justify-center">
                    <img 
                      src={assetUrl(doc.ringIcon)} 
                      alt="ring icon" 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  {/* Circular Image Frame */}
                  <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full p-1 border-2 ${
                    doc.theme === 'pink' ? 'border-pink-300' : 'border-blue-300'
                  } flex items-center justify-center bg-gray-50 relative overflow-visible`}>
                    <img 
                      src={assetUrl(doc.image)} 
                      alt={doc.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                {/* Doctor Name */}
                <h3 className="text-base md:text-lg font-bold text-[#231F20] mb-1">
                  {doc.name}
                </h3>

                {/* Specialty Badge */}
                <div className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-semibold mb-3.5 ${
                  doc.theme === 'pink' 
                    ? 'bg-pink-50 text-[#DB5070] border border-pink-100' 
                    : 'bg-blue-50 text-blue-700 border border-blue-100'
                }`}>
                  {doc.specialty}
                </div>

                {/* Details List (Qualification, Experience, Location) */}
                <div className="w-full space-y-2 mb-4 text-left max-w-[280px]">
                  
                  {/* Qualification */}
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      doc.theme === 'pink' ? 'bg-pink-50 text-[#DB5070]' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <GraduationCap className="w-3 h-3" />
                    </div>
                    <span className={`font-medium text-gray-700 transition-all duration-300 leading-snug ${
                      isActive ? 'line-clamp-none' : 'line-clamp-1 group-hover:line-clamp-none'
                    }`}>
                      {doc.qualification}
                    </span>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      doc.theme === 'pink' ? 'bg-pink-50 text-[#DB5070]' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Stethoscope className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-gray-700 leading-snug">
                      {doc.experience}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      doc.theme === 'pink' ? 'bg-pink-50 text-[#DB5070]' : 'bg-blue-50 text-blue-600'
                    }`}>
                      <MapPin className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-gray-700 leading-snug">
                      {doc.location}
                    </span>
                  </div>

                </div>

                {/* Book Appointment Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToForm(e);
                  }}
                  className="w-full max-w-[280px] py-2 px-4 rounded-full bg-[#DB5070] hover:bg-[#c44463] text-white font-medium text-xs shadow-[0_4px_10px_rgba(219,80,112,0.3)] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book Appointment
                </button>

              </div>
            );
          })}
        </div>

      </div>

      {/* Vertical Fixed Sticky 'Book Now' Button - HIDDEN on Mobile, VISIBLE only on Desktop (lg+) */}
      <div className={`hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 transform ${
        showBookNow ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-10 pointer-events-none'
      }`}>
        <button 
          onClick={scrollToForm}
          className="bg-[#DB5070] hover:bg-[#c44463] text-white font-semibold py-3 px-2 rounded-l-xl shadow-[0_4px_20px_rgba(219,80,112,0.4)] [writing-mode:vertical-rl] tracking-widest text-xs uppercase transition-all duration-300 cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </section>
  );
}