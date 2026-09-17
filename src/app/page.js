import HeroSection from '@/components/HeroSection';
import SpecialBenefits from '@/components/SpecialBenefits';
import FertilitySpecialists from '@/components/FertilitySpecialists';
import WhyChooseUs from '@/components/WhyChooseUs';
import BestIvfHospital from '@/components/BestIvfHospital';
import OurServices from '@/components/OurServices';
import IvfRecommended from '@/components/IvfRecommended';
import IvfTreatmentProcess from '@/components/IvfTreatmentProcess';
import IvfTreatmentFaqs from '@/components/IvfTreatmentFaqs';
import RealStories from '@/components/RealStories';
import Location from '@/components/Location';
export default function Home() {
  return (
    <main>
      <HeroSection />
      <SpecialBenefits />
      <FertilitySpecialists />
      <WhyChooseUs />
      <BestIvfHospital />
      <OurServices />
      <IvfRecommended />
      <IvfTreatmentProcess />
      <IvfTreatmentFaqs />
      <RealStories />
      <Location />
    </main>
  );
}