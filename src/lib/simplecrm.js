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

function buildDescription(ctx) {
  const { form } = ctx;
  const descriptionParts = [];

  if (form.comment?.trim()) {
    descriptionParts.push(form.comment.trim());
  }
  if (form.language) {
    descriptionParts.push(`Preferred Language: ${form.language}`);
  }
  if (form.doctor) {
    descriptionParts.push(`Doctor: ${form.doctor}`);
  }

  return descriptionParts.join("\n");
}

export function buildSimpleCrmLeadPayload(ctx, lead) {
  if (!lead.unitnameC) {
    throw new Error(`SimpleCRM unitnameC is not configured for hospital "${lead.hospitalId}"`);
  }

  const { campaign, form } = ctx;
  const sourceUrl = ctx.meta.pageUrl;
  const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format for $currentdate

  const attributes = {
    website: lead.websiteCode ?? "MHI",
    last_name: form.name,
    email: form.email?.trim() ?? "",
    phone_mobile: normalizeIndianMobile(form.phone),
    unitname_c: lead.unitnameC,
    form_enquirytype_c: lead.formEnquiryType ?? "Campaign",
    form_enquirysubtype_c: lead.formEnquirySubtype ?? "",
    enquiry_source_c: lead.enquirySource ?? "",
    form_campaign_name_c: lead.formCampaignName ?? "",
    description: buildDescription(ctx),
    source_url_c: sourceUrl,
    preferred_appointment_date_c: currentDate,
    utm_source_c: campaign.utm_source ?? "",
    utm_medium_c: campaign.utm_medium ?? "",
    utm_campaign_c: campaign.utm_campaign ?? "",
    campaignid_c: campaign.campaignid ?? "",
    adgroupid_c: campaign.adgroupid ?? "",
    keyword_c: campaign.keyword ?? "",
  };

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
    throw new Error("Error: Unable to retrieve access token.");
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Error: Unable to retrieve access token.");
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
    throw new Error("Error: Lead creation failed.");
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