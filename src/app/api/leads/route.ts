import { NextResponse } from "next/server";
import { z } from "zod";
import { forwardLeadToUpstream } from "@/lib/forward-lead";
import { resolveLeadUpstream } from "@/lib/lead-server-env";
import { isValidIndianMobile, normalizeIndianMobile } from "@/lib/phone";
import { createSimpleCrmLead, isSimpleCrmConfigured } from "@/lib/simplecrm";
import type { LeadConfig, LeadSubmitContext } from "@/types/leads";

const leadRequestSchema = z.object({
  form: z.object({
    name: z.string().trim().min(1),
    mobile: z.string().trim().min(1),
    language: z.string().optional(),
    comment: z.string().optional(),
  }),
  lead: z.record(z.string(), z.any()).optional(),
  hospital: z
    .object({
      slug: z.string().optional(),
      hospitalName: z.string().optional(),
      address: z.string().optional(),
      phone: z.any().optional(),
      brand: z.string().optional(),
    })
    .passthrough()
    .optional(),
  campaign: z.record(z.string(), z.any()).optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

function jsonError(error: string, status: number, extra?: Record<string, unknown>) {
  return NextResponse.json(extra ? { error, ...extra } : { error }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 400, { details: parsed.error.flatten() });
  }

  const mobile = normalizeIndianMobile(parsed.data.form.mobile);
  if (!isValidIndianMobile(mobile)) {
    return jsonError("Invalid mobile number", 400);
  }

  const form = {
    ...parsed.data.form,
    mobile,
    language: parsed.data.form.language ?? "",
    comment: parsed.data.form.comment ?? "",
  };
  const lead = (parsed.data.lead ?? {}) as LeadConfig;
  const hospital = parsed.data.hospital ?? {};
  const ctx: LeadSubmitContext = {
    form,
    lead,
    hospital,
    campaign: (parsed.data.campaign ?? {}) as LeadSubmitContext["campaign"],
    meta: (parsed.data.meta ?? {}) as LeadSubmitContext["meta"],
  };

  try {
    if (isSimpleCrmConfigured()) {
      const result = await createSimpleCrmLead(ctx, lead);
      return NextResponse.json({ requestId: result.requestId }, { status: 200 });
    }

    const hospitalId = String(lead.hospitalId || hospital.slug || "");
    const upstream = resolveLeadUpstream(hospitalId);
    if (upstream) {
      const result = await forwardLeadToUpstream(ctx, lead, upstream);
      return NextResponse.json({ requestId: result.requestId }, { status: 200 });
    }

    return jsonError("Lead API is not configured", 503);
  } catch (error) {
    console.error("Lead submission failed", error);
    return jsonError("Lead submission failed", 502);
  }
}
