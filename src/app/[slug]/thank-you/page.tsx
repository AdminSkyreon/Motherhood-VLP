import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export async function generateStaticParams() {
  try {
    const hospitalsDir = path.join(process.cwd(), 'src', 'data', 'hospitals');
    return fs
      .readdirSync(hospitalsDir)
      .filter((filename) => filename.endsWith('.json') && !filename.startsWith('_'))
      .map((filename) => ({
        slug: filename.replace(/\.json$/, ''),
      }));
  } catch {
    return [];
  }
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || 'bangalore';

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-pink-200 shadow-xl text-center flex flex-col items-center">
        {/* Pink Badge */}
        <div className="w-16 h-16 bg-pink-50 text-[#DB5070] rounded-full flex items-center justify-center mb-4 shadow-sm border border-pink-100">
          <CheckCircle2 size={36} />
        </div>

        {/* Consultation Requested Tag */}
        <div className="inline-block bg-pink-50 border border-pink-100 text-[#DB5070] text-xs font-semibold px-4 py-1.5 rounded-full mb-3 tracking-wide">
          + CONSULTATION REQUESTED
        </div>

        <h1 className="text-2xl font-bold text-[#1d3557] mb-2">Thank You!</h1>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          Our care team has received your request and will call you shortly to confirm your consultation.
        </p>

        <Link
          href={`/${slug}`}
          className="inline-block w-full bg-[#DB5070] hover:bg-[#c2425e] text-white font-semibold py-2.5 rounded-full shadow-lg transition-all text-sm cursor-pointer"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}