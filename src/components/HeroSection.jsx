'use client';

import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { assetUrl } from '@/lib/assetUrl';

export default function HeroSection({ header, heroForm }) {
  const [formData, setFormData] = useState({
    fullName: '',
    language: 'English',
    phone: '',
    consent: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    setIsSubmitted(true);
  };

  const hlsVideoSrc = assetUrl('/playlist.m3u8');

  if (!heroForm) return null;

  return (
    <div
      className="
        bg-gray-50
        flex
        flex-col
        pt-[68px]
        md:pt-[76px]
        overflow-x-hidden
      "
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* ================= HEADER ================= */}
      <header
        className="
          w-full
          bg-white
          shadow-sm
          py-3
          px-4
          sm:px-6
          md:px-12
          flex
          justify-between
          items-center
          fixed
          top-0
          left-0
          right-0
          z-50
          box-border
        "
      >
        <div className="flex items-center">
          <img
            src={assetUrl(header?.logoImg)}
            alt={header?.logoAlt}
            className="h-8 sm:h-10 md:h-12 object-contain"
          />
        </div>

        <a
          href={`tel:${header?.phoneNumber}`}
          className="
            bg-[#DB5070]
            hover:bg-[#c2425e]
            text-white
            font-bold
            px-4
            sm:px-6
            py-2
            md:py-2.5
            rounded-full
            flex
            items-center
            gap-1.5
            sm:gap-2
            text-sm
            sm:text-base
            md:text-lg
            shadow-[0_8px_20px_rgba(219,80,112,0.35)]
            transition-all
            duration-200
          "
        >
          <Phone
            size={18}
            className="sm:w-5 sm:h-5"
            strokeWidth={2.5}
          />
          <span>{header?.phoneNumber}</span>
        </a>
      </header>

      {/* ================= HERO ================= */}
      <main
        className="
          w-full
          max-w-7xl
          mx-auto
          px-0
          sm:px-4
          md:px-8
          pt-1
          sm:pt-2
          pb-0
          grid
          grid-cols-1
          lg:grid-cols-12
          gap-3
          lg:gap-5
          items-stretch
          box-border
        "
      >
        {/* ================= VIDEO ================= */}
        <div
          className="
            lg:col-span-7
            w-full
            flex
            flex-col
          "
        >
          <div
            className="
              w-full
              aspect-video
              bg-black
              overflow-hidden
              rounded-none
              sm:rounded-2xl
              lg:rounded-3xl
              border-0
              shadow-none
              sm:shadow-[0_10px_35px_rgba(219,80,112,0.18)]
              relative
              flex-grow
            "
          >
            <VideoPlayer src={hlsVideoSrc} />
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div
          className="
            lg:col-span-5
            w-full
            flex
            flex-col
            justify-between
            px-4
            sm:px-0
          "
        >
          {/* Form Title */}
          <h2
            className="
              font-bold
              text-[#231F20]
              mb-2
              text-center
              leading-tight
              text-[20px]
              sm:text-[22px]
              md:text-[25px]
            "
          >
            <span className="block">
              {heroForm.titlePart1}
            </span>
            <span className="block">
              {heroForm.titlePart2}
            </span>
          </h2>

          {/* Form Container */}
          <div
            className="
              bg-white
              p-4
              sm:p-5
              rounded-2xl
              lg:rounded-3xl
              border
              border-pink-200
              flex
              flex-col
              justify-center
              shadow-[0_10px_35px_rgba(59,130,246,0.12)]
              w-full
            "
          >
            {isSubmitted ? (
              <div
                className="
                  w-full
                  text-center
                  py-12
                  px-4
                  bg-green-50
                  rounded-2xl
                  border
                  border-green-200
                "
              >
                <p className="text-[#166534] text-lg md:text-xl font-medium">
                  {heroForm.successMessage}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-2.5 w-full"
              >
                {/* ================= FULL NAME ================= */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#231F20] mb-1">
                    {heroForm.fields.fullName}
                  </label>

                  <input
                    type="text"
                    placeholder={heroForm.fields.fullName}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fullName: e.target.value,
                      })
                    }
                    required
                    className="
                      w-full
                      px-3.5
                      py-2
                      rounded-xl
                      border
                      border-pink-200
                      bg-white
                      focus:outline-none
                      focus:ring-1
                      focus:ring-[#DB5070]
                      text-[#7AA2E3]
                      text-sm
                      placeholder:text-[#7AA2E3]
                    "
                  />
                </div>

                {/* ================= LANGUAGE ================= */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#231F20] mb-1">
                    {heroForm.fields.language}
                  </label>

                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        language: e.target.value,
                      })
                    }
                    className="
                      w-full
                      px-3.5
                      py-2
                      rounded-xl
                      border
                      border-pink-200
                      bg-white
                      focus:outline-none
                      focus:ring-1
                      focus:ring-[#DB5070]
                      text-gray-800
                      text-sm
                    "
                  >
                    {heroForm.fields.languagesList.map(
                      (lang, index) => (
                        <option key={index} value={lang}>
                          {lang}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* ================= PHONE ================= */}
                <div>
                  <label className="block text-[12px] font-semibold text-[#231F20] mb-1">
                    {heroForm.fields.phone}
                  </label>

                  <div
                    className="
                      flex
                      rounded-xl
                      border
                      border-pink-200
                      overflow-hidden
                      focus-within:ring-1
                      focus-within:ring-[#DB5070]
                      bg-white
                    "
                  >
                    <span
                      className="
                        px-3
                        flex
                        items-center
                        text-gray-800
                        font-semibold
                        text-sm
                        border-r
                        border-pink-200
                        bg-white
                      "
                    >
                      +91
                    </span>

                    <input
                      type="tel"
                      placeholder={heroForm.fields.phone}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      required
                      className="
                        w-full
                        px-3.5
                        py-2
                        bg-white
                        focus:outline-none
                        text-[#7AA2E3]
                        text-sm
                        placeholder:text-[#7AA2E3]
                      "
                    />
                  </div>
                </div>

                {/* ================= CONSENT ================= */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consent: e.target.checked,
                      })
                    }
                    required
                    style={{ accentColor: '#DB5070' }}
                    className="mt-0.5 h-4 w-4 cursor-pointer"
                  />

                  <label
                    htmlFor="consent"
                    className="
                      text-[11px]
                      text-gray-600
                      leading-tight
                      cursor-pointer
                    "
                  >
                    {heroForm.consentText}
                  </label>
                </div>

                {/* ================= SUBMIT ================= */}
                <button
                  type="submit"
                  className="
                    w-full
                    bg-[#DB5070]
                    hover:bg-[#c2425e]
                    text-white
                    font-semibold
                    py-2.5
                    rounded-full
                    shadow-lg
                    transition-all
                    mt-1
                    text-sm
                    md:text-base
                    cursor-pointer
                  "
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