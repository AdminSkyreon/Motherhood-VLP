import { analyticsConfig, buildLeadConversionPayload } from "./analytics-config";
import { ensureGtmLoaded } from "./ensure-gtm";

export function pushToDataLayer(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

/** Fire generate_lead on thank-you (including refresh). */
export function trackGenerateLead(
  pageId: string,
  confirmation: { requestId: string },
  extras?: { formCampaignName?: string; enquirySource?: string }
) {
  ensureGtmLoaded(analyticsConfig.gtmId);
  pushToDataLayer(buildLeadConversionPayload(pageId, confirmation.requestId, extras));
}