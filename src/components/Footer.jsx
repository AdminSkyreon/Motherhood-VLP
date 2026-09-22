'use client';
import React from 'react';

export default function Footer({ data }) {
  if (!data) return null;

  return (
    <footer className="w-full bg-[#111827] text-gray-400 py-4 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-xs md:text-sm gap-1.5">
        
        {/* Top Line: Copyright, Hospital Name, Branch & Phone (Visible everywhere) */}
        <p className="text-gray-300">
          © 2026 {data.hospitalName} &bull; {data.branch} &bull; {data.phone}
        </p>

        {/* Bottom Line: Privacy Policy & Terms Links (Hidden on mobile, visible on desktop/md screens) */}
        <div className="hidden md:flex items-center justify-center gap-2 text-gray-400">
          <a href={data.links?.privacyPolicy || '#'} className="hover:text-white transition-colors">Privacy Policy</a>
          <span>|</span>
          <a href={data.links?.terms || '#'} className="hover:text-white transition-colors">Terms & Conditions</a>
        </div>

      </div>
    </footer>
  );
}