import type { VlpPageConfig, PageSectionFlags } from "@/lib/vlp-schema";

export type SectionKey = keyof PageSectionFlags;

const DEFAULT_SECTIONS: Required<PageSectionFlags> = {
  hero: true,
  benefitsStrip: true,
  statsBar: true,
  about: true,
  doctors: true,
  services: true,
  conditions: true,
  treatmentProcess: true,
  faq: true,
  testimonials: true,
  branches: false,
  location: true,
  footer: true,
  stickyCta: true,
};

export function resolvePageSections(config: VlpPageConfig): Required<PageSectionFlags> {
  return {
    ...DEFAULT_SECTIONS,
    ...config.site.pageSections,
  };
}

export function isSectionEnabled(
  sections: Required<PageSectionFlags>,
  key: SectionKey
): boolean {
  return sections[key] !== false;
}