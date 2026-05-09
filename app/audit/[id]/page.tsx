import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { decodeAudit } from "@/lib/share";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = decodeAudit(id);
  if (!audit) return {};
  const title =
    audit.monthlySavings < 100
      ? "AI spend audit: spending well"
      : `AI spend audit: $${audit.monthlySavings.toLocaleString()}/mo savings found`;
  const description = `${audit.lines.length} tools reviewed, $${audit.annualSavings.toLocaleString()} annual potential savings.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function PublicAuditPage({ params }: Props) {
  const { id } = await params;
  const audit = decodeAudit(id);
  if (!audit) notFound();

  return (
    <main className="shell">
      <nav className="topbar">
        <div className="brand">
          <span className="brand-mark">SL</span>
          <span>SpendLens AI</span>
        </div>
        <Link className="secondary" href="/">
          Run your audit
        </Link>
      </nav>
      <section className="results" style={{ paddingTop: 42 }}>
        <div className="result-panel">
          <span className="eyebrow">Public AI spend audit</span>
          <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 4.8rem)" }}>
            ${audit.monthlySavings.toLocaleString()}/mo in potential savings
          </h1>
          <p>{audit.summary}</p>
          <div className="savings">
            <div>
              <strong>${audit.totalCurrent.toLocaleString()}</strong>
              <span>current monthly spend</span>
            </div>
            <div>
              <strong>${audit.annualSavings.toLocaleString()}</strong>
              <span>annual savings</span>
            </div>
          </div>
        </div>

        <div className="result-panel" style={{ marginTop: 18 }}>
          <h2>Recommendations</h2>
          <div className="breakdown">
            {audit.lines.map((item) => (
              <div className="breakdown-item" key={item.id}>
                <div>
                  <h3>
                    {item.toolName}: ${item.currentSpend} → ${item.recommendedSpend}
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
    </main>
  );
}
