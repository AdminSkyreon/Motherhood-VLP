import { analyticsConfig, buildLeadConversionPayload } from "./analytics-config";
import type { BookingConfirmation } from "./booking-confirmation";
import { ensureGtmLoaded } from "./ensure-gtm";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushToDataLayer(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

/** Fire generate_lead on thank-you (including refresh). */
export function trackGenerateLead(
  pageId: string,
  confirmation: BookingConfirmation,
  extras?: { formCampaignName?: string; enquirySource?: string },
) {
  ensureGtmLoaded(analyticsConfig.gtmId);
  pushToDataLayer(buildLeadConversionPayload(pageId, confirmation.requestId, extras));
}