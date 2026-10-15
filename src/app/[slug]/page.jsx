import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

import HeroSection from '../../components/HeroSection';
import SpecialBenefits from '../../components/SpecialBenefits';
import FertilitySpecialists from '../../components/FertilitySpecialists';
import WhyChooseUs from '../../components/WhyChooseUs';
import BestIvfHospital from '../../components/BestIvfHospital';
import OurServices from '../../components/OurServices';
import IvfRecommended from '../../components/IvfRecommended';
import IvfTreatmentProcess from '../../components/IvfTreatmentProcess';
import IvfTreatmentFaqs from '../../components/IvfTreatmentFaqs';
import RealStories from '../../components/RealStories';
import Location from '../../components/Location';
import Footer from '../../components/Footer';

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
      {/* 1. Hero Section & Form */}
      {heroForm?.enabled && <HeroSection header={header} heroForm={heroForm} />}
      
      {/* 2. Special Benefits */}
      {specialBenefits?.enabled && <SpecialBenefits data={specialBenefits} />}
      
      {/* 3. Doctors List */}
      {doctors?.enabled && <FertilitySpecialists data={doctors} />}
      
      {/* 4. Our Services */}
      {ourServices?.enabled && <OurServices data={ourServices} />}
      
      {/* 5. IVF Treatment Process */}
      {ivfProcess?.enabled && <IvfTreatmentProcess data={ivfProcess} />}
      
      {/* 6. IVF Couples Facing Issues */}
      {ivfRecommended?.enabled && <IvfRecommended data={ivfRecommended} />}
      
      {/* 7. Best IVF Hospital */}
      {bestIvfHospital?.enabled && <BestIvfHospital data={bestIvfHospital} />}
      
      {/* 8. FAQ */}
      {ivfFaqs?.enabled && <IvfTreatmentFaqs data={ivfFaqs} />}
      
      {/* 9. Why Choose Us */}
      {whyChooseUs?.enabled && <WhyChooseUs data={whyChooseUs} />}
      
      {/* 10. Reviews (RealStories) */}
      {realStories?.enabled && <RealStories data={realStories} />}
      
      {/* 11. Locations */}
      {location?.enabled && <Location data={location} />}
      
      {/* 12. Footer */}
      {footer?.enabled && <Footer data={footer} />}
    </main>
  );
}