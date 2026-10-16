export const DEFAULT_GTM_ID = "";

export const analyticsConfig = {
  gtmId: process.env.NEXT_PUBLIC_GTM_ID?.trim() || DEFAULT_GTM_ID,

  conversion: {
    event: process.env.NEXT_PUBLIC_CONVERSION_EVENT ?? "generate_lead",
    leadType: "booking_form",
  },
};

export function buildLeadConversionPayload(
  slug,
  requestId,
  extras
) {
  return {
    event: analyticsConfig.conversion.event,
    lead_type: analyticsConfig.conversion.leadType,
    hospital_slug: slug,
    request_id: requestId,
    vertical: "vlp",
    ...(extras?.formCampaignName ? { form_campaign_name: extras.formCampaignName } : {}),
    ...(extras?.enquirySource ? { enquiry_source: extras.enquirySource } : {}),
  };
}