import type { HospitalContext, LeadConfig } from "@/types/leads";

export type HeaderData = {
  logoImg?: string;
  logoAlt?: string;
  phoneNumber?: string;
};

export type HeroFormData = {
  enabled?: boolean;
  titlePart1?: string;
  titlePart2?: string;
  fields: {
    fullName: string;
    language: string;
    phone: string;
    languagesList: string[];
  };
  consentText: string;
  buttonText: string;
};

export type SpecialBenefitsData = {
  title?: string;
  cards?: Array<{ icon: string; title: string; description: string }>;
};

export type DoctorItem = {
  ringIcon?: string;
  image?: string;
  name?: string;
  specialty?: string;
  theme?: string;
  qualification?: string;
  experience?: string;
  location?: string;
};

export type DoctorsData = {
  title?: string;
  items?: DoctorItem[];
  bookAction?: { link?: string };
};

export type WhyChooseData = {
  sectionTitle?: string;
  sectionHighlight?: string;
  stats?: Array<{ icon: string; label: string; number: string; dotColor?: string }>;
};

export type ServiceItem = {
  icon: string;
  title: string;
  subtitle?: string;
  description?: string;
};

export type OurServicesData = {
  sectionTitle?: string;
  backgroundImage?: string;
  services?: ServiceItem[];
};

export type RecommendedItem = {
  icon: string;
  activeIcon?: string;
  title: string;
  subtitle?: string;
};

export type IvfRecommendedData = {
  sectionTitleLine1?: string;
  sectionTitleLine2?: string;
  items?: RecommendedItem[];
};

export type ProcessStep = {
  title: string;
  description?: string;
  stepNumber?: string;
  icon: string;
  activeIcon?: string;
};

export type IvfProcessData = {
  sectionTitle?: string;
  sectionSubtitle?: string;
  steps?: ProcessStep[];
};

export type IvfFaqsData = {
  sectionTitle?: string;
  faqs?: Array<{ question: string; answer: string }>;
};

export type BestIvfHospitalData = {
  sectionTitle?: string;
  features?: Array<{ icon: string; title: string; description: string }>;
  overviewParagraphs?: string[];
};

export type Testimonial = {
  id?: string | number;
  comment?: string;
  author?: string;
};

export type RealStoriesData = {
  testimonialImage?: string;
  testimonials?: Testimonial[];
  ratings?: {
    google?: { rating?: string | number; reviewsCount?: string | number };
    practo?: { rating?: string | number; reviewsCount?: string | number };
  };
};

export type LocationData = {
  sectionTitle?: string;
  buildingImage?: string;
  address?: string;
  mapEmbedUrl?: string;
  callAction?: { phoneNumber?: string; text?: string };
  bookAction?: { link?: string; text?: string };
};

export type FooterData = {
  hospitalName?: string;
  branch?: string;
  phone?: string;
  links?: { privacyPolicy?: string; terms?: string };
};

type Toggleable<T> = T & { enabled?: boolean };

export type HospitalPage = {
  slug?: string;
  brand?: string;
  address?: string;
  lead?: LeadConfig;
  sections?: {
    header?: HeaderData;
    heroForm?: HeroFormData;
    specialBenefits?: Toggleable<SpecialBenefitsData>;
    doctors?: Toggleable<DoctorsData>;
    whyChooseUs?: Toggleable<WhyChooseData>;
    bestIvfHospital?: Toggleable<BestIvfHospitalData>;
    ourServices?: Toggleable<OurServicesData>;
    ivfRecommended?: Toggleable<IvfRecommendedData>;
    ivfProcess?: Toggleable<IvfProcessData>;
    ivfFaqs?: Toggleable<IvfFaqsData>;
    realStories?: Toggleable<RealStoriesData>;
    location?: Toggleable<LocationData>;
    footer?: Toggleable<FooterData>;
    booking?: { lead?: LeadConfig };
  };
};

export type HeroSectionProps = {
  header?: HeaderData;
  heroForm?: HeroFormData;
  lead?: LeadConfig;
  hospital?: HospitalContext;
  slug?: string;
};
