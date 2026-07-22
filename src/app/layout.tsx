import type { Metadata, Viewport } from "next";

import "./globals.css";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "AlgoNotes — DSA documentation that sticks",
    template: "%s | AlgoNotes",
  },
  description: siteConfig.description,
  applicationName: "AlgoNotes",
  keywords: ["data structures", "algorithms", "DSA", "coding interviews", "competitive programming"],
  authors: [{ name: "AlgoNotes" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: "AlgoNotes — DSA documentation that sticks",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "AlgoNotes — DSA documentation that sticks",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

import { ThemeProvider } from "@/components/providers";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
