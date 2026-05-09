import { NextResponse } from "next/server";
import { z } from "zod";
import { runAudit } from "@/lib/audit";
import { encodeAudit } from "@/lib/share";
import { generateSummary } from "@/lib/summary";

const toolSchema = z.object({
  id: z.string(),
  tool: z.enum(["cursor", "copilot", "claude", "chatgpt", "anthropic_api", "openai_api", "gemini", "windsurf"]),
  plan: z.string(),
  monthlySpend: z.coerce.number().min(0),
  seats: z.coerce.number().int().min(1)
});

const auditSchema = z.object({
  teamSize: z.coerce.number().int().min(1),
  useCase: z.enum(["coding", "writing", "data", "research", "mixed"]),
  tools: z.array(toolSchema).min(1).max(16)
});

export async function POST(request: Request) {
  const input = auditSchema.parse(await request.json());
  const initial = runAudit(input);
  const summary = await generateSummary(input, initial);
  const result = { ...initial, summary };
  return NextResponse.json({ result, shareId: encodeAudit(result) });
}
