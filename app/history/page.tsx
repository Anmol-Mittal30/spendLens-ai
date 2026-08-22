"use client";

import { Trash2, Download, ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { AuditPDF } from "@/lib/pdf-report";
import { getHistory, deleteAudit, clearHistory } from "@/lib/history";
import type { StoredAudit } from "@/lib/history";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<StoredAudit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    async function init() {
      await loadHistory();
      if (!mounted) return;
    }
    init();
    window.addEventListener("spendlens-history-updated", loadHistory);
    return () => {
      mounted = false;
      window.removeEventListener("spendlens-history-updated", loadHistory);
    };
  }, []);

  async function handleDownload(audit: StoredAudit) {
    try {
      const blob = await pdf(<AuditPDF audit={audit.result} />).toBlob();
      saveAs(blob, `spendlens-audit-${audit.shareId.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  }

  async function handleDelete(shareId: string) {
    if (!window.confirm("Delete this audit from history?")) return;
    await deleteAudit(shareId);
    setHistory((prev) => prev.filter((a) => a.shareId !== shareId));
  }

  async function handleClearAll() {
    if (!window.confirm("Clear all audit history?")) return;
    await clearHistory();
    setHistory([]);
  }

  return (
    <main className="shell">
      <nav className="topbar">
        <div className="brand">
          <span className="brand-mark">SL</span>
          <span>SpendLens AI</span>
        </div>
        <Link href="/" className="secondary" style={{ textDecoration: "none" }}>
          Run new audit
        </Link>
      </nav>

      <section className="hero" style={{ gridTemplateColumns: "1fr", paddingBottom: 0 }}>
        <div className="panel">
          <div className="history-header">
            <h2>Local Audit History</h2>
            <div className="history-actions-top">
              <button className="secondary" type="button" onClick={loadHistory} disabled={loading}>
                <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
              </button>
              {history.length > 0 && (
                <button className="secondary" type="button" onClick={handleClearAll}>
                  Clear all
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="history-panel">Loading history…</div>
          ) : history.length === 0 ? (
            <div className="history-panel empty">
              <p>No saved audits yet.</p>
              <Link href="/" className="primary" style={{ display: "inline-flex", marginTop: 12, textDecoration: "none" }}>
                Run your first audit
              </Link>
            </div>
          ) : (
            <div className="history-panel">
              <div className="history-list">
                {history.map((audit) => (
                  <div className="history-item" key={audit.shareId}>
                    <div className="history-meta">
                      <div>
                        <strong>${audit.result.monthlySavings.toLocaleString()}/mo</strong>
                        <span>saved</span>
                      </div>
                      <div>
                        <span className="eyebrow">{audit.result.teamSize} person team</span>
                        <span className="eyebrow">{audit.result.useCase}</span>
                      </div>
                      <div className="history-date">
                        {new Date(audit.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="history-actions">
                      <button className="icon-button" title="Download PDF" onClick={() => handleDownload(audit)}>
                        <Download size={16} />
                      </button>
                      <a
                        className="icon-button"
                        href={`/audit/${audit.shareId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open report"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button className="icon-button danger" title="Delete" onClick={() => handleDelete(audit.shareId)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer>Built as a free AI spend audit tool. Data stored locally in your browser.</footer>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .history-actions-top {
          display: flex;
          gap: 10px;
        }
        .history-panel {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--panel);
        }
        .history-panel.empty {
          padding: 48px;
          text-align: center;
          color: var(--muted);
        }
        .history-list {
          display: grid;
          gap: 12px;
          padding: 16px;
        }
        .history-item {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: center;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--panel);
          padding: 14px 16px;
          box-shadow: 0 2px 8px rgba(29, 38, 57, 0.06);
        }
        .history-meta {
          display: grid;
          gap: 6px;
        }
        .history-meta strong {
          font-size: 1.2rem;
        }
        .history-meta span {
          color: var(--muted);
          font-size: 0.9rem;
        }
        .history-date {
          font-size: 0.82rem;
          color: var(--muted);
        }
        .history-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .history-actions .icon-button.danger {
          border-color: var(--red);
          color: var(--red);
        }
        @media (max-width: 620px) {
          .history-item {
            grid-template-columns: 1fr;
          }
          .history-actions {
            justify-content: flex-start;
          }
        }
      `}</style>
    </main>
  );
}