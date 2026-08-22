import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AuditResult, AuditLine } from "./types";

// Professional color palette
const colors = {
  primary: "#0f172a",      // Slate 900
  secondary: "#334155",    // Slate 700
  muted: "#64748b",        // Slate 500
  light: "#f1f5f9",        // Slate 100
  border: "#e2e8f0",       // Slate 200
  success: "#059669",      // Emerald 600
  warning: "#d97706",      // Amber 600
  accent: "#2563eb",       // Blue 600
  white: "#ffffff",
};

const styles = StyleSheet.create({
  // Page layout
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: colors.primary, lineHeight: 1.5 },

  // Header section
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 16, borderBottom: `2px solid ${colors.accent}` },
  logo: { fontSize: 20, fontWeight: "bold", color: colors.accent },
  badge: { backgroundColor: colors.accent, color: colors.white, fontSize: 8, fontWeight: "bold", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" },
  title: { fontSize: 22, fontWeight: "bold", color: colors.primary, marginTop: 4 },
  subtitle: { fontSize: 10, color: colors.muted, marginTop: 2 },

  // Meta grid
  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 20, marginBottom: 24, padding: 16, backgroundColor: colors.light, borderRadius: 8 },
  metaItem: { flex: 1, minWidth: 120 },
  metaLabel: { fontSize: 8, fontWeight: "bold", color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  metaValue: { fontSize: 12, fontWeight: "600", color: colors.primary },

  // Savings highlight card
  savingsCard: { backgroundColor: "#ecfdf5", border: `1px solid #a7f3d0`, borderRadius: 8, padding: 16, marginBottom: 24 },
  savingsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  savingsMonthly: { fontSize: 28, fontWeight: "bold", color: colors.success },
  savingsAnnual: { fontSize: 14, fontWeight: "600", color: colors.success, opacity: 0.8 },
  savingsLabel: { fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5 },

  // Section title
  sectionTitle: { fontSize: 12, fontWeight: "bold", color: colors.primary, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${colors.border}`, paddingBottom: 6 },

  // Table styles
  tableHeader: { flexDirection: "row", padding: "8px 10px", backgroundColor: colors.primary, color: colors.white, fontSize: 9, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 0.5 },
  tableRow: { flexDirection: "row", padding: "10px", borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.white },
  tableRowAlt: { flexDirection: "row", padding: "10px", borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.light },
  colTool: { width: "22%", fontWeight: "600" },
  colCurrent: { width: "14%", textAlign: "right" },
  colRecommended: { width: "14%", textAlign: "right" },
  colSavings: { width: "14%", textAlign: "right", fontWeight: "600" },
  colAction: { width: "36%" },

  // Detail row (expandable info under each tool)
  detailRow: { flexDirection: "row", padding: "8px 10px", backgroundColor: "#fafafa", borderBottom: `1px solid ${colors.border}` },
  detailLabel: { width: "22%", fontSize: 8, color: colors.muted, fontWeight: "600" },
  detailValue: { width: "78%", fontSize: 8, color: colors.secondary },

  // Summary section
  summaryBox: { marginTop: 20, padding: 16, backgroundColor: colors.light, borderRadius: 8, border: `1px solid ${colors.border}` },
  summaryText: { fontSize: 10, lineHeight: 1.7, color: colors.secondary },

  // Footer
  footer: { marginTop: 30, paddingTop: 16, borderTop: `1px solid ${colors.border}`, textAlign: "center", fontSize: 8, color: colors.muted },
  footerLink: { color: colors.accent, textDecoration: "none" },

  // High savings banner
  highSavingsBanner: { backgroundColor: "#fef3c7", border: `1px solid #fcd34d`, borderRadius: 8, padding: 12, marginBottom: 20 },
  highSavingsText: { fontSize: 10, fontWeight: "600", color: "#92400e" },

  // Tool name with plan
  toolNamePlan: { fontSize: 10, fontWeight: "600", color: colors.primary },
  toolPlan: { fontSize: 8, color: colors.muted, marginTop: 1 },

  // Severity indicator
  severityDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6, marginTop: 2 },
  severityHigh: { backgroundColor: colors.warning },
  severityOptimize: { backgroundColor: colors.accent },
  severityGood: { backgroundColor: colors.success },
});

function severityColor(severity: AuditLine["severity"]) {
  switch (severity) {
    case "high": return styles.severityHigh;
    case "optimize": return styles.severityOptimize;
    default: return styles.severityGood;
  }
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString()}`;
}

export function AuditPDF({ audit }: { audit: AuditResult }) {
  const isHighSavings = audit.highSavings;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.logo}>SpendLens AI</Text>
            <Text style={styles.badge}>Audit Report</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={styles.metaLabel}>Generated</Text>
            <Text style={styles.metaValue}>{new Date(audit.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Text>
          </View>
        </View>

        <Text style={styles.title}>AI Spend Audit</Text>
        <Text style={styles.subtitle}>Personalized recommendations for optimizing your AI tool stack</Text>

        {/* High savings banner */}
        {isHighSavings && (
          <View style={styles.highSavingsBanner}>
            <Text style={styles.highSavingsText}>⚡ High Savings Opportunity — Consider booking a savings review</Text>
          </View>
        )}

        {/* Meta Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Team Size</Text>
            <Text style={styles.metaValue}>{audit.teamSize} people</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Primary Use Case</Text>
            <Text style={styles.metaValue}>{audit.useCase.charAt(0).toUpperCase() + audit.useCase.slice(1)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Tools Reviewed</Text>
            <Text style={styles.metaValue}>{audit.lines.length}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Current Monthly Spend</Text>
            <Text style={styles.metaValue}>{formatCurrency(audit.totalCurrent)}/mo</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Recommended Spend</Text>
            <Text style={styles.metaValue}>{formatCurrency(audit.totalRecommended)}/mo</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Monthly Savings</Text>
            <Text style={{ ...styles.metaValue, color: colors.success }}>{formatCurrency(audit.monthlySavings)}/mo</Text>
          </View>
        </View>

        {/* Savings Highlight Card */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsRow}>
            <View>
              <Text style={styles.savingsLabel}>Monthly Savings</Text>
              <Text style={styles.savingsMonthly}>{formatCurrency(audit.monthlySavings)}</Text>
            </View>
            <View style={{ textAlign: "right" }}>
              <Text style={styles.savingsLabel}>Annual Savings</Text>
              <Text style={styles.savingsAnnual}>{formatCurrency(audit.annualSavings)}</Text>
            </View>
          </View>
        </View>

        {/* Recommendations Table */}
        <Text style={styles.sectionTitle}>Per-Tool Recommendations</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.colTool}>Tool / Plan</Text>
          <Text style={styles.colCurrent}>Current</Text>
          <Text style={styles.colRecommended}>Recommended</Text>
          <Text style={styles.colSavings}>Savings</Text>
          <Text style={styles.colAction}>Action & Reason</Text>
        </View>

        {audit.lines.map((line, index) => (
          <View key={line.id}>
            <View style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <View style={styles.colTool}>
                <Text style={styles.toolNamePlan}>{line.toolName}</Text>
                <Text style={styles.toolPlan}>{line.severity === "good" ? "✓ Well-configured" : "⚠ Review needed"}</Text>
              </View>
              <Text style={styles.colCurrent}>{formatCurrency(line.currentSpend)}</Text>
              <Text style={styles.colRecommended}>{formatCurrency(line.recommendedSpend)}</Text>
              <Text style={{ ...styles.colSavings, color: line.savings > 0 ? colors.success : colors.warning }}>
                {line.savings > 0 ? "-" : "+"}{formatCurrency(Math.abs(line.savings))}
              </Text>
              <View style={styles.colAction}>
                <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                  <View style={severityColor(line.severity)} />
                  <Text style={{ fontSize: 9, color: colors.secondary, flex: 1 }}><Text style={{ fontWeight: "600" }}>{line.action}.</Text> {line.reason}</Text>
                </View>
              </View>
            </View>

            {/* Detail row with seats & plan info */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Seats / Plan</Text>
              <Text style={styles.detailValue}>{line.currentSpend > 0 ? `${line.seats || "N/A"} seat(s) • ${line.toolName} Plan` : "Custom/API spend"}</Text>
            </View>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <Text style={styles.summaryText}>{audit.summary}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by SpendLens AI — {new Date().toLocaleDateString()}</Text>
          <Text style={{ marginTop: 4 }}>This report excludes email and company details. Public share links are safe to distribute.</Text>
          <Text style={{ marginTop: 8 }}>SpendLens AI — Free AI spend audit for startup teams</Text>
        </View>
      </Page>
    </Document>
  );
}