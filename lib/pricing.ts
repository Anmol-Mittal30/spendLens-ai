import type { ToolKey } from "./types";

export const TOOL_LABELS: Record<ToolKey, string> = {
  cursor: "Cursor",
  copilot: "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  anthropic_api: "Anthropic API direct",
  openai_api: "OpenAI API direct",
  gemini: "Gemini",
  windsurf: "Windsurf"
};

export const PLAN_PRICES: Record<ToolKey, Record<string, number | null>> = {
  cursor: {
    Hobby: 0,
    Pro: 20,
    Business: 40,
    Enterprise: null
  },
  copilot: {
    Individual: 10,
    Business: 19,
    Enterprise: 39
  },
  claude: {
    Free: 0,
    Pro: 20,
    Max: 100,
    Team: 30,
    Enterprise: null,
    "API direct": null
  },
  chatgpt: {
    Plus: 20,
    Pro: 200,
    Team: 30,
    Enterprise: null,
    "API direct": null
  },
  anthropic_api: {
    "Claude Sonnet": null,
    "Claude Haiku": null,
    "Claude Opus": null
  },
  openai_api: {
    "GPT-5.1": null,
    "GPT-5 mini": null,
    "GPT-4.1": null
  },
  gemini: {
    Free: 0,
    Pro: 19.99,
    Ultra: 249.99,
    API: null
  },
  windsurf: {
    Free: 0,
    Pro: 20,
    Max: 200,
    Teams: 40,
    Enterprise: null
  }
};

export const TOOL_OPTIONS = Object.entries(TOOL_LABELS).map(([value, label]) => ({
  value: value as ToolKey,
  label
}));

export function plansFor(tool: ToolKey) {
  return Object.keys(PLAN_PRICES[tool]);
}
