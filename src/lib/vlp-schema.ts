import { z } from "zod";

export type VlpLead = {
  hospitalId: string;
  source: string;
  method?: string;
  omitEmptyFields?: boolean;
  websiteCode?: string;
  locationCode?: string;
  endpoint?: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
  payload?: Record<string, string | number | boolean>;
  unitnameC?: string;
  doctorCrmField?: string;
  formEnquiryType?: string;
  formEnquirySubtype?: string;
  enquirySource?: string;
  formCampaignName?: string;
};

export type PageSectionFlags = {
  hero?: boolean;
  benefitsStrip?: boolean;
  statsBar?: boolean;
  about?: boolean;
  doctors?: boolean;
  services?: boolean;
  conditions?: boolean;
  treatmentProcess?: boolean;
  faq?: boolean;
  testimonials?: boolean;
  branches?: boolean;
  location?: boolean;
  footer?: boolean;
  stickyCta?: boolean;
};

export const vlpPageSchema = z.object({
  site: z.object({
    slug: z.string(),
    route: z.string().optional(),
    hospitalName: z.string(),
    hospitalShortName: z.string(),
    brandName: z.string(),
    chainName: z.string(),
    regionLabel: z.string(),
    address: z.string(),
    phone: z.object({
      display: z.string(),
      tel: z.string(),
    }),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      keywords: z.array(z.string()).optional(),
      openGraph: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        siteName: z.string().optional(),
        locale: z.string().optional(),
        images: z.array(
          z.object({
            url: z.string(),
            width: z.number().optional(),
            height: z.number().optional(),
            alt: z.string().optional(),
          })
        ).optional(),
      }).optional(),
    }),
    assets: z.object({
      heroImageSrc: z.string().optional(),
    }),
    pageSections: z.custom<PageSectionFlags>().optional(),
  }),
  hero: z.object({
    heroImageAlt: z.string().optional(),
  }).optional(),
  lead: z.custom<VlpLead>().optional(),
});

export type VlpPageConfig = z.infer<typeof vlpPageSchema>;