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
 * Absolute URLs for canonical links and friends. Resolved per host so a
 * preview deployment does not advertise another origin's assets:
 *   1. NEXT_PUBLIC_SITE_URL — explicit override, wins everywhere
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the project's stable production domain
 *   3. the production domain, as a local-development fallback
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://organ-guide.vercel.app");

// Arabic leads the title and description, matching the locale the site opens in.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "دليل الأعضاء · Organ Guide — تعلّم علم التشريح كفنان",
  description:
    "استكشف أعضاء جسم الإنسان — القلب والدماغ والرئتين والكبد والكليتين والعين والأمعاء والبنكرياس والجلد — بنماذج ثلاثية الأبعاد تفاعلية، بالعربية والإنجليزية. Explore medically detailed 3D organs in Arabic and English.",
  applicationName: "دليل الأعضاء · Organ Guide",
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
    locale: "ar_SA",
    alternateLocale: "en_US",
    siteName: "دليل الأعضاء · Organ Guide",
    title: "دليل الأعضاء · Organ Guide — تعلّم علم التشريح كفنان",
    description: "استكشف أعضاء جسم الإنسان بنماذج ثلاثية الأبعاد تفاعلية ومحتوى طبي مفصّل، بالعربية والإنجليزية.",
  },
  twitter: {
    card: "summary",
    title: "دليل الأعضاء · Organ Guide — تعلّم علم التشريح كفنان",
    description: "استكشف أعضاء جسم الإنسان بنماذج ثلاثية الأبعاد تفاعلية ومحتوى طبي مفصّل، بالعربية والإنجليزية.",
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
    // Arabic is the site's default locale, so the document declares it up
    // front: the first paint is already RTL with the Arabic wordmark sizing,
    // with no flash of English before hydration. I18nProvider starts on the
    // same locale and keeps these attributes in step when the reader
    // switches. suppressHydrationWarning covers the attribute rewrite.
    <html lang="ar" dir="rtl" data-theme="ar" suppressHydrationWarning>
      <body className={thmanyah.variable}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
