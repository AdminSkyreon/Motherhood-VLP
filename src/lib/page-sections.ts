const DEFAULT_SECTIONS = {
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

export function resolvePageSections(config: {
  site: { pageSections?: Record<string, boolean> };
}) {
  return {
    ...DEFAULT_SECTIONS,
    ...config.site.pageSections,
  };
}

export function isSectionEnabled(sections: Record<string, boolean>, key: string) {
  return sections[key] !== false;
}