export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolKey =
  | "cursor"
  | "copilot"
  | "claude"
  | "chatgpt"
  | "anthropic_api"
  | "openai_api"
  | "gemini"
  | "windsurf";

export type ToolInput = {
  id: string;
  tool: ToolKey;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
};

export type AuditLine = {
  id: string;
  tool: ToolKey;
  toolName: string;
  currentSpend: number;
  recommendedSpend: number;
  savings: number;
  action: string;
  reason: string;
  severity: "good" | "optimize" | "high";
  seats: number;
  plan: string;
};

export type AuditResult = {
  createdAt: string;
  teamSize: number;
  useCase: UseCase;
  totalCurrent: number;
  totalRecommended: number;
  monthlySavings: number;
  annualSavings: number;
  lines: AuditLine[];
  summary: string;
  highSavings: boolean;
};
