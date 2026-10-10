import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/site/SiteFooter";
import SiteNav from "@/components/site/SiteNav";
import { MOCK } from "@/lib/api";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const DESCRIPTION =
  "Upload a showroom clip and see per-car interest, staff response times and visitors who were left waiting.";

export const metadata: Metadata = {
  title: { default: "ShowroomPulse AI", template: "%s | ShowroomPulse AI" },
  description: DESCRIPTION,
  openGraph: {
    title: "ShowroomPulse AI",
    description: DESCRIPTION,
    type: "website",
  },
  twitter: { card: "summary", title: "ShowroomPulse AI", description: DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0c0f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 sm:pt-28">
          {children}
        </main>
        <SiteFooter />
        {MOCK && (
          <div className="fixed bottom-3 left-3 z-40 rounded-full bg-warn px-3 py-1 text-[11px] font-semibold text-accent-ink">
            Mock data (dev only)
          </div>
        )}
      </body>
    </html>
  );
}
