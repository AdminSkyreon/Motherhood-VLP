const PLACEHOLDER_RE = /\{\{([^}]+)\}\}/g;

function getByPath(root, path) {
  const parts = path.split(".").filter(Boolean);
  let current = root;

  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[part];
  }

  return current;
}

function resolveTemplateString(template, ctx) {
  return template.replace(PLACEHOLDER_RE, (_, rawPath) => {
    const path = rawPath.trim();
    const value = getByPath(ctx, path);
    if (value == null) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  });
}

function resolvePayloadValue(
  value,
  ctx
) {
  if (typeof value !== "string" || !value.includes("{{")) return value;
  return resolveTemplateString(value, ctx);
}

export function buildLeadSubmitContext(
  form,
  lead,
  hospital,
  campaign,
  meta
) {
  return {
    form,
    hospital,
    lead,
    campaign,
    meta,
  };
}

export function buildLeadRequestBody(
  ctx,
  lead
) {
  if (lead.payload) {
    return buildConfiguredPayload(ctx, lead);
  }
  return buildDefaultPayload(ctx);
}

function buildDefaultPayload(ctx) {
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

function buildConfiguredPayload(ctx, lead) {
  const payload = {};

  for (const [key, rawValue] of Object.entries(lead.payload ?? {})) {
    const resolved = resolvePayloadValue(rawValue, ctx);
    if (lead.omitEmptyFields && (resolved === "" || resolved == null)) continue;
    payload[key] = resolved;
  }

  return payload;
}

export function appendLeadQueryParams(
  url,
  lead,
  ctx
) {
  if (!lead.queryParams || Object.keys(lead.queryParams).length === 0) return url;

  const parsed = new URL(url);
  for (const [key, rawValue] of Object.entries(lead.queryParams)) {
    const resolved = resolvePayloadValue(rawValue, ctx);
    if (lead.omitEmptyFields && (resolved === "" || resolved == null)) continue;
    parsed.searchParams.set(key, String(resolved));
  }

  return parsed.toString();
}