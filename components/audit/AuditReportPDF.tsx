import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { AuditResult, BadgeStatus } from "@/types/audit";
import { badgeLabel, booleanStatus, loadTimeStatus, scoreStatus } from "@/lib/scoring";
import { generateRecommendations } from "@/lib/recommendations";

const COLORS = {
  navy: "#0E1B36",
  brand: "#2F6FED",
  muted: "#6B7280",
  border: "#E5E7EB",
  green: "#16A34A",
  orange: "#F97316",
  red: "#EF4444",
};

const statusColor: Record<BadgeStatus, string> = {
  green: COLORS.green,
  orange: COLORS.orange,
  red: COLORS.red,
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, color: COLORS.navy, fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `2px solid ${COLORS.navy}`,
    paddingBottom: 12,
    marginBottom: 20,
  },
  brandName: { fontSize: 14, fontWeight: 700, color: COLORS.navy },
  subtitle: { fontSize: 9, color: COLORS.muted },
  metaBlock: { marginBottom: 18 },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 10, marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  card: {
    width: "31.3%",
    marginRight: "3%",
    marginBottom: 12,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: 10,
  },
  cardLabel: { fontSize: 8, color: COLORS.muted, marginBottom: 6 },
  cardValue: { fontSize: 16, fontWeight: 700, marginBottom: 8 },
  badge: {
    alignSelf: "flex-start",
    color: "#ffffff",
    fontSize: 7,
    fontWeight: 700,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  recoItem: { marginBottom: 10 },
  recoTitle: { fontSize: 10, fontWeight: 700, color: COLORS.brand, marginBottom: 2 },
  recoDesc: { fontSize: 9, color: COLORS.muted, lineHeight: 1.4 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    borderTop: `1px solid ${COLORS.border}`,
    paddingTop: 8,
    fontSize: 8,
    color: COLORS.muted,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function AuditReportPDF({ result }: { result: AuditResult }) {
  const { metrics } = result;
  const recommendations = generateRecommendations(metrics);

  const cards = [
    { label: "Performance Score", value: `${metrics.performanceScore}`, status: scoreStatus(metrics.performanceScore) },
    { label: "HTTPS Active", value: metrics.httpsActive ? "Yes" : "No", status: booleanStatus(metrics.httpsActive) },
    { label: "Mobile-Friendly", value: metrics.mobileFriendly ? "Yes" : "No", status: booleanStatus(metrics.mobileFriendly) },
    { label: "Page Load Time", value: `${metrics.loadTimeSeconds.toFixed(1)}s`, status: loadTimeStatus(metrics.loadTimeSeconds) },
    { label: "SEO Score", value: `${metrics.seoScore}`, status: scoreStatus(metrics.seoScore) },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brandName}>Audit Digital Express</Text>
          <Text style={styles.subtitle}>Generated {formatDate(result.auditDate)}</Text>
        </View>

        <View style={styles.metaBlock}>
          <Text style={styles.title}>{result.companyName}</Text>
          <Text style={styles.subtitle}>{result.url}</Text>
        </View>

        <Text style={styles.sectionTitle}>Audit Results</Text>
        <View style={styles.grid}>
          {cards.map((card) => (
            <View key={card.label} style={styles.card}>
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
              <Text style={{ ...styles.badge, backgroundColor: statusColor[card.status] }}>
                {badgeLabel[card.status]}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recommendations</Text>
        {recommendations.map((rec) => (
          <View key={rec.id} style={styles.recoItem}>
            <Text style={styles.recoTitle}>{rec.title}</Text>
            <Text style={styles.recoDesc}>{rec.description}</Text>
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text>Audit Digital Express — agency-grade audits, generated in seconds.</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}