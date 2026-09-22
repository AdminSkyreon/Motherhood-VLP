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
    
    return filenames.map((filename) => ({
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
      {/* Passing both header and heroForm to HeroSection */}
      {heroForm?.enabled && <HeroSection header={header} heroForm={heroForm} />}
      {specialBenefits?.enabled && <SpecialBenefits data={specialBenefits} />}
      {doctors?.enabled && <FertilitySpecialists data={doctors} />}
      {whyChooseUs?.enabled && <WhyChooseUs data={whyChooseUs} />}
      {bestIvfHospital?.enabled && <BestIvfHospital data={bestIvfHospital} />}
      {ourServices?.enabled && <OurServices data={ourServices} />}
      {ivfRecommended?.enabled && <IvfRecommended data={ivfRecommended} />}
      {ivfProcess?.enabled && <IvfTreatmentProcess data={ivfProcess} />}
      {ivfFaqs?.enabled && <IvfTreatmentFaqs data={ivfFaqs} />}
      {realStories?.enabled && <RealStories data={realStories} />}
      {location?.enabled && <Location data={location} />}
      {footer?.enabled && <Footer data={footer} />}
    </main>
  );
}