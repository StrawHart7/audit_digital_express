import { NextRequest, NextResponse } from "next/server";
import { runPageSpeedAudit, PageSpeedError } from "@/lib/pagespeed";
import { AuditRequestBody, AuditResult } from "@/types/audit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let body: Partial<AuditRequestBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const url = body.url?.trim();
  const companyName = body.companyName?.trim();

  if (!url) {
    return NextResponse.json({ error: "Please provide a website URL." }, { status: 400 });
  }
  if (!companyName) {
    return NextResponse.json({ error: "Please provide a company name." }, { status: 400 });
  }

  try {
    const metrics = await runPageSpeedAudit(url);
    const result: AuditResult = {
      companyName,
      url: /^https?:\/\//i.test(url) ? url : `https://${url}`,
      auditDate: new Date().toISOString(),
      metrics,
    };
    return NextResponse.json({ result });
  } catch (err) {
    if (err instanceof PageSpeedError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json(
      { error: "Unexpected error while running the audit. Please try again." },
      { status: 500 }
    );
  }
}