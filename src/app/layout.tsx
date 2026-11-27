import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/sites/tano/shell/site-header";
import { SiteFooter } from "@/components/sites/tano/shell/site-footer";
import { SiteConsent } from "@/components/sites/tano/shell/consent";
import { SiteDrawer } from "@/components/sites/tano/shell/site-drawer";
import { SiteRuntime } from "@/components/sites/tano/runtime";
import { SiteInteractions } from "@/components/sites/tano/interactions";
import { tanoGlyphSvg, tanoWordSvg } from "@/components/sites/tano/shell/logo-data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — The Creator Advertising Platform`,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: `${site.name} — The Creator Advertising Platform`,
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: site.locale,
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — The Creator Advertising Platform`,
    description: site.description,
    images: ["/opengraph-image"],
  },
  robots: { index: site.allowIndexing, follow: site.allowIndexing },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-ground-tone="dark"
      data-ground-ready=""
      suppressHydrationWarning
      style={
        {
          "--ground-t": "1.000",
          "--ink-t": "1.000",
        } as React.CSSProperties
      }
    >
      <body>
        <div className="tano tano-light-ground wire brand wire-veiled rv-scope">
          <div className="wire-chrome-sentinel" aria-hidden="true" />
          <div className="wire-spectrum-rule" data-inview="true" />
          <SiteHeader glyphSvg={tanoGlyphSvg} wordSvg={tanoWordSvg} />
          <SiteConsent />
          <SiteDrawer />
          {children}
          <SiteFooter glyphSvg={tanoGlyphSvg} />
          <SiteInteractions />
          <SiteRuntime />
        </div>
      </body>
    </html>
  );
}
