import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { I18nProvider } from "./lib/i18n";

// Thmanyah Serif Text — the single type family for the whole site, English
// and Arabic alike. One variable serves every weight; next/font/local
// registers each file under the same family name with its own declared
// font-weight, so existing `font: 500 ... var(--font-thmanyah)` rules just
// pick the matching static weight automatically.
const thmanyah = localFont({
  variable: "--font-thmanyah",
  src: [
    { path: "./fonts/thmanyahseriftext/thmanyahseriftext-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/thmanyahseriftext/thmanyahseriftext-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/thmanyahseriftext/thmanyahseriftext-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/thmanyahseriftext/thmanyahseriftext-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/thmanyahseriftext/thmanyahseriftext-Black.woff2", weight: "900", style: "normal" },
  ],
});

/**
 * Absolute URLs for og:image and friends. Resolved per host so a preview
 * deployment does not advertise another origin's assets:
 *   1. NEXT_PUBLIC_SITE_URL — explicit override, wins everywhere
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the project's stable production domain
 *   3. the original Cloudflare/OpenAI host
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://anatomy-atelier.openai.site");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Organ Guide · دليل الأعضاء — Learn anatomy like an artist",
  description:
    "Explore medically detailed 3D organs — heart, brain, lungs, liver, kidneys, eye, intestine, pancreas, and skin — in English and Arabic. استكشف أعضاء الجسم بنماذج ثلاثية الأبعاد تفصيلية باللغتين العربية والإنجليزية.",
  applicationName: "Organ Guide · دليل الأعضاء",
  keywords: ["anatomy", "3D anatomy", "human body", "medical education", "interactive learning", "organs", "تشريح", "أعضاء الجسم", "تعليم طبي"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  // No og:image on purpose — the bundled artwork still carried the old
  // "Anatomy Atelier" branding and cream theme, so link previews render as a
  // plain title/description card rather than advertising a stale design.
  openGraph: {
    type: "website",
    siteName: "Organ Guide · دليل الأعضاء",
    title: "Organ Guide · دليل الأعضاء — Learn anatomy like an artist",
    description: "Learn anatomy like an artist through immersive, medically detailed 3D specimens, in English and Arabic.",
  },
  twitter: {
    card: "summary",
    title: "Organ Guide · دليل الأعضاء — Learn anatomy like an artist",
    description: "Learn anatomy like an artist through immersive, medically detailed 3D specimens, in English and Arabic.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f5",
  // Lets the layout reach under the notch and home indicator; the shell then
  // pads itself back with env(safe-area-inset-*) so nothing sits under them.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The stored language preference is restored on the client before first
    // paint (see initialLocale in lib/i18n.tsx), which can briefly diverge
    // from this server-rendered default — expected, and safe to suppress.
    <html lang="en" suppressHydrationWarning>
      <body className={thmanyah.variable}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
