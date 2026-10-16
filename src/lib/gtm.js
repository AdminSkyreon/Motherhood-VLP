import { analyticsConfig, buildLeadConversionPayload } from "./analytics-config";
import { ensureGtmLoaded } from "./ensure-gtm";

export function pushToDataLayer(data) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

/** Fire generate_lead on thank-you (including refresh). */
export function trackGenerateLead(
  pageId,
  confirmation,
  extras
) {
  ensureGtmLoaded(analyticsConfig.gtmId);
  pushToDataLayer(buildLeadConversionPayload(pageId, confirmation.requestId, extras));
}