import { Helmet } from "react-helmet-async";

/* ── Site-wide constants ─────────────────────────────────────── */
export const SITE = {
  name:        "WellNest",
  url:         "https://wellnest.mohit.systems",
  title:       "WellNest — Online Therapy & Mental Wellness",
  description: "Find your matched therapist, take free mental health assessments, and build lasting wellbeing with WellNest. Compassionate, confidential, and accessible care.",
  logoUrl:     "https://wellnest.mohit.systems/wellnest-logo.svg",
  ogImage:     "https://wellnest.mohit.systems/og-default.svg",
  twitter:     "@mohitdotsystems",
  themeColor:  "#4a6b52",
};

interface SEOProps {
  /** Page title — automatically suffixed with " | WellNest" unless it already contains "WellNest" */
  title?: string;
  /** Meta description — 120–160 chars is ideal */
  description?: string;
  /** Canonical URL path, e.g. "/therapists". Full URL is constructed from SITE.url. */
  canonical?: string;
  /** Absolute URL to OG image. Defaults to SITE.ogImage. */
  ogImage?: string;
  /** "website" (default) or "article" */
  ogType?: "website" | "article";
  /** Prevent indexing — use for auth pages, dashboards, admin */
  noIndex?: boolean;
  /** Additional JSON-LD scripts (pass as stringified JSON) */
  jsonLd?: string[];
}

export default function SEO({
  title,
  description = SITE.description,
  canonical,
  ogImage = SITE.ogImage,
  ogType = "website",
  noIndex = false,
  jsonLd = [],
}: SEOProps) {
  const pageTitle = title
    ? title.includes("WellNest") ? title : `${title} | WellNest`
    : SITE.title;

  const canonicalUrl = canonical
    ? `${SITE.url}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : undefined;

  return (
    <Helmet>
      {/* ── Core ── */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      {!noIndex && <meta name="robots" content="index,follow" />}

      {/* ── Open Graph ── */}
      <meta property="og:type"        content={ogType} />
      <meta property="og:title"       content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:site_name"   content={SITE.name} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={SITE.twitter} />
      <meta name="twitter:title"       content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* ── JSON-LD structured data ── */}
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json">{schema}</script>
      ))}
    </Helmet>
  );
}
