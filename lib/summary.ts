import type { AuditInput, AuditResult } from "./types";
import { buildTemplatedSummary } from "./audit";
import { generateAISummary } from "./ai-provider";

/**
 * Generate audit summary — tries AI (Groq) first, falls back to template.
 * Requires GROQ_API_KEY environment variable for AI summaries.
 */
export async function generateSummary(input: AuditInput, result: AuditResult): Promise<string> {
  return generateAISummary(input, result);
}