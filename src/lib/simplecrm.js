import { normalizeIndianMobile } from "./phone";

let tokenCache = null;

function trimTrailingSlash(url) {
  return url.replace(/\/+$/, "");
}

export function resolveSimpleCrmConfig() {
  const baseUrl = process.env.SIMPLECRM_BASE_URL?.trim();
  const clientId = process.env.SIMPLECRM_CLIENT_ID?.trim();
  const clientSecret = process.env.SIMPLECRM_CLIENT_SECRET?.trim();
  const username = process.env.SIMPLECRM_USERNAME?.trim();
  const password = process.env.SIMPLECRM_PASSWORD?.trim();
  const grantType =
    process.env.SIMPLECRM_GRANT_TYPE?.trim() === "client_credentials"
      ? "client_credentials"
      : "password";

  if (!baseUrl || !clientId || !clientSecret) return null;
  if (grantType === "password" && (!username || !password)) return null;

  return {
    baseUrl: trimTrailingSlash(baseUrl),
    clientId,
    clientSecret,
    username: username ?? "",
    password: password ?? "",
    grantType,
  };
}

export function isSimpleCrmConfigured() {
  return resolveSimpleCrmConfig() !== null;
}

function isEmptyAttributeValue(value) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function omitEmptyAttributes(
  attributes,
  omitEmpty
) {
  if (!omitEmpty) return attributes;

  return Object.fromEntries(
    Object.entries(attributes).filter(([, value]) => !isEmptyAttributeValue(value))
  );
}

function buildDescription(ctx, useDescriptionForDoctor) {
  const { form } = ctx;
  const doctorName = form.doctor?.trim() ?? "";
  const descriptionParts = [];

  const comment = form.comment?.trim();
  if (comment) descriptionParts.push(comment);
  if (form.planningForPregnancy) {
    descriptionParts.push(`Planning for pregnancy: ${form.planningForPregnancy}`);
  }
  if (form.tryingDuration) {
    descriptionParts.push(`Trying duration: ${form.tryingDuration}`);
  }
  if (form.biggestChallenge) {
    descriptionParts.push(`Biggest challenge: ${form.biggestChallenge}`);
  }
  if (form.lookingFor) {
    descriptionParts.push(`Looking for: ${form.lookingFor}`);
  }
  if (form.howCanWeSupport) {
    descriptionParts.push(`How we can support: ${form.howCanWeSupport}`);
  }
  if (doctorName && useDescriptionForDoctor) {
    descriptionParts.push(`Doctor: ${doctorName}`);
  }

  return descriptionParts.join("\n");
}

export function buildSimpleCrmLeadPayload(
  ctx,
  lead
) {
  if (!lead.unitnameC) {
    throw new Error(`SimpleCRM unitnameC is not configured for hospital "${lead.hospitalId}"`);
  }

  const { campaign, form } = ctx;
  const sourceUrl = ctx.meta.pageUrl;
  const email = form.email?.trim() ?? "";
  const doctorName = form.doctor?.trim() ?? "";
  const doctorCrmField = lead.doctorCrmField ?? "doctor_c";
  const useDescriptionForDoctor = doctorCrmField === "description";

  const attributes = omitEmptyAttributes(
    {
      first_name: form.name,
      last_name: form.name,
      email,
      phone_mobile: normalizeIndianMobile(form.phone),
      unitname_c: lead.unitnameC,
      form_enquirytype_c: lead.formEnquiryType ?? "Campaign",
      form_enquirysubtype_c: lead.formEnquirySubtype ?? "",
      enquiry_source_c: lead.enquirySource ?? "",
      form_campaign_name_c: lead.formCampaignName ?? "",
      description: buildDescription(ctx, useDescriptionForDoctor),
      source_url_c: sourceUrl,
      preferred_language_c: form.language ?? "",
      are_you_pregnant__c: form.areYouPregnant ?? "",
      which_trimester_are_you__c: form.whichTrimester ?? "",
      expected_delivery_month__c: form.expectedDeliveryMonth ?? "",
      are_you_struggling_to_conceive__c: form.strugglingToConceive ?? "",
      are_you_planning_for_pregnancy__c: form.planningForPregnancy ?? "",
      how_long_you_have_been_trying_to_conceive__c: form.tryingDuration ?? "",
      what_has_been_your_biggest_challenge_in_conceiving_so_far__c: form.biggestChallenge ?? "",
      what_are_you_looking_for__c: form.lookingFor ?? "",
      how_can_we_support_you_today__c: form.howCanWeSupport ?? "",
      ...(doctorName && !useDescriptionForDoctor ? { [doctorCrmField]: doctorName } : {}),
      utm_source_c: campaign.utm_source ?? "",
      utm_medium_c: campaign.utm_medium ?? "",
      utm_campaign_c: campaign.utm_campaign ?? "",
      campaignid_c: campaign.campaignid ?? "",
      adgroupid_c: campaign.adgroupid ?? "",
      keyword_c: campaign.keyword ?? "",
    },
    lead.omitEmptyFields
  );

  return {
    data: {
      type: "Leads",
      attributes,
    },
  };
}

async function requestAccessToken(config) {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const authBody = {
    grant_type: config.grantType,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  if (config.grantType === "password") {
    authBody.username = config.username;
    authBody.password = config.password;
  }

  const response = await fetch(`${config.baseUrl}/Api/access_token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authBody),
  });

  if (!response.ok) {
    throw new Error("Unable to retrieve access token.");
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Unable to retrieve access token.");
  }

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  return data.access_token;
}

function parseLeadId(data) {
  if (!data || typeof data !== "object") return undefined;
  return data.data?.id ?? data.data?.attributes?.id ?? data.id;
}

export async function createSimpleCrmLead(
  ctx,
  lead,
  config = resolveSimpleCrmConfig()
) {
  const accessToken = await requestAccessToken(config);
  const payload = buildSimpleCrmLeadPayload(ctx, lead);

  const response = await fetch(`${config.baseUrl}/Api/V8/module`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Lead creation failed.");
  }

  let responseBody;
  try {
    responseBody = await response.json();
  } catch {
    responseBody = undefined;
  }

  return {
    requestId: parseLeadId(responseBody),
  };
}