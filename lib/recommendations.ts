import { AuditMetrics, Recommendation } from "@/types/audit";

export function generateRecommendations(metrics: AuditMetrics): Recommendation[] {
  const recs: Recommendation[] = [];

  if (!metrics.httpsActive) {
    recs.push({
      id: "https",
      title: "Enable HTTPS",
      description:
        "Your site isn't served over a secure connection. Install an SSL certificate as a priority — it affects visitor trust, SEO rankings, and triggers browser security warnings when missing.",
    });
  }

  if (metrics.mobileFriendly === false) {
    recs.push({
      id: "mobile",
      title: "Fix Mobile Viewport",
      description:
        "Your page is missing a proper responsive viewport configuration. Add a meta viewport tag so the layout adapts correctly on phones and tablets.",
    });
  } else if (metrics.mobileFriendly === null) {
    recs.push({
      id: "mobile-unknown",
      title: "Verify Mobile Viewport Manually",
      description:
        "We couldn't automatically confirm the mobile viewport configuration — the site may be blocking automated checks. Verify manually on a phone or with Chrome DevTools' device toolbar.",
    });
  }

  if (metrics.loadTimeSeconds > 3) {
    recs.push({
      id: "load-time",
      title: "Improve Page Load Time",
      description: `Your page loads in ${metrics.loadTimeSeconds.toFixed(
        1
      )} seconds. Compress images, enable browser caching, and minify CSS/JS to bring load times under 3 seconds and reduce bounce rates.`,
    });
  }

  if (metrics.seoScore < 80) {
    recs.push({
      id: "seo",
      title: "Boost SEO Score",
      description: `Your SEO score is ${Math.round(
        metrics.seoScore
      )}. Add descriptive meta titles and descriptions, improve heading structure, and ensure all images have alt attributes to increase search visibility.`,
    });
  }

  if (metrics.performanceScore < 80) {
    recs.push({
      id: "performance",
      title: "Address Performance Gaps",
      description:
        "Reduce render-blocking resources and defer offscreen content to raise your Performance Score above 80 for a smoother visitor experience.",
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "all-good",
      title: "Strong Overall Health",
      description:
        "No critical issues found. Keep monitoring performance and SEO regularly as the site grows to maintain these scores.",
    });
  }

  return recs;
}