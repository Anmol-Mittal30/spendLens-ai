"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Copy, Plus, Trash2, Download } from "lucide-react";
import { plansFor, TOOL_OPTIONS } from "@/lib/pricing";
import type { AuditInput, AuditResult, ToolInput, ToolKey, UseCase } from "@/lib/types";
import { AuditPDF } from "@/lib/pdf-report";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const starterTool = (): ToolInput => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
  tool: "cursor",
  plan: "Pro",
  monthlySpend: 20,
  seats: 2
});

const makeDefaultInput = (): AuditInput => ({
  teamSize: 6,
  useCase: "coding",
  tools: [starterTool()]
});

type ApiResult = {
  result: AuditResult;
  shareId: string;
};

export default function HomePage() {
  const [input, setInput] = useState<AuditInput>(() => makeDefaultInput());
  const [hydrated, setHydrated] = useState(false);
  const [audit, setAudit] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [leadStatus, setLeadStatus] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("spendlens-input");
      if (saved) {
        try {
          setInput(JSON.parse(saved) as AuditInput);
        } catch {
          window.localStorage.removeItem("spendlens-input");
        }
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("spendlens-input", JSON.stringify(input));
  }, [hydrated, input]);

  const shareUrl = useMemo(() => {
    if (!audit) return "";
    return `${window.location.origin}/audit/${audit.shareId}`;
  }, [audit]);

  async function handleDownloadPDF() {
    if (!audit) return;
    try {
      // pdf() creates a PDF instance in the browser (uses @react-pdf/renderer's browser build)
      // .toBlob() renders the PDF to a Blob client-side — no Node.js/server needed
      const blob = await pdf(<AuditPDF audit={audit.result} />).toBlob();
      saveAs(blob, `spendlens-audit-${audit.shareId.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  }

  function updateTool(id: string, patch: Partial<ToolInput>) {
    setInput((current) => ({
      ...current,
      tools: current.tools.map((tool) => {
        if (tool.id !== id) return tool;
        const nextTool = { ...tool, ...patch };
        if (patch.tool) nextTool.plan = plansFor(patch.tool)[0];
        return nextTool;
      })
    }));
  }

  async function runAudit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setLeadStatus("");
    const response = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    const data = (await response.json()) as ApiResult;
    setAudit(data);
    setLoading(false);
  }

  async function captureLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!audit) return;
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        company: form.get("company"),
        role: form.get("role"),
        teamSize: input.teamSize,
        website: form.get("website"),
        shareId: audit.shareId,
        result: audit.result
      })
    });
    setLeadStatus(response.ok ? "Report captured. Check your inbox if email is configured." : "Could not capture the report yet.");
  }

  return (
    <main className="shell">
      <nav className="topbar">
        <div className="brand">
          <span className="brand-mark">SL</span>
          <span>SpendLens AI</span>
        </div>
        <span className="eyebrow">Credex-ready audit</span>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">AI spend audit for startup teams</span>
          <h1>Stop paying retail for AI.</h1>
          <p>
            Map your AI stack, find plan-fit mistakes, and get a shareable audit that shows monthly and annual savings before anyone asks for an email.
          </p>
          <div className="metric-strip">
            <div className="metric">
              <strong>8</strong>
              <span>tool families covered</span>
            </div>
            <div className="metric">
              <strong>&lt;2 min</strong>
              <span>to first audit</span>
            </div>
            <div className="metric">
              <strong>$500+</strong>
              <span>Credex consult trigger</span>
            </div>
          </div>
        </div>

        <form className="panel" onSubmit={runAudit}>
          <div className="grid">
            <div className="field">
              <label>Team size</label>
              <input
                min={1}
                type="number"
                value={input.teamSize}
                onChange={(event) => setInput({ ...input, teamSize: Number(event.target.value) })}
              />
            </div>
            <div className="field">
              <label>Primary use case</label>
              <select value={input.useCase} onChange={(event) => setInput({ ...input, useCase: event.target.value as UseCase })}>
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          {input.tools.map((tool) => (
            <div className="tool-row" key={tool.id}>
              <div className="field">
                <label>Tool</label>
                <select value={tool.tool} onChange={(event) => updateTool(tool.id, { tool: event.target.value as ToolKey })}>
                  {TOOL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Plan</label>
                <select value={tool.plan} onChange={(event) => updateTool(tool.id, { plan: event.target.value })}>
                  {plansFor(tool.tool).map((plan) => (
                    <option key={plan}>{plan}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Seats</label>
                <input min={1} type="number" value={tool.seats} onChange={(event) => updateTool(tool.id, { seats: Number(event.target.value) })} />
              </div>
              <button
                className="icon-button"
                type="button"
                title="Remove tool"
                onClick={() => setInput({ ...input, tools: input.tools.filter((item) => item.id !== tool.id) })}
              >
                <Trash2 size={18} />
              </button>
              <div className="field">
                <label>Current monthly spend for custom/API/enterprise</label>
                <input
                  min={0}
                  type="number"
                  value={tool.monthlySpend}
                  onChange={(event) => updateTool(tool.id, { monthlySpend: Number(event.target.value) })}
                />
              </div>
            </div>
          ))}

          <div className="grid">
            <button className="secondary" type="button" onClick={() => setInput({ ...input, tools: [...input.tools, starterTool()] })}>
              <Plus size={18} /> Add tool
            </button>
            <button className="primary" disabled={loading} type="submit">
              {loading ? "Auditing..." : "Run audit"} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </section>

      {audit && (
        <section className="results">
          <div className="result-hero">
            <div className="result-panel">
              <span className="eyebrow">{audit.result.highSavings ? "Credex opportunity detected" : "Audit complete"}</span>
              <h2>{audit.result.monthlySavings < 100 ? "You're spending well." : "Your AI stack can be leaner."}</h2>
              <p>{audit.result.summary}</p>
              <div className="savings">
                <div>
                  <strong>${audit.result.monthlySavings.toLocaleString()}</strong>
                  <span>monthly savings</span>
                </div>
                <div>
                  <strong>${audit.result.annualSavings.toLocaleString()}</strong>
                  <span>annual savings</span>
                </div>
              </div>
              <div className="share-line">
                <input readOnly value={shareUrl} aria-label="Share URL" />
                <button className="secondary" type="button" title="Copy share URL" onClick={() => navigator.clipboard.writeText(shareUrl)}>
                  <Copy size={18} />
                </button>
                <button className="secondary" type="button" title="Download PDF" onClick={handleDownloadPDF}>
                  <Download size={18} />
                </button>
              </div>
            </div>

            <div className="lead-box">
              <h3>{audit.result.highSavings ? "Book the Credex savings review" : "Save this report"}</h3>
              <p>
                {audit.result.highSavings
                  ? "High-savings audits get routed for a Credex credit consultation."
                  : "Get notified when new pricing changes create savings for this stack."}
              </p>
              <form className="lead-form" onSubmit={captureLead}>
                <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />
                <div className="field">
                  <label>Email</label>
                  <input required name="email" type="email" placeholder="you@company.com" />
                </div>
                <div className="field">
                  <label>Company</label>
                  <input name="company" placeholder="Acme AI" />
                </div>
                <div className="field">
                  <label>Role</label>
                  <input name="role" placeholder="Founder, CTO, Eng Manager" />
                </div>
                <button className="primary" type="submit">
                  Capture report
                </button>
              </form>
              {leadStatus && <p>{leadStatus}</p>}
            </div>
          </div>

          <div className="result-panel" style={{ marginTop: 18 }}>
            <h2>Per-tool breakdown</h2>
            <div className="breakdown">
              {audit.result.lines.map((item) => (
                <div className="breakdown-item" key={item.id}>
                  <div>
                    <h3>
                      {item.toolName}: ${item.currentSpend} to ${item.recommendedSpend}
                    </h3>
                    <p>
                      <strong>{item.action}.</strong> {item.reason}
                    </p>
                  </div>
                  <div className={item.savings > 0 ? "positive" : "warning"}>${item.savings}/mo</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer>Built as a free lead-generation audit for Credex. Public share links exclude email and company details.</footer>
    </main>
  );
}
