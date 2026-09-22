'use client';
import React, { useState } from 'react';
import { Phone } from 'lucide-react'; 
import VideoPlayer from './VideoPlayer';

export default function HeroSection({ header, heroForm }) {
  // State to manage form data
  const [formData, setFormData] = useState({
    fullName: '',
    language: 'English',
    phone: '',
    consent: false,
  });

  // State to track if the form has been successfully submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    setIsSubmitted(true);
  };

  const hlsVideoSrc = "/playlist.m3u8";

  // Fallback safety check if data is undefined
  if (!heroForm) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 md:pt-24" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-3 px-6 md:px-12 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <img 
            src={header?.logoImg} 
            alt={header?.logoAlt} 
            className="h-10 md:h-12 object-contain"
          />
        </div>
        <div>
          <a 
            href={`tel:${header?.phoneNumber}`}
            className="bg-[#DB5070] hover:bg-[#c2425e] text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-2 text-base md:text-lg shadow-[0_8px_20px_rgba(219,80,112,0.35)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <Phone size={20} strokeWidth={2.5} /> 
            <span>{header?.phoneNumber}</span>
          </a>
        </div>
      </header>

      {/* Hero Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
        
        {/* Left Side: Video Player with Pink Glass Glow/Shadow */}
        <div className="lg:col-span-7 bg-black rounded-3xl overflow-hidden aspect-video lg:aspect-auto lg:h-full relative flex items-center justify-center border border-pink-100 shadow-[0_10px_35px_rgba(219,80,112,0.18)]">
          <VideoPlayer src={hlsVideoSrc} />
        </div>

        {/* Right Side: Form / Thank You Message */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          {/* Form Title */}
          <h2 className="font-bold text-[#231F20] mb-3 text-center leading-tight text-[22px] md:text-[25px]">
            <span className="block whitespace-nowrap">{heroForm.titlePart1}</span>
            <span className="block">{heroForm.titlePart2}</span>
          </h2>

          {/* Form Container with Blue Glass Glow/Shadow effect */}
          <div className="bg-white p-5 rounded-3xl border border-pink-200 flex-1 flex flex-col justify-center items-center shadow-[0_10px_35px_rgba(59,130,246,0.12)]">
            {isSubmitted ? (
              // Show Thank You Message from JSON
              <div className="w-full text-center py-12 px-4 bg-green-50 rounded-2xl border border-green-200">
                <p className="text-[#166534] text-lg md:text-xl font-medium">
                  {heroForm.successMessage}
                </p>
              </div>
            ) : (
              // Show Form if NOT submitted
              <form onSubmit={handleSubmit} className="space-y-2.5 w-full">
                {/* Full Name Field */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#231F20] mb-1">
                    {heroForm.fields.fullName}
                  </label>
                  <input 
                    type="text" 
                    placeholder={heroForm.fields.fullName}
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#DB5070] text-[#7AA2E3] text-sm placeholder:text-[#7AA2E3]"
                  />
                </div>

                {/* Language Field */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#231F20] mb-1">
                    {heroForm.fields.language}
                  </label>
                  <select 
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-pink-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#DB5070] text-gray-800 text-sm"
                  >
                    {heroForm.fields.languagesList.map((lang, index) => (
                      <option key={index} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#231F20] mb-1">
                    {heroForm.fields.phone}
                  </label>
                  <div className="flex rounded-xl border border-pink-200 overflow-hidden focus-within:ring-1 focus-within:ring-[#DB5070] bg-white">
                    <span className="px-3 flex items-center text-gray-800 font-semibold text-sm border-r border-pink-200 bg-white">
                      +91
                    </span>
                    <input 
                      type="tel" 
                      placeholder={heroForm.fields.phone}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="w-full px-3.5 py-2 bg-white focus:outline-none text-[#7AA2E3] text-sm placeholder:text-[#7AA2E3]"
                    />
                  </div>
                </div>

                {/* Consent Checkbox with Pink Accent */}
                <div className="flex items-start gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    required
                    style={{ accentColor: '#DB5070' }}
                    className="mt-0.5 h-4 w-4 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-[11px] text-gray-600 leading-tight cursor-pointer">
                    {heroForm.consentText}
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="w-full bg-[#DB5070] hover:bg-[#c2425e] text-white font-semibold py-2.5 rounded-full shadow-lg transition-all mt-1 text-sm md:text-base"
                >
                  {heroForm.buttonText}
                </button>
              </form>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}