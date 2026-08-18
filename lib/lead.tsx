import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { AuditPDF } from "./pdf-report";
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

  try {
    // Generate PDF server-side
    const pdfBuffer = await renderToBuffer(<AuditPDF audit={payload.result} />);
    const base64Pdf = pdfBuffer.toString("base64");

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "SpendLens AI <onboarding@resend.dev>",
      to: payload.email,
      bcc: process.env.LEAD_TO_EMAIL,
      subject: "Your SpendLens AI Audit Report",
      html: `
        <p>Your SpendLens AI audit report is ready!</p>
        <p><strong>Monthly Savings:</strong> $${payload.result.monthlySavings.toLocaleString()}</p>
        <p><strong>Annual Savings:</strong> $${payload.result.annualSavings.toLocaleString()}</p>
        <p><strong>Summary:</strong> ${payload.result.summary}</p>
        <p>📎 Your detailed PDF report is attached to this email.</p>
        <p>🔗 <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/audit/${payload.shareId}">View public report</a></p>
      `,
      attachments: [{
        filename: `spendlens-audit-${payload.shareId.slice(0, 8)}.pdf`,
        content: base64Pdf
      }]
    });

    return { sent: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { sent: false, reason: String(error) };
  }
}
