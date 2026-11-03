'use client';

import { Phone } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { assetUrl } from '@/lib/assetUrl';
import BookingFormCard from './BookingFormCard';
import type { HeroSectionProps } from '@/types/sections';

export default function HeroSection({ header, heroForm, lead, hospital, slug }: HeroSectionProps) {
  const videoSrc = assetUrl('/hospital-video.mp4');

  if (!heroForm) return null;

  return (
    <div
      className="
        bg-gray-50
        flex
        flex-col
        pt-[60px]
        md:pt-[68px]
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
          py-2.5
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
          pt-0
          sm:pt-3
          pb-2
          grid
          grid-cols-1
          lg:grid-cols-12
          gap-0
          lg:gap-5
          items-start
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
            "
          >
            <VideoPlayer src={videoSrc} />
          </div>
        </div>

        {/* ================= FORM CONTAINER ================= */}
        <div
          className="
            lg:col-span-5
            w-full
            flex
            flex-col
            px-4
            sm:px-0
            mt-3
            lg:mt-0
            items-center
            lg:items-stretch
          "
        >
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
              shadow-[0_10px_35px_rgba(59,130,246,0.12)]
              w-full
              max-w-md
              lg:max-w-[70%]
              lg:mx-auto
            "
          >
            {/* Form Internal Heading */}
            <h2
              className="
                font-bold
                text-[#0057A4]
                mb-3
                text-left
                leading-tight
                text-[16px]
                sm:text-[18px]
                md:text-[20px]
              "
            >
              <span className="block">
                {heroForm.titlePart1}
              </span>
              <span className="block">
                {heroForm.titlePart2}
              </span>
            </h2>

            <BookingFormCard
              heroForm={heroForm}
              lead={lead}
              hospital={hospital}
              slug={slug}
            />
          </div>
        </div>
      </main>
    </div>
  );
}