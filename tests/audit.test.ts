import { describe, expect, it } from "vitest";
import { runAudit } from "../lib/audit";
import type { AuditInput } from "../lib/types";

function base(overrides: Partial<AuditInput> = {}): AuditInput {
  return {
    teamSize: 4,
    useCase: "coding",
    tools: [],
    ...overrides
  };
}

describe("audit engine", () => {
  it("downgrades Cursor Business for tiny teams", () => {
    const result = runAudit(base({ tools: [{ id: "1", tool: "cursor", plan: "Business", seats: 2, monthlySpend: 80 }] }));
    expect(result.monthlySavings).toBe(40);
    expect(result.lines[0].action).toContain("Cursor Pro");
  });

  it("moves small Claude Team usage to Pro", () => {
    const result = runAudit(base({ tools: [{ id: "1", tool: "claude", plan: "Team", seats: 3, monthlySpend: 90 }] }));
    expect(result.monthlySavings).toBe(30);
  });

  it("flags ChatGPT Pro when Team is the better work plan", () => {
    const result = runAudit(base({ tools: [{ id: "1", tool: "chatgpt", plan: "Pro", seats: 2, monthlySpend: 400 }] }));
    expect(result.monthlySavings).toBe(340);
  });

  it("optimizes high OpenAI API spend with cheaper model tiers", () => {
    const result = runAudit(base({ tools: [{ id: "1", tool: "openai_api", plan: "GPT-5.1", seats: 1, monthlySpend: 1000 }] }));
    expect(result.monthlySavings).toBe(400);
  });

  it("does not manufacture savings for a well-fit stack", () => {
    const result = runAudit(base({ tools: [{ id: "1", tool: "cursor", plan: "Pro", seats: 2, monthlySpend: 40 }] }));
    expect(result.monthlySavings).toBe(0);
    expect(result.summary).toContain("disciplined");
  });

  it("marks high savings when monthly savings exceeds Credex threshold", () => {
    const result = runAudit(
      base({
        tools: [
          { id: "1", tool: "chatgpt", plan: "Pro", seats: 4, monthlySpend: 800 },
          { id: "2", tool: "openai_api", plan: "GPT-5.1", seats: 1, monthlySpend: 1200 }
        ]
      })
    );
    expect(result.highSavings).toBe(true);
  });
});
