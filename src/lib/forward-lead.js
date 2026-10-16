import {
  appendLeadQueryParams,
  buildLeadRequestBody,
} from "@/lib/lead-payload";

export async function forwardLeadToUpstream(
  ctx,
  lead,
  upstream
) {
  const body = buildLeadRequestBody(ctx, lead);
  const endpoint = appendLeadQueryParams(upstream.endpoint, lead, ctx);

  const response = await fetch(endpoint, {
    method: lead.method ?? "POST",
    headers: upstream.headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Lead submission failed (${response.status})`);
  }

  try {
    const data = await response.json();
    return {
      requestId: data.requestId ?? data.id ?? data.reference,
    };
  } catch {
    return {};
  }
}