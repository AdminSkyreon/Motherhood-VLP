import type { VlpLead } from "@/lib/vlp-schema";
import {
  appendLeadQueryParams,
  buildLeadRequestBody,
  buildLeadSubmitContext,
  type LeadFormPayload,
  type LeadHospitalContext,
} from "@/lib/lead-payload";
import { basePath, vlpPageUrl } from "@/lib/site";

export type { LeadFormPayload, LeadHospitalContext };

export type LeadSubmitResult = {
  requestId: string;
};

function resolveCampaignParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "campaignid",
    "adgroupid",
    "keyword",
    "device",
  ];
  const campaign: Record<string, string> = {};

  for (const key of keys) {
    const value = params.get(key);
    if (value) campaign[key] = value;
  }

  campaign.utm_reffffer = document.referrer || window.location.href;

  if (!campaign.device && typeof navigator !== "undefined") {
    campaign.device = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
  }

  return campaign;
}

function parseLeadResponseRequestId(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const record = data as { requestId?: string; id?: string; reference?: string };
  return record.requestId ?? record.id ?? record.reference;
}

function parseLeadResponseError(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const error = (data as { error?: unknown }).error;
  return typeof error === "string" && error.trim() ? error.trim() : undefined;
}

async function throwIfLeadFailed(response: Response): Promise<void> {
  if (response.ok) return;

  let message = "Lead submission failed";
  try {
    message = parseLeadResponseError(await response.json()) ?? message;
  } catch {
    // keep fallback
  }
  throw new Error(message);
}

async function submitLeadViaProxy(
  ctx: ReturnType<typeof buildLeadSubmitContext>,
  form: LeadFormPayload,
  lead: VlpLead,
  hospital: LeadHospitalContext,
  requestIdPrefix: string
): Promise<LeadSubmitResult> {
  const response = await fetch(`${basePath}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form,
      hospital,
      lead,
      campaign: ctx.campaign,
      meta: ctx.meta,
    }),
  });

  await throwIfLeadFailed(response);

  let requestId: string | undefined;
  try {
    requestId = parseLeadResponseRequestId(await response.json());
  } catch {
    requestId = undefined;
  }

  return {
    requestId:
      requestId ?? `${requestIdPrefix}${Math.floor(1000 + Math.random() * 9000)}`,
  };
}

export async function submitLead(
  form: LeadFormPayload,
  lead: VlpLead,
  hospital: LeadHospitalContext,
  requestIdPrefix: string
): Promise<LeadSubmitResult> {
  const ctx = buildLeadSubmitContext(form, lead, hospital, resolveCampaignParams(), {
    submittedAt: new Date().toISOString(),
    pageUrl: vlpPageUrl(hospital.route),
  });

  const useMock = process.env.NEXT_PUBLIC_LEAD_MOCK === "true";
  const useProxy = process.env.NEXT_PUBLIC_LEAD_PROXY === "true";

  if (useMock) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      requestId: `${requestIdPrefix}${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }

  if (useProxy) {
    return submitLeadViaProxy(ctx, form, lead, hospital, requestIdPrefix);
  }

  if (!lead.endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      requestId: `${requestIdPrefix}${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }

  const body = buildLeadRequestBody(ctx, lead);
  const endpoint = appendLeadQueryParams(lead.endpoint, lead, ctx);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...lead.headers,
  };

  const response = await fetch(endpoint, {
    method: lead.method ?? "POST",
    headers,
    body: JSON.stringify(body),
  });

  await throwIfLeadFailed(response);

  let requestId: string | undefined;
  try {
    requestId = parseLeadResponseRequestId(await response.json());
  } catch {
    requestId = undefined;
  }

  return {
    requestId:
      requestId ?? `${requestIdPrefix}${Math.floor(1000 + Math.random() * 9000)}`,
  };
}

export function resolvePageLead(slug: string, lead?: VlpLead): VlpLead {
  return {
    hospitalId: slug,
    source: "vlp-landing-page",
    method: "POST",
    omitEmptyFields: true,
    websiteCode: "MHVLP",
    ...lead,
  };
}

export function hospitalToLeadContext(site: {
  slug: string;
  route?: string;
  hospitalName: string;
  hospitalShortName: string;
  brandName: string;
  chainName: string;
  regionLabel: string;
  address: string;
  phone: { display: string; tel: string };
}): LeadHospitalContext {
  return {
    slug: site.slug,
    route: site.route ?? site.slug,
    hospitalName: site.hospitalName,
    hospitalShortName: site.hospitalShortName,
    brandName: site.brandName,
    chainName: site.chainName,
    regionLabel: site.regionLabel,
    address: site.address,
    phone: site.phone,
  };
}