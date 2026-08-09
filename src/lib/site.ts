/** Make a bare domain like "example.com" a full URL (defaults to https). */
function normalizeUrl(raw: string | undefined): string {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "http://localhost:3000";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "My Portfolio",
  title: "Selected work",
  description:
    "A curated index of web projects — products, sites, and experiments I've designed and built.",
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  email: process.env.NEXT_PUBLIC_SITE_EMAIL ?? "hello@example.com",
  availability: "Open for projects",
  role: "Design / Code",
} as const;
