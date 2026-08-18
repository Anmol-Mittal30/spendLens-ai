"use client";

import { useEffect, useState } from "react";
import { Trash2, Download, ExternalLink } from "lucide-react";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import { AuditPDF } from "./pdf-report";
import { getHistory, deleteAudit, clearHistory } from "./history";
import type { StoredAudit } from "./history";

export function HistoryPanel() {
  const [history, setHistory] = useState<StoredAudit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
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

  if (loading) return <div className="history-panel">Loading history…</div>;
  if (history.length === 0) return <div className="history-panel empty">No saved audits yet. Run an audit to save it here.</div>;

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>Local History</h3>
        <button className="secondary" type="button" onClick={handleClearAll}>
          Clear all
        </button>
      </div>
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
  );
}