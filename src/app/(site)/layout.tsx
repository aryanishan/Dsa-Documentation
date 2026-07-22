import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/providers";
import { getSearchIndex } from "@/lib/docs";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const documents = getSearchIndex();
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SiteHeader documents={documents} />
      <main id="main-content" className="min-h-[calc(100vh-8.75rem)]">{children}</main>
      <SiteFooter />
    </ThemeProvider>
  );
}
