import type { VlpLead } from "@/lib/vlp-schema";

export type LeadFormPayload = {
  name: string;
  phone: string;
  language?: string;
  email?: string;
  comment?: string;
  doctor?: string;
  doctorId?: string;
  areYouPregnant?: string;
  whichTrimester?: string;
  expectedDeliveryMonth?: string;
  strugglingToConceive?: string;
  planningForPregnancy?: string;
  tryingDuration?: string;
  biggestChallenge?: string;
  lookingFor?: string;
  howCanWeSupport?: string;
};

export type LeadHospitalContext = {
  slug: string;
  route: string;
  hospitalName: string;
  hospitalShortName: string;
  brandName: string;
  chainName: string;
  regionLabel: string;
  address: string;
  phone: {
    display: string;
    tel: string;
  };
};

type LeadPayloadPrimitive = string | number | boolean;

export type LeadSubmitContext = {
  form: LeadFormPayload;
  hospital: LeadHospitalContext;
  lead: VlpLead;
  campaign: Record<string, string>;
  meta: {
    submittedAt: string;
    pageUrl: string;
  };
};

const PLACEHOLDER_RE = /\{\{([^}]+)\}\}/g;

function getByPath(root: unknown, path: string): unknown {
  const parts = path.split(".").filter(Boolean);
  let current: unknown = root;

  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function resolveTemplateString(template: string, ctx: LeadSubmitContext): string {
  return template.replace(PLACEHOLDER_RE, (_, rawPath: string) => {
    const path = rawPath.trim();
    const value = getByPath(ctx, path);
    if (value == null) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  });
}

function resolvePayloadValue(
  value: LeadPayloadPrimitive,
  ctx: LeadSubmitContext
): LeadPayloadPrimitive {
  if (typeof value !== "string" || !value.includes("{{")) return value;
  return resolveTemplateString(value, ctx);
}

export function buildLeadSubmitContext(
  form: LeadFormPayload,
  lead: VlpLead,
  hospital: LeadHospitalContext,
  campaign: Record<string, string>,
  meta: { submittedAt: string; pageUrl: string }
): LeadSubmitContext {
  return {
    form,
    hospital,
    lead,
    campaign,
    meta,
  };
}

export function buildLeadRequestBody(
  ctx: LeadSubmitContext,
  lead: VlpLead
): Record<string, unknown> {
  if (lead.payload) {
    return buildConfiguredPayload(ctx, lead);
  }
  return buildDefaultPayload(ctx);
}

function buildDefaultPayload(ctx: LeadSubmitContext): Record<string, unknown> {
  const { form, hospital, lead, campaign, meta } = ctx;

  return {
    name: form.name,
    phone: form.phone,
    ...(form.language ? { language: form.language } : {}),
    ...(form.doctor ? { doctor: form.doctor } : {}),
    ...(form.doctorId ? { doctorId: form.doctorId } : {}),
    hospitalId: lead.hospitalId,
    ...(lead.locationCode ? { locationCode: lead.locationCode } : {}),
    source: lead.source,
    slug: hospital.slug,
    route: hospital.route,
    hospitalName: hospital.hospitalName,
    hospitalShortName: hospital.hospitalShortName,
    brandName: hospital.brandName,
    chainName: hospital.chainName,
    regionLabel: hospital.regionLabel,
    address: hospital.address,
    phoneDisplay: hospital.phone.display,
    phoneTel: hospital.phone.tel,
    campaign,
    submittedAt: meta.submittedAt,
    pageUrl: meta.pageUrl,
  };
}

function buildConfiguredPayload(ctx: LeadSubmitContext, lead: VlpLead): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const [key, rawValue] of Object.entries(lead.payload ?? {})) {
    const resolved = resolvePayloadValue(rawValue, ctx);
    if (lead.omitEmptyFields && (resolved === "" || resolved == null)) continue;
    payload[key] = resolved;
  }

  return payload;
}

export function appendLeadQueryParams(
  url: string,
  lead: VlpLead,
  ctx: LeadSubmitContext
): string {
  if (!lead.queryParams || Object.keys(lead.queryParams).length === 0) return url;

  const parsed = new URL(url);
  for (const [key, rawValue] of Object.entries(lead.queryParams)) {
    const resolved = resolvePayloadValue(rawValue, ctx);
    if (lead.omitEmptyFields && (resolved === "" || resolved == null)) continue;
    parsed.searchParams.set(key, String(resolved));
  }

  return parsed.toString();
}