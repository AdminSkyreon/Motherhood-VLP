'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { buildCampaign, buildLeadMeta, submitLead } from '@/lib/submit-lead';
import type { HospitalContext, LeadConfig } from '@/types/leads';
import type { HeroFormData } from '@/types/sections';

type BookingFormCardProps = {
  heroForm: HeroFormData;
  lead?: LeadConfig;
  hospital?: Partial<HospitalContext>;
  slug?: string;
};

const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export default function BookingFormCard({ heroForm, lead, hospital, slug }: BookingFormCardProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    language: 'English',
    phone: '',
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    const name = formData.fullName.trim();
    const mobile = formData.phone.trim();

    if (!name) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!MOBILE_PATTERN.test(mobile)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    const leadConfig = lead ?? {};
    try {
      await submitLead({
        form: {
          name,
          mobile,
          language: formData.language,
          comment: '',
        },
        lead: leadConfig,
        hospital: hospital ?? {},
        campaign: buildCampaign(leadConfig.campaignDefaults),
        meta: buildLeadMeta(),
      });

      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'form_submit',
          form_name: 'Hero Lead Form',
        });
      }
    } catch (error) {
      console.error(
        'Submission Error:',
        error instanceof Error ? error.message : error
      );
    }

    router.push(`/${slug || 'bangalore'}/thank-you`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 w-full">
      {errorMessage && (
        <div className="p-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg text-center">
          {errorMessage}
        </div>
      )}

      <div>
        <label className="block text-[12px] font-semibold text-[#231F20] mb-1">
          {heroForm.fields.fullName}
        </label>
        <input
          id="fullNameInput"
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
            text-gray-800
            text-sm
            placeholder:text-gray-400
          "
        />
      </div>

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
          {heroForm.fields.languagesList.map((lang, index) => (
            <option key={index} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

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
            inputMode="numeric"
            maxLength={10}
            placeholder={heroForm.fields.phone}
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value.replace(/\D/g, ''),
              })
            }
            required
            className="
              w-full
              px-3.5
              py-2
              bg-white
              focus:outline-none
              text-gray-800
              text-sm
              placeholder:text-gray-400
            "
          />
        </div>
      </div>

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

      <button
        type="submit"
        disabled={isSubmitting}
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
          disabled:opacity-50
        "
      >
        {isSubmitting ? 'Submitting...' : heroForm.buttonText}
      </button>
    </form>
  );
}
