import Anthropic from "@anthropic-ai/sdk";
import type { AuditInput, AuditResult } from "./types";
import { buildTemplatedSummary } from "./audit";

export async function generateSummary(input: AuditInput, result: AuditResult): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildTemplatedSummary(result);
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929",
      max_tokens: 170,
      temperature: 0.3,
      system:
        "You write concise finance-literate SaaS spend audit summaries. Be specific, honest, and do not invent savings beyond the supplied audit.",
      messages: [
        {
          role: "user",
          content: `Write one personalized ~100-word paragraph for this AI spend audit. Inputs: ${JSON.stringify(input)}. Audit result: ${JSON.stringify(result)}`
        }
      ]
    });
    const text = response.content
      .map((block) => ("text" in block ? block.text : ""))
      .join(" ")
      .trim();
    return text || buildTemplatedSummary(result);
  } catch {
    return buildTemplatedSummary(result);
  }
}
