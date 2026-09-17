'use client';
import React, { useRef, useState } from 'react';
import data from '@/data/realStoriesData.json';

export default function RealStories() {
  const scrollRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  // Duplicate data to create a seamless infinite loop effect
  const marqueeItems = [...data.testimonials, ...data.testimonials, ...data.testimonials];

  return (
    <section className="w-full py-4 md:py-6 px-4 bg-[#f4f7fb] relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-3 lg:mb-6 gap-3 lg:gap-6 items-center text-center lg:text-left">
          
          {/* Main Title */}
          <div className="w-full lg:w-auto pl-0 lg:pl-14">
            <h2 
              className="rv-title reveal is-visible text-[26px] md:text-[32px] font-bold text-[#111111] leading-snug tracking-tight mx-auto lg:mx-0"
              style={{ fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Real Stories. Real Joy. <br />
              Real Families.
            </h2>
          </div>

          {/* Rating Badges (Google & Practo) */}
          <div className="flex flex-row items-center justify-center lg:justify-end gap-2.5 sm:gap-4 w-full max-w-[350px] sm:max-w-md lg:w-auto mx-auto lg:mx-0 px-1 lg:pr-14">
            
            {/* Google Badge */}
            <div className="bg-white px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2 sm:space-x-3 flex-1 lg:flex-initial justify-center sm:justify-start whitespace-nowrap">
              <span className="font-bold text-sm sm:text-base tracking-tighter text-blue-600">
                <span className="text-blue-500">G</span>
                <span className="text-red-500">o</span>
                <span className="text-yellow-500">o</span>
                <span className="text-blue-500">g</span>
                <span className="text-green-500">l</span>
                <span className="text-red-500">e</span>
              </span>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-[#0B2545] text-xs sm:text-sm leading-none">
                  {data.ratings.google.rating}
                </span>
                <div className="flex flex-col">
                  <div className="flex text-amber-400 text-[8px] sm:text-[9px]">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-gray-500 text-[9px] sm:text-[10px] font-medium leading-tight mt-0.5">
                    {data.ratings.google.reviewsCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Practo Badge */}
            <div className="bg-white px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2 sm:space-x-2.5 flex-1 lg:flex-initial justify-center sm:justify-start whitespace-nowrap">
              <div className="flex items-center space-x-1 text-teal-400 font-bold text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"></span>
                <span className="text-blue-600 font-bold tracking-tight text-xs">practo</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block"></span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-[#0B2545] text-xs sm:text-sm leading-none">
                  {data.ratings.practo.rating}
                </span>
                <div className="flex flex-col">
                  <div className="flex text-amber-400 text-[8px] sm:text-[9px]">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-gray-500 text-[9px] sm:text-[10px] font-medium leading-tight mt-0.5">
                    {data.ratings.practo.reviewsCount}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>


        {/* ================= TESTIMONIALS CARDS MARQUEE ================= */}
        <div className="relative w-full overflow-hidden">
          
          {/* Inline CSS for Continuous Marquee & Edge Fade Mask */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes marqueeScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marqueeScroll 30s linear infinite;
            }
            .animate-marquee:hover {
              animation-play-state: paused;
            }
            .marquee-fade-mask {
              mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
              -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
            }
          `}} />

          {/* Mask Container to fade cards smoothly at left/right borders */}
          <div className="marquee-fade-mask w-full overflow-hidden py-1">
            <div className="animate-marquee flex items-stretch space-x-4">
              {marqueeItems.map((item, index) => {
                const uniqueKey = `${item.id}-${index}`;
                const isExpanded = expandedId === uniqueKey;

                return (
                  <div 
                    key={uniqueKey}
                    onMouseLeave={() => setExpandedId(null)}
                    className="flex-shrink-0 w-[230px] md:w-[250px] bg-gradient-to-b from-white via-white to-[#fff8f9] rounded-2xl p-3.5 shadow-[0_6px_16px_rgba(0,0,0,0.03)] border border-pink-100/60 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_32px_rgba(219,80,112,0.18)] hover:border-pink-200"
                  >
                    
                    {/* Absolute Positioned Clear & Raised Image in Background Corner */}
                    {data.testimonialImage && (
                      <div className="absolute bottom-1 -right-1 w-20 h-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                        <img 
                          src={data.testimonialImage} 
                          alt="Mother and Baby" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Top Section */}
                    <div className="relative z-10">
                      {/* Top Row: Quote Icon & 5 Star Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-5 h-5 rounded-full bg-[#EAF2FB] flex items-center justify-center text-blue-500 font-serif text-[10px]">
                          “
                        </div>
                        <div className="flex text-amber-400 text-[10px]">
                          {'★'.repeat(5)}
                        </div>
                      </div>

                      {/* Comment Text with proper spacing from stars */}
                      <div className="mb-2">
                        <p 
                          className={`text-gray-700 text-[11px] leading-snug font-medium transition-all duration-300 ${
                            isExpanded ? '' : 'line-clamp-3'
                          }`}
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {item.comment}
                        </p>
                      </div>

                      {/* Read More / Read Less Toggle Button */}
                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : uniqueKey)}
                        className="inline-flex items-center space-x-1 text-[#DB5070] text-[11px] font-bold cursor-pointer mb-3 bg-transparent border-none p-0 focus:outline-none"
                      >
                        <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                        <span className={`text-[12px] font-light leading-none transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          v
                        </span>
                      </button>
                    </div>

                    {/* Bottom Section: Author Details */}
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <div className="w-6 h-6 rounded-full bg-pink-100 text-[#DB5070] flex items-center justify-center border border-pink-200 flex-shrink-0">
                          <svg 
                            className="w-3.5 h-3.5 fill-current" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <h4 
                            className="font-bold text-[11px] text-[#0B2545] tracking-tight truncate"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                            title={item.author}
                          >
                            {item.author}
                          </h4>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}