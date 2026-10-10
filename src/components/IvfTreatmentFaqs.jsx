'use client';
import React, { useState } from 'react';

export default function IvfTreatmentFaqs({ data }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Agar JSON mein data ya faqs nahi hain, toh section render nahi hoga
  if (!data || !data.faqs || data.faqs.length === 0) {
    return null;
  }

  return (
    <section className="w-full pt-0 pb-6 md:pb-8 px-4 bg-[#f4f7fb] relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center w-full">
        
        {/* Section Heading with tighter margin */}
        <div className="text-center mb-3 w-full">
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#111111] tracking-tight leading-tight" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {data.sectionTitle}
          </h2>
        </div>

        {/* FAQs Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full max-w-6xl items-start">
          {data.faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                onClick={() => toggleAccordion(index)}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer bg-white w-full ${
                  isOpen 
                    ? 'border-[#DB5070]/50 shadow-[0_12px_30px_rgba(219,80,112,0.12)]' 
                    : 'border-gray-100 hover:border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.06)]'
                }`}
              >
                {/* Left Active Indicator Bar (#DB5070) */}
                {isOpen && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#DB5070] z-10" />
                )}

                {/* FAQ Header Card */}
                <div className="flex items-center justify-between py-4 px-4 md:px-5 bg-white gap-3">
                  <div className="flex items-center min-w-0 flex-1">
                    <h3 
                      className="font-bold text-sm md:text-base text-[#111111] leading-snug break-words" 
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {faq.question}
                    </h3>
                  </div>

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
                  className={`transition-all duration-500 ease-in-out overflow-hidden px-4 md:px-5 border-t ${
                    isOpen ? 'max-h-[500px] pb-4 opacity-100 border-[#FFF4F8]' : 'max-h-0 pb-0 opacity-0 border-transparent'
                  }`}
                  style={{ backgroundColor: isOpen ? '#FFF4F8' : '#ffffff' }}
                >
                  <div className="pt-2">
                    <p 
                      className="text-gray-600 text-xs md:text-sm leading-relaxed break-words" 
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