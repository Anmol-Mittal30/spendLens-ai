import OpenAI from "openai";
import type { AuditInput, AuditResult } from "./types";
import { buildTemplatedSummary } from "./audit";

// Free model on OpenRouter - no credit card required
const MODEL = "meta-llama/llama-3.1-8b-instruct";

// Lazy init to avoid build-time errors
function getOpenRouterClient() {
  if (!process.env.OPENROUTER_API_KEY) {
    return null;
  }
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
  });
}

/**
 * Generate AI-powered summary using OpenRouter (free tier).
 * Falls back to template if no key or API fails.
 */
export async function generateAISummary(
  input: AuditInput,
  result: AuditResult
): Promise<string> {
  const client = getOpenRouterClient();
  if (!client) {
    return buildTemplatedSummary(result);
  }

  try {
    const prompt = buildPrompt(input, result);

    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You write concise finance-literate SaaS spend audit summaries. Be specific, honest, and do not invent savings beyond the supplied audit. Keep it under 100 words. One paragraph only. Do not mention any specific vendor names like Credex.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 180,
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content?.trim();
    return text || buildTemplatedSummary(result);
  } catch (error) {
    console.warn("OpenRouter API failed, using template:", error);
    return buildTemplatedSummary(result);
  }
}

// Build prompt with all audit context for the AI
function buildPrompt(input: AuditInput, result: AuditResult): string {
  const linesSummary = result.lines
    .map(
      (l) =>
        `${l.toolName}: ${l.action} (saves $${l.savings}/mo) - ${l.reason}`,
    )
    .join("; ");

  return `Audit context:
- Team: ${input.teamSize} people
- Primary use case: ${input.useCase}
- Tools reviewed: ${input.tools.length}
- Current monthly spend: $${result.totalCurrent.toLocaleString()}
- Recommended monthly spend: $${result.totalRecommended.toLocaleString()}
- Monthly savings: $${result.monthlySavings.toLocaleString()}
- Annual savings: $${result.annualSavings.toLocaleString()}
- High savings flag: ${result.highSavings}

Per-tool recommendations:
${linesSummary}

Write a personalized ~100-word audit summary paragraph.`;
}