'use client';
import React, { useState } from 'react';
import data from '@/data/ivfFaqData.json';

export default function IvfTreatmentFaqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Helper function to generate SVG icons with dynamic color based on open state
  const getFaqIcon = (index, isOpen) => {
    const color = isOpen ? '#DB5070' : '#152449';
    const icons = [
      // 1. Target / Cycles
      <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
      // 2. Bed / Rest
      <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>,
      // 3. Lab / Test Tube
      <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M9 3h6M10 9h4M10 3v6a4 4 0 0 0-4 4v1a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4V3"/></svg>,
      // 4. User / Working Women
      <svg key="4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      // 5. Success / Chart
      <svg key="5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
      // 6. Shield / Side Effects
      <svg key="6" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      // 7. Cost / Rupee symbol
      <svg key="7" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M6 3h12M6 8h12M6 13h7a4 4 0 0 1 0 8H6M10 13l6 8"/></svg>,
      // 8. Natural / Message Bubble
      <svg key="8" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    ];
    return icons[index % icons.length];
  };

  return (
    <section className="w-full pt-0 pb-6 md:pb-8 px-4 bg-[#f4f7fb] relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Heading with tighter margin */}
        <div className="text-center mb-3">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#111111] tracking-tight leading-tight" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {data.sectionTitle}
          </h2>
        </div>

        {/* FAQs Grid Layout (2 Columns with tight gap) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 w-full max-w-6xl">
          {data.faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                onClick={() => toggleAccordion(index)}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 cursor-pointer bg-white ${
                  isOpen 
                    ? 'border-[#DB5070]/50 shadow-[0_12px_30px_rgba(219,80,112,0.12)]' 
                    : 'border-gray-100 hover:border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]'
                }`}
              >
                {/* Left Active Indicator Bar (#DB5070) */}
                {isOpen && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#DB5070] z-10" />
                )}

                {/* FAQ Header Card (Question Area - Always White) */}
                <div className="flex items-center justify-between py-3 px-4 md:px-5 bg-white">
                  <div className="flex items-center space-x-3.5">
                    {/* Main Icon Container - Changes background when open */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                      style={{ backgroundColor: isOpen ? '#FFE4E9' : '#DCF2FD' }}
                    >
                      {getFaqIcon(index, isOpen)}
                    </div>

                    {/* Question Title */}
                    <h3 
                      className="font-bold text-sm md:text-base text-[#111111] pr-2" 
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {faq.question}
                    </h3>
                  </div>

                  {/* Toggle Button (+ / -) */}
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-base font-light transition-all duration-300 flex-shrink-0 ${
                      isOpen ? 'bg-[#FFF4F8] text-[#DB5070] border border-[#DB5070]/30 rotate-180' : 'bg-[#DCF2FD] text-[#152449]'
                    }`}
                  >
                    {isOpen ? '−' : '+'}
                  </div>
                </div>

                {/* Smooth Expandable Answer Section */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden px-4 md:px-5 border-t ${
                    isOpen ? 'max-h-48 pb-4 opacity-100 border-[#FFF4F8]' : 'max-h-0 pb-0 opacity-0 border-transparent'
                  }`}
                  style={{ backgroundColor: isOpen ? '#FFF4F8' : '#ffffff' }}
                >
                  <div className="pl-[45px] pt-1">
                    <p 
                      className="text-gray-600 text-xs md:text-sm leading-relaxed" 
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {faq.answer}
                    </p>
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