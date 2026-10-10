import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

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
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  try {
    const hospitalsDir = path.join(process.cwd(), 'src', 'data', 'hospitals');
    const filenames = fs.readdirSync(hospitalsDir);
    
    return filenames
      .filter((filename) => filename.endsWith('.json') && !filename.startsWith('_'))
      .map((filename) => ({
        slug: filename.replace(/\.json$/, ''),
      }));
  } catch (error) {
    return [];
  }
}

function getHospitalBySlug(slug) {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'hospitals', `${slug}.json`);
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    return null;
  }
}

export default async function HospitalLocationPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const hospital = getHospitalBySlug(slug);
  if (!hospital) notFound();

  // Destructuring all sections including 'header'
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
    footer 
  } = hospital.sections || {};

  return (
    <main className="min-h-screen text-gray-800">
      {/* 1. VSL Video (HeroSection contains the video & form layout) */}
      {heroForm?.enabled && <HeroSection header={header} heroForm={heroForm} />}
      
      {/* 2. Contact Form (If rendered separately or integrated inside Hero/Form section as per layout) */}
      
      {/* 3. Special Benefits[cite: 6] */}
      {specialBenefits?.enabled && <SpecialBenefits data={specialBenefits} />}
      
      {/* 4. Doctors List[cite: 6] */}
      {doctors?.enabled && <FertilitySpecialists data={doctors} />}
      
      {/* 5. Our Services[cite: 6] */}
      {ourServices?.enabled && <OurServices data={ourServices} />}
      
      {/* 6. IVF Treatment Process[cite: 6] */}
      {ivfProcess?.enabled && <IvfTreatmentProcess data={ivfProcess} />}
      
      {/* 7. IVF Couples Facing Issues (ivfRecommended)[cite: 6] */}
      {ivfRecommended?.enabled && <IvfRecommended data={ivfRecommended} />}
      
      {/* 8. Best IVF Hospital in Bangalore[cite: 6] */}
      {bestIvfHospital?.enabled && <BestIvfHospital data={bestIvfHospital} />}
      
      {/* 9. FAQ[cite: 6] */}
      {ivfFaqs?.enabled && <IvfTreatmentFaqs data={ivfFaqs} />}
      
      {/* 10. Why Choose Motherhood Fertility & IVF[cite: 6] */}
      {whyChooseUs?.enabled && <WhyChooseUs data={whyChooseUs} />}
      
      {/* 11. Reviews (RealStories)[cite: 6] */}
      {realStories?.enabled && <RealStories data={realStories} />}
      
      {/* 12. Locations (Map & details)[cite: 6, 7] */}
      {location?.enabled && <Location data={location} />}
      
      {footer?.enabled && <Footer data={footer} />}
    </main>
  );
}