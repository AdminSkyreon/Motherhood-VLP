import type { Campaign, HospitalContext, HospitalRecord, LeadConfig, LeadForm, LeadMeta } from "@/types/leads";

const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "campaignid",
  "adgroupid",
  "keyword",
  "utm_referrer",
];

const MOCK_DELAY_MS = 1200;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 10);
}

function createMockRequestId() {
  return `mock-${Date.now()}-${randomSuffix()}`;
}

function detectDevice() {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent || "";
  const isTablet =
    /iPad|Tablet|PlayBook|Silk|Kindle/i.test(ua) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua)) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isTablet) return "tablet";
  if (/Mobi|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export function resolveBasePath() {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";
  const raw =
    fromEnv ||
    (typeof document !== "undefined"
      ? document.documentElement.getAttribute("data-base-path") || ""
      : "");

  if (!raw) return "";
  return raw.startsWith("/") ? raw.replace(/\/$/, "") : `/${raw.replace(/\/$/, "")}`;
}

export function buildCampaign(campaignDefaults: Record<string, string> = {}) {
  const defaults =
    campaignDefaults && typeof campaignDefaults === "object" ? campaignDefaults : {};
  const campaign: Campaign = {};

  const params =
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search);

  for (const key of CAMPAIGN_KEYS) {
    const fromUrl = params?.get(key)?.trim();
    if (fromUrl) campaign[key] = fromUrl;
    else if (defaults[key] != null && String(defaults[key]).trim()) {
      campaign[key] = String(defaults[key]).trim();
    }
  }

  campaign.referrer = typeof document !== "undefined" ? document.referrer || "" : "";
  campaign.device = detectDevice();
  return campaign;
}

export function buildLeadMeta(): LeadMeta {
  return {
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
    submittedAt: new Date().toISOString(),
    vertical: "gynaecology",
  };
}

function parseLeadResponseRequestId(data: unknown) {
  if (!data || typeof data !== "object") return undefined;
  const record = data as { requestId?: unknown; id?: unknown; reference?: unknown };
  const requestId = record.requestId ?? record.id ?? record.reference;
  return requestId == null || requestId === "" ? undefined : String(requestId);
}

function parseLeadResponseError(data: unknown) {
  if (!data || typeof data !== "object") return undefined;
  const error = (data as { error?: unknown }).error;
  return typeof error === "string" && error.trim() ? error.trim() : undefined;
}

async function throwIfLeadFailed(response: Response) {
  if (response.ok) return;

  let message = "Lead submission failed";
  try {
    message = parseLeadResponseError(await response.json()) ?? message;
  } catch {
    // keep fallback
  }
  throw new Error(message);
}

async function readRequestId(response: Response) {
  try {
    return parseLeadResponseRequestId(await response.json());
  } catch {
    return undefined;
  }
}

async function mockSubmit() {
  await wait(MOCK_DELAY_MS);
  return { requestId: createMockRequestId() };
}

async function submitLeadViaProxy(payload: unknown) {
  const response = await fetch(`${resolveBasePath()}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  await throwIfLeadFailed(response);
  return { requestId: await readRequestId(response) };
}

async function submitLeadDirect(payload: unknown, endpoint: string) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  await throwIfLeadFailed(response);
  return { requestId: await readRequestId(response) };
}

export async function submitLead({
  form,
  lead = {},
  hospital = {},
  campaign,
  meta,
}: {
  form: LeadForm;
  lead?: LeadConfig;
  hospital?: Partial<HospitalContext>;
  campaign?: Campaign;
  meta?: LeadMeta;
}) {
  const payload = {
    form: {
      name: form?.name ?? "",
      mobile: form?.mobile ?? "",
      language: form?.language ?? "",
      comment: form?.comment ?? "",
    },
    lead,
    hospital,
    campaign: campaign ?? buildCampaign(lead.campaignDefaults),
    meta: meta ?? buildLeadMeta(),
  };

  if (process.env.NEXT_PUBLIC_LEAD_MOCK === "true") {
    return mockSubmit();
  }

  if (process.env.NEXT_PUBLIC_LEAD_PROXY === "true") {
    return submitLeadViaProxy(payload);
  }

  const endpoint = typeof lead.endpoint === "string" ? lead.endpoint.trim() : "";
  if (endpoint) {
    return submitLeadDirect(payload, endpoint);
  }

  return mockSubmit();
}

export function resolvePageLead(hospital?: HospitalRecord | null) {
  return hospital?.sections?.booking?.lead ?? hospital?.lead ?? {};
}

export function hospitalToLeadContext(hospital?: HospitalRecord | null): HospitalContext {
  const sections = hospital?.sections ?? {};
  const brand = hospital?.brand || sections.footer?.hospitalName || "";
  const branch = sections.footer?.branch || "";
  const hospitalName = [brand, branch].filter(Boolean).join(" ").trim();
  const display = sections.header?.phoneNumber || sections.footer?.phone || "";

  return {
    slug: hospital?.slug || "",
    hospitalName,
    address: sections.location?.address || hospital?.address || "",
    phone: display
      ? { display: String(display), tel: String(display).replace(/[^\d+]/g, "") }
      : {},
    brand,
  };
}
