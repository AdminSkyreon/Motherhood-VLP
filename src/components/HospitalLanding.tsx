import HeroSection from "@/components/HeroSection";
import { hospitalToLeadContext, resolvePageLead } from "@/lib/submit-lead";
import SpecialBenefits from "@/components/SpecialBenefits";
import FertilitySpecialists from "@/components/FertilitySpecialists";
import WhyChooseUs from "@/components/WhyChooseUs";
import BestIvfHospital from "@/components/BestIvfHospital";
import OurServices from "@/components/OurServices";
import IvfRecommended from "@/components/IvfRecommended";
import IvfTreatmentProcess from "@/components/IvfTreatmentProcess";
import IvfTreatmentFaqs from "@/components/IvfTreatmentFaqs";
import RealStories from "@/components/RealStories";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import type { HospitalPage } from "@/types/sections";

export default function HospitalLanding({ hospital }: { hospital: HospitalPage }) {
  const {
    header,
    heroForm,
    specialBenefits,
    doctors,
    whyChooseUs,
    bestIvfHospital,
    ourServices,
    ivfRecommended,
    ivfProcess,
    ivfFaqs,
    realStories,
    location,
    footer,
  } = hospital.sections || {};

  return (
    <main className="min-h-screen text-gray-800">
      {heroForm?.enabled && (
        <HeroSection
          header={header}
          heroForm={heroForm}
          lead={resolvePageLead(hospital)}
          hospital={hospitalToLeadContext(hospital)}
          slug={hospital.slug}
        />
      )}

      {specialBenefits?.enabled && <SpecialBenefits data={specialBenefits} />}
      {doctors?.enabled && <FertilitySpecialists data={doctors} />}
      {ourServices?.enabled && <OurServices data={ourServices} />}
      {ivfProcess?.enabled && <IvfTreatmentProcess data={ivfProcess} />}
      {ivfRecommended?.enabled && <IvfRecommended data={ivfRecommended} />}
      {bestIvfHospital?.enabled && <BestIvfHospital data={bestIvfHospital} />}
      {ivfFaqs?.enabled && <IvfTreatmentFaqs data={ivfFaqs} />}
      {whyChooseUs?.enabled && <WhyChooseUs data={whyChooseUs} />}
      {realStories?.enabled && <RealStories data={realStories} />}
      {location?.enabled && <Location data={location} />}
      {footer?.enabled && <Footer data={footer} />}
    </main>
  );
}
