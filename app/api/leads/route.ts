import { NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadEmail, storeLead } from "@/lib/lead";

const hits = new Map<string, { count: number; resetAt: number }>();

const leadSchema = z.object({
  email: z.string().email(),
  company: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.coerce.number().optional(),
  website: z.string().optional(),
  shareId: z.string().min(10),
  result: z.any()
});

function rateLimited(ip: string) {
  const now = Date.now();
  const current = hits.get(ip);
  if (!current || current.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (rateLimited(ip)) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  const payload = leadSchema.parse(await request.json());
  if (payload.website) return NextResponse.json({ ok: true });

  // Store lead in Supabase
  let stored = false;
  try {
    await storeLead(payload);
    stored = true;
  } catch (error) {
    console.error("Failed to store lead:", error);
  }

  // Send email with PDF attachment
  const emailResult = await sendLeadEmail(payload);

  return NextResponse.json({
    ok: true,
    emailSent: emailResult.sent,
    email: payload.email,
    stored
  });
}
