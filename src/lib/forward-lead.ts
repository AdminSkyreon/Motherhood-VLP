import {
  appendLeadQueryParams,
  buildLeadRequestBody,
} from "@/lib/lead-payload";
import { createCrmRequestId } from "@/lib/simplecrm";
import type { LeadConfig, LeadSubmitContext } from "@/types/leads";

export async function forwardLeadToUpstream(
  ctx: LeadSubmitContext,
  lead: LeadConfig,
  upstream: { endpoint: string; headers: Record<string, string> }
) {
  const body = buildLeadRequestBody(ctx, lead);
  const endpoint = appendLeadQueryParams(upstream.endpoint, lead, ctx);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: upstream.headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Lead submission failed (${response.status})`);
  }

  try {
    const data = await response.json();
    const requestId = data?.requestId ?? data?.id ?? data?.reference;
    return {
      requestId: requestId == null || requestId === "" ? createCrmRequestId() : String(requestId),
    };
  } catch {
    return { requestId: createCrmRequestId() };
  }
}