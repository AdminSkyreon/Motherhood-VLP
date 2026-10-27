import { normalizeIndianMobile } from "./phone";
import type { LeadConfig, LeadSubmitContext } from "@/types/leads";

type SimpleCrmConfig = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
};

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

export function createCrmRequestId() {
  return `crm-${Date.now()}-${randomSuffix()}`;
}

export function resolveSimpleCrmConfig() {
  const baseUrl = process.env.SIMPLECRM_BASE_URL?.trim();
  const clientId = process.env.SIMPLECRM_CLIENT_ID?.trim();
  const clientSecret = process.env.SIMPLECRM_CLIENT_SECRET?.trim();

  if (!baseUrl || !clientId || !clientSecret) return null;

  return {
    baseUrl: trimTrailingSlash(baseUrl),
    clientId,
    clientSecret,
    username: process.env.SIMPLECRM_USERNAME?.trim() ?? "",
    password: process.env.SIMPLECRM_PASSWORD?.trim() ?? "",
  };
}

export function isSimpleCrmConfigured() {
  return resolveSimpleCrmConfig() !== null;
}

function preferredLanguage(form: LeadSubmitContext["form"]) {
  return `Preferred language: ${form.language?.trim() ?? ""}`;
}

function appointmentDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function buildSimpleCrmLeadPayload(ctx: LeadSubmitContext, lead: LeadConfig) {
  if (!lead.unitnameC) {
    throw new Error(`SimpleCRM unitnameC is not configured for hospital "${lead.hospitalId ?? ""}"`);
  }

  const { campaign, form, meta } = ctx;
  const mobile = normalizeIndianMobile(form.mobile || form.phone);

  const attributes = {
    website: lead.website || lead.websiteCode || "MHI",
    last_name: form.name,
    email: form.email?.trim() || "",
    phone_mobile: mobile,
    unitname_c: lead.unitnameC,
    form_enquirytype_c: lead.formEnquiryType || lead.formName || "",
    form_enquirysubtype_c: lead.formEnquirySubtype ?? "",
    enquiry_source_c: lead.enquirySource ?? "",
    form_campaign_name_c: lead.formCampaignName ?? "",
    description: preferredLanguage(form),
    source_url_c: meta?.pageUrl ?? "",
    preferred_appointment_date_c: appointmentDate(),
    utm_source_c: campaign?.utm_source ?? "",
    utm_medium_c: campaign?.utm_medium ?? "",
    utm_campaign_c: campaign?.utm_campaign ?? "",
    campaignid_c: campaign?.campaignid || campaign?.gclid || "",
    adgroupid_c: campaign?.adgroupid ?? "",
    keyword_c: campaign?.keyword ?? "",
  };

  return {
    data: {
      type: "Leads",
      attributes,
    },
  };
}

async function requestAccessToken(config: SimpleCrmConfig) {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const body = new URLSearchParams({
    grant_type: "password",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    username: config.username,
    password: config.password,
  });

  const response = await fetch(`${config.baseUrl}/Api/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  if (!response.ok) {
    throw new Error("Error: Unable to retrieve access token.");
  }

  const data = (await response.json()) as { access_token?: string; expires_in?: number };

  if (!data.access_token) {
    throw new Error("Error: Unable to retrieve access token.");
  }

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  return data.access_token;
}

function parseLeadId(data: unknown) {
  if (!data || typeof data !== "object") return undefined;
  const record = data as {
    id?: unknown;
    data?: { id?: unknown; attributes?: { id?: unknown } };
  };
  const id = record.data?.id ?? record.data?.attributes?.id ?? record.id;
  if (id == null || id === "") return undefined;
  return String(id);
}

export async function createSimpleCrmLead(
  ctx: LeadSubmitContext,
  lead: LeadConfig,
  config: SimpleCrmConfig | null = resolveSimpleCrmConfig()
) {
  if (!config) {
    throw new Error("Lead API is not configured");
  }

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
    requestId: parseLeadId(responseBody) || createCrmRequestId(),
  };
}
