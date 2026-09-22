'use client';
import React from 'react';

export default function Location({ data }) {
  // Agar JSON mein data nahi hai, toh section render nahi hoga
  if (!data) {
    return null;
  }

  return (
    <section className="w-full py-8 md:py-12 px-4 bg-[#f4f7fb] relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 
            className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#111111] tracking-tight leading-tight" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {data.sectionTitle}
          </h2>
        </div>

        {/* Content Container (2 Columns: Building Location & Google Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl items-start">
          
          {/* Left Column: Building Image & Address */}
          <div className="flex flex-col items-center">
            {/* Image Box with Rounded Corners and Shadow */}
            <div className="w-full h-[240px] md:h-[280px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white border border-gray-100">
              <img 
                src={data.buildingImage} 
                alt="Clinic Building Location" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Address Text (Dynamic from data) */}
            <div className="mt-5 text-center px-4 max-w-md">
              <address 
                className="not-italic text-[16px] text-[#231F20] font-normal leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {data.address}
              </address>
            </div>
          </div>

          {/* Right Column: Google Map & Action Buttons */}
          <div className="flex flex-col items-center">
            {/* Google Map Box with Rounded Corners and Shadow */}
            <div className="w-full h-[240px] md:h-[280px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white border border-gray-100 relative">
              <iframe
                title="Google Map Location"
                src={data.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Action Buttons (Larger on mobile without stretching) */}
            <div className="mt-4 flex items-center justify-center gap-3.5 w-full">
              
              {/* Call Now Button */}
              <a
                href={`tel:${data.callAction?.phoneNumber}`}
                className="w-[150px] md:w-[140px] bg-[#DB5070] hover:bg-[#c24361] text-white font-bold py-3 px-4 rounded-full shadow-[0_4px_14px_rgba(219,80,112,0.35)] transition-all duration-300 flex items-center justify-center text-xs md:text-sm tracking-wide"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span>{data.callAction?.text}</span>
              </a>

              {/* Book Now Button */}
              <a
                href={data.bookAction?.link}
                className="w-[150px] md:w-[140px] bg-[#DB5070] hover:bg-[#c24361] text-white font-bold py-3 px-4 rounded-full shadow-[0_4px_14px_rgba(219,80,112,0.35)] transition-all duration-300 flex items-center justify-center text-xs md:text-sm tracking-wide"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span>{data.bookAction?.text}</span>
              </a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}