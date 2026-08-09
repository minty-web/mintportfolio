export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "My Portfolio",
  title: "Selected work",
  description:
    "A curated index of web projects — products, sites, and experiments I've designed and built.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: process.env.NEXT_PUBLIC_SITE_EMAIL ?? "hello@example.com",
  availability: "Open for projects",
  role: "Design / Code",
} as const;
