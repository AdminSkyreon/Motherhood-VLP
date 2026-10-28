import type { LeadConfig, LeadSubmitContext } from "@/types/leads";

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

function resolveTemplateString(template: string, ctx: LeadSubmitContext) {
  return template.replace(PLACEHOLDER_RE, (_, rawPath) => {
    const path = rawPath.trim();
    const value = getByPath(ctx, path);
    if (value == null) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  });
}

function resolvePayloadValue(value: unknown, ctx: LeadSubmitContext): unknown {
  if (typeof value !== "string" || !value.includes("{{")) return value;
  return resolveTemplateString(value, ctx);
}

export function buildLeadSubmitContext(
  form: LeadSubmitContext["form"],
  lead: LeadConfig,
  hospital: LeadSubmitContext["hospital"],
  campaign: LeadSubmitContext["campaign"],
  meta: LeadSubmitContext["meta"]
): LeadSubmitContext {
  return {
    form,
    hospital,
    lead,
    campaign,
    meta,
  };
}

export function buildLeadRequestBody(ctx: LeadSubmitContext, lead: LeadConfig) {
  if (lead.payload) {
    return buildConfiguredPayload(ctx, lead);
  }
  return buildDefaultPayload(ctx);
}

function buildDefaultPayload(ctx: LeadSubmitContext) {
  const form = ctx.form ?? {};
  const hospital = ctx.hospital ?? {};
  const lead = ctx.lead ?? {};
  const slug = hospital.slug || "";
  const language = form.language ?? "";

  return {
    name: form.name ?? "",
    phone: form.mobile || form.phone || "",
    language,
    hospitalId: lead.hospitalId || slug,
    hospitalSlug: slug,
    hospitalName: hospital.hospitalName ?? "",
    source: lead.source || (slug ? `landing-page-${slug}` : ""),
    campaign: ctx.campaign ?? {},
    meta: ctx.meta ?? {},
    description: `Preferred language: ${language}`,
  };
}

function buildConfiguredPayload(ctx: LeadSubmitContext, lead: LeadConfig) {
  const payload: Record<string, unknown> = {};

  for (const [key, rawValue] of Object.entries(lead.payload ?? {})) {
    const resolved = resolvePayloadValue(rawValue, ctx);
    if (lead.omitEmptyFields && (resolved === "" || resolved == null)) continue;
    payload[key] = resolved;
  }

  return payload;
}

export function appendLeadQueryParams(url: string, lead: LeadConfig, ctx: LeadSubmitContext) {
  if (!lead.queryParams || Object.keys(lead.queryParams).length === 0) return url;

  const parsed = new URL(url);
  for (const [key, rawValue] of Object.entries(lead.queryParams)) {
    const resolved = resolvePayloadValue(rawValue, ctx);
    if (lead.omitEmptyFields && (resolved === "" || resolved == null)) continue;
    parsed.searchParams.set(key, String(resolved));
  }

  return parsed.toString();
}