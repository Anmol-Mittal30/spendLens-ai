import { PLAN_PRICES, TOOL_LABELS } from "./pricing";
import type { AuditInput, AuditLine, AuditResult, ToolInput } from "./types";

const currency = (value: number) => Math.max(0, Math.round(value));

function baselineSpend(tool: ToolInput): number {
  const price = PLAN_PRICES[tool.tool][tool.plan];
  if (typeof price === "number") {
    return price * Math.max(1, tool.seats);
  }
  return Math.max(0, tool.monthlySpend);
}

function line(tool: ToolInput, recommendedSpend: number, action: string, reason: string): AuditLine {
  const currentSpend = baselineSpend(tool);
  const savings = currency(currentSpend - recommendedSpend);
  return {
    id: tool.id,
    tool: tool.tool,
    toolName: TOOL_LABELS[tool.tool],
    currentSpend: currency(currentSpend),
    recommendedSpend: currency(recommendedSpend),
    savings,
    action,
    reason,
    severity: savings >= 250 ? "high" : savings > 0 ? "optimize" : "good"
  };
}

function evaluateTool(tool: ToolInput, teamSize: number, useCase: AuditInput["useCase"]): AuditLine {
  const seats = Math.max(1, tool.seats);
  const current = baselineSpend(tool);

  if (tool.tool === "cursor") {
    if (tool.plan === "Business" && seats < 5) {
      return line(tool, 20 * seats, "Downgrade to Cursor Pro", "Business admin controls rarely pay back for fewer than 5 seats.");
    }
    if (tool.plan === "Enterprise") {
      return line(tool, 40 * seats, "Validate Enterprise need", "Use Teams pricing as the benchmark unless SCIM, audit logs, or invoicing are mandatory.");
    }
  }

  if (tool.tool === "copilot") {
    if (tool.plan === "Enterprise" && teamSize < 50) {
      return line(tool, 19 * seats, "Move most seats to Copilot Business", "Enterprise makes sense when internal knowledge customization is widely used.");
    }
    if (useCase !== "coding" && current > 0) {
      return line(tool, 0, "Remove non-coding Copilot seats", "Copilot spend is hard to justify when the primary workflow is not software development.");
    }
  }

  if (tool.tool === "claude") {
    if (tool.plan === "Team" && seats < 5) {
      return line(tool, 20 * seats, "Use Claude Pro until the team reaches 5 seats", "Claude Team has a 5-member minimum and collaboration controls are overkill for tiny teams.");
    }
    if (tool.plan === "Max" && useCase !== "research" && useCase !== "coding") {
      return line(tool, 20 * seats, "Downgrade Max users to Claude Pro", "Max only pays off for frequent heavy workflows that repeatedly hit Pro limits.");
    }
  }

  if (tool.tool === "chatgpt") {
    if (tool.plan === "Pro" && useCase !== "research" && useCase !== "data") {
      return line(tool, 30 * seats, "Move Pro users to ChatGPT Team", "Most team workflows need shared workspace controls more than $200 individual Pro access.");
    }
    if (tool.plan === "Team" && seats < 3) {
      return line(tool, 20 * seats, "Use Plus for early individual users", "Team controls become valuable once there is a real shared workspace to administer.");
    }
  }

  if (tool.tool === "anthropic_api") {
    if (current > 500 && useCase !== "research") {
      return line(tool, current * 0.65, "Route batchable traffic to Haiku/Sonnet mix", "A cheaper model ladder and prompt caching usually cuts non-frontier Claude workloads by 25-40%.");
    }
  }

  if (tool.tool === "openai_api") {
    if (current > 400 && useCase !== "research") {
      return line(tool, current * 0.6, "Shift routine calls to GPT-5 mini or GPT-4.1 mini", "High-volume summarization, extraction, and classification rarely need flagship tokens.");
    }
  }

  if (tool.tool === "gemini") {
    if (tool.plan === "Ultra" && useCase !== "research" && useCase !== "data") {
      return line(tool, 19.99 * seats, "Downgrade Ultra to Google AI Pro", "Ultra is priced for highest-limit media and research usage, not everyday startup work.");
    }
  }

  if (tool.tool === "windsurf") {
    if (tool.plan === "Teams" && seats < 5) {
      return line(tool, 20 * seats, "Use Windsurf Pro before Teams", "Central billing and admin analytics are less valuable below 5 active developers.");
    }
    if (tool.plan === "Max" && useCase !== "coding") {
      return line(tool, 20 * seats, "Downgrade Max to Pro", "Max usage only pencils out when the coding agent is a daily development workflow.");
    }
  }

  if (current >= 800) {
    return line(tool, current * 0.8, "Negotiate enterprise discount or commit to annual billing", "Vendors typically offer 15-25% off list price for committed volume at this spend level.");
  }

  return line(tool, current, "Keep current setup", "Spend appears aligned with the stated team size and primary use case.");
}

export function buildTemplatedSummary(result: Omit<AuditResult, "summary">): string {
  if (result.monthlySavings >= 500) {
    return `Your AI stack has a clear savings opportunity: about $${result.monthlySavings.toLocaleString()} per month, mostly from plan-fit and model-tier gaps. The fastest path is to right-size small-team subscriptions, move routine API traffic to cheaper model tiers, and negotiate enterprise discounts on high-spend tools. The annualized opportunity justifies a procurement review.`;
  }
  if (result.monthlySavings < 100) {
    return `Your current AI spend is fairly disciplined for a ${result.teamSize}-person team. There may still be future savings as pricing changes, but the audit did not find a strong reason to force a downgrade today. The best next step is to monitor seat creep, API usage mix, and upcoming vendor pricing changes before renewal.`;
  }
  return `This audit found a moderate AI spend optimization opportunity of roughly $${result.monthlySavings.toLocaleString()} per month. The recommendations focus on matching plans to actual team size and moving commodity workloads away from premium tiers. None of the changes require a full tool migration, so the savings should be achievable without disrupting the team.`;
}

export function runAudit(input: AuditInput): AuditResult {
  const lines = input.tools.map((tool) => evaluateTool(tool, input.teamSize, input.useCase));
  const totalCurrent = currency(lines.reduce((sum, item) => sum + item.currentSpend, 0));
  const totalRecommended = currency(lines.reduce((sum, item) => sum + item.recommendedSpend, 0));
  const monthlySavings = currency(totalCurrent - totalRecommended);
  const base = {
    createdAt: new Date().toISOString(),
    teamSize: input.teamSize,
    useCase: input.useCase,
    totalCurrent,
    totalRecommended,
    monthlySavings,
    annualSavings: monthlySavings * 12,
    lines,
    highSavings: monthlySavings > 500
  };
  return {
    ...base,
    summary: buildTemplatedSummary(base)
  };
}
