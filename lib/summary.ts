import type { AuditInput, AuditResult } from "./types";
import { buildTemplatedSummary } from "./audit";
import { generateAISummary } from "./ai-provider";

/**
 * Generate audit summary — tries AI (OpenRouter) first, falls back to template.
 */
export async function generateSummary(input: AuditInput, result: AuditResult): Promise<string> {
  return generateAISummary(input, result);
}