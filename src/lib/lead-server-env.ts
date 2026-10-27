function envKeyForHospital(hospitalId: string) {
  return hospitalId.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_");
}

function parseExtraHeaders(raw: string | undefined): Record<string, string> {
  if (!raw?.trim()) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] =>
          typeof entry[0] === "string" && typeof entry[1] === "string"
      )
    );
  } catch {
    return {};
  }
}

export function resolveLeadUpstream(hospitalId: string) {
  const env = process.env as Record<string, string | undefined>;
  const key = hospitalId?.trim() ? envKeyForHospital(hospitalId) : "";

  const endpoint =
    (key && env[`LEAD_API_ENDPOINT_${key}`]?.trim()) ||
    env.LEAD_API_ENDPOINT?.trim();

  if (!endpoint) return null;

  const authorization =
    (key && env[`LEAD_API_AUTHORIZATION_${key}`]?.trim()) ||
    env.LEAD_API_AUTHORIZATION?.trim();

  const extraHeaders = {
    ...parseExtraHeaders(env.LEAD_API_HEADERS),
    ...(key ? parseExtraHeaders(env[`LEAD_API_HEADERS_${key}`]) : {}),
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extraHeaders,
    ...(authorization ? { Authorization: authorization } : {}),
  };

  return { endpoint, headers };
}