import { personalizeBookingText } from "./booking-confirmation";
import type { VlpPageConfig } from "./vlp-schema";

export function interpolatePageText(
  text: string,
  config: VlpPageConfig,
  extras?: { name?: string }
) {
  const { site } = config;
  let result = text
    .replace(/\{regionLabel\}/g, site.regionLabel)
    .replace(/\{hospitalShortName\}/g, site.hospitalShortName)
    .replace(/\{hospitalName\}/g, site.hospitalName)
    .replace(/\{phone\.display\}/g, site.phone.display);

  if (extras?.name !== undefined) {
    result = personalizeBookingText(result, extras.name);
  }

  return result;
}