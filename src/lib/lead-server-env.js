function envKeyForHospital(hospitalId) {
  return hospitalId.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_");
}

function parseExtraHeaders(raw) {
  if (!raw?.trim()) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry) =>
          typeof entry[0] === "string" && typeof entry[1] === "string"
      )
    );
  } catch {
    return {};
  }
}

export function resolveLeadUpstream(hospitalId) {
  const key = envKeyForHospital(hospitalId);

  const endpoint =
    process.env[`LEAD_API_ENDPOINT_${key}`]?.trim() ||
    process.env.LEAD_API_ENDPOINT?.trim();

  if (!endpoint) return null;

  const authorization =
    process.env[`LEAD_API_AUTHORIZATION_${key}`]?.trim() ||
    process.env.LEAD_API_AUTHORIZATION?.trim();

  const extraHeaders = {
    ...parseExtraHeaders(process.env.LEAD_API_HEADERS),
    ...parseExtraHeaders(process.env[`LEAD_API_HEADERS_${key}`]),
  };

  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
    ...(authorization ? { Authorization: authorization } : {}),
  };

  return { endpoint, headers };
}