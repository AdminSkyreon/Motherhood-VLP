'use client';
import React from 'react';
import { assetUrl } from '@/lib/assetUrl';

export default function Location({ data }) {
  if (!data) {
    return null;
  }

  const handleBookNowClick = (e) => {
    e.preventDefault();
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
      if (data.bookAction?.link) {
        window.location.href = data.bookAction.link;
      }
    }
  };

  return (
    <section className="w-full py-8 md:py-12 px-4 bg-[#f4f7fb] relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center w-full">
        
        <div className="text-center mb-6 md:mb-8 w-full px-2">
          <h2 
            className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#111111] tracking-tight leading-tight" 
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {data.sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl items-start mx-auto">
          
          <div className="flex flex-col items-center w-full">
            <div className="w-full h-[240px] md:h-[280px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white border border-gray-100">
              <img 
                src={assetUrl(data.buildingImage)} 
                alt="Clinic Building Location" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mt-5 text-center px-2 max-w-md w-full">
              <address 
                className="not-italic text-[15px] md:text-[16px] text-[#231F20] font-normal leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {data.address}
              </address>
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            <div className="w-full h-[240px] md:h-[280px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white border border-gray-100 relative">
              <iframe
                title="Google Map Location"
                src={assetUrl(data.mapEmbedUrl)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 w-full">
              <a
                href={`tel:${data.callAction?.phoneNumber}`}
                className="flex-1 max-w-[160px] md:w-[140px] bg-[#DB5070] hover:bg-[#c24361] text-white font-bold py-3 px-3 rounded-full shadow-[0_4px_14px_rgba(219,80,112,0.35)] transition-all duration-300 flex items-center justify-center text-xs md:text-sm tracking-wide text-center"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <span>{data.callAction?.text}</span>
              </a>

              <a
                href={data.bookAction?.link || '#'}
                onClick={handleBookNowClick}
                className="flex-1 max-w-[160px] md:w-[140px] bg-[#0057A4] hover:bg-[#004080] text-white font-bold py-3 px-3 rounded-full shadow-[0_4px_14px_rgba(0,87,164,0.35)] transition-all duration-300 flex items-center justify-center text-xs md:text-sm tracking-wide text-center cursor-pointer"
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