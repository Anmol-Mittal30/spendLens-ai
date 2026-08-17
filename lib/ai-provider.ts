import Groq from "groq-sdk";
import type { AuditInput, AuditResult } from "./types";
import { buildTemplatedSummary } from "./audit";

const MODEL = "llama-3.1-70b-versatile";

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });
}

/**
 * Generate AI-powered audit summary using Groq (free tier).
 * Falls back to template if API key missing or call fails.
 */
export async function generateAISummary(input: AuditInput, result: AuditResult): Promise<string> {
  const groq = getGroqClient();
  if (!groq) {
    return buildTemplatedSummary(result);
  }

  try {
    const prompt = buildPrompt(input, result);

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You write concise finance-literate SaaS spend audit summaries. Be specific, honest, and do not invent savings beyond the supplied audit. Keep it under 100 words. One paragraph only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 180,
      temperature: 0.3
    });

    const text = response.choices[0]?.message?.content?.trim();
    return text || buildTemplatedSummary(result);
  } catch (error) {
    console.warn("Groq API failed, using template:", error);
    return buildTemplatedSummary(result);
  }
}

/**
 * Build the prompt for the AI model.
 */
function buildPrompt(input: AuditInput, result: AuditResult): string {
  const linesSummary = result.lines
    .map(l => `${l.toolName}: ${l.action} (saves $${l.savings}/mo) - ${l.reason}`)
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