import { z } from "zod";

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
    pageSections: z.any().optional(),
  }),
  hero: z.object({
    heroImageAlt: z.string().optional(),
  }).optional(),
  lead: z.any().optional(),
});