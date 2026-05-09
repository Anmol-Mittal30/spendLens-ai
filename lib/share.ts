import type { AuditResult } from "./types";

export function encodeAudit(result: AuditResult): string {
  const publicResult = {
    createdAt: result.createdAt,
    teamSize: result.teamSize,
    useCase: result.useCase,
    totalCurrent: result.totalCurrent,
    totalRecommended: result.totalRecommended,
    monthlySavings: result.monthlySavings,
    annualSavings: result.annualSavings,
    lines: result.lines,
    summary: result.summary,
    highSavings: result.highSavings
  };
  return Buffer.from(JSON.stringify(publicResult), "utf8").toString("base64url");
}

export function decodeAudit(id: string): AuditResult | null {
  try {
    return JSON.parse(Buffer.from(id, "base64url").toString("utf8")) as AuditResult;
  } catch {
    return null;
  }
}
