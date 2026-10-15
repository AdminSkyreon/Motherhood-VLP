import type { VlpLead } from "@/lib/vlp-schema";
import {
  appendLeadQueryParams,
  buildLeadRequestBody,
  type LeadSubmitContext,
} from "@/lib/lead-payload";

export type LeadForwardResult = {
  requestId?: string;
};

export async function forwardLeadToUpstream(
  ctx: LeadSubmitContext,
  lead: VlpLead,
  upstream: { endpoint: string; headers: Record<string, string> }
): Promise<LeadForwardResult> {
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
    const data = (await response.json()) as {
      requestId?: string;
      id?: string;
      reference?: string;
    };
    return {
      requestId: data.requestId ?? data.id ?? data.reference,
    };
  } catch {
    return {};
  }
}