import { SITE } from "../components/SEO";

/** WebSite schema — rendered once on the landing page */
export function websiteSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE.name,
    "url": SITE.url,
    "description": SITE.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE.url}/therapists?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });
}

/** Organization schema — rendered once on the landing page */
export function organizationSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE.name,
    "url": SITE.url,
    "logo": SITE.logoUrl,
    "description": "WellNest connects people with licensed therapists and provides free mental wellness tools including self-assessments, journaling, and guided breathing.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "url": `${SITE.url}/contact`,
    },
    "sameAs": [],
  });
}

/** MedicalBusiness schema for the therapists listing page */
export function medicalBusinessSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": SITE.name,
    "url": `${SITE.url}/therapists`,
    "description": "Browse verified, licensed therapists on WellNest. Filter by specialty, language, session type, and availability.",
    "medicalSpecialty": ["Psychiatry", "Psychology", "Mental Health"],
    "priceRange": "₹₹",
  });
}

/** FAQ schema helper — pass an array of Q/A pairs */
export function faqSchema(items: { q: string; a: string }[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  });
}

/** Assessment tool schema */
export function assessmentSchema(name: string, description: string, url: string): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
    },
  });
}
