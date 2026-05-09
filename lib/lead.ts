import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import type { AuditResult } from "./types";

export type LeadPayload = {
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  shareId: string;
  result: AuditResult;
};

export async function storeLead(payload: LeadPayload) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { stored: false, reason: "Supabase env vars not configured" };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { error } = await supabase.from("leads").insert({
    email: payload.email,
    company: payload.company || null,
    role: payload.role || null,
    team_size: payload.teamSize || payload.result.teamSize,
    share_id: payload.shareId,
    monthly_savings: payload.result.monthlySavings,
    annual_savings: payload.result.annualSavings,
    audit_result: payload.result
  });

  if (error) throw error;
  return { stored: true };
}

export async function sendLeadEmail(payload: LeadPayload) {
  if (!process.env.RESEND_API_KEY) {
    return { sent: false, reason: "Resend env var not configured" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "SpendLens AI <onboarding@resend.dev>",
    to: payload.email,
    bcc: process.env.LEAD_TO_EMAIL,
    subject: `Your AI spend audit: $${payload.result.monthlySavings}/mo opportunity`,
    html: `<p>Your SpendLens AI audit found <strong>$${payload.result.monthlySavings}/month</strong> in potential savings.</p><p>${payload.result.summary}</p><p>Public report: ${process.env.NEXT_PUBLIC_APP_URL || ""}/audit/${payload.shareId}</p>`
  });

  return { sent: true };
}
