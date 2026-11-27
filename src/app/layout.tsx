import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ConsentBanner } from "@/components/layout/consent-banner";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteRuntime } from "./_runtime/site-runtime";
import { GlobalInteractions } from "./_runtime/global-interactions";
import { glyphSvg, wordSvg } from "@/components/layout/logo-svg";
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
  preload("/sites/tano/fonts/ABCWhyte-Book.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  preload("/sites/tano/fonts/ABCWhyte-Medium.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var n=performance.getEntriesByType("navigation")[0];var target=0;if(n&&n.type==="reload"){history.scrollRestoration="manual";var saved=sessionStorage.getItem("tano:scroll:"+location.pathname);if(saved)target=Number(saved)||0}window.__tanoRestoreY=target;var started=Date.now();function ready(){document.documentElement.setAttribute("data-page-ready","")}function settle(){if(target>0){if(document.documentElement.scrollHeight<target+innerHeight){if(Date.now()-started<6000)return setTimeout(settle,50)}window.scrollTo(0,target);if(Date.now()-started<700)return setTimeout(settle,50)}ready()}if(document.readyState==="complete")settle();else addEventListener("load",settle,{once:true})}catch(e){document.documentElement.setAttribute("data-page-ready","")}})()`,
          }}
        />
        <div className="wire-boot-mask" aria-hidden="true">
          <span className="wire-boot-bar" />
        </div>
        <div className="tano tano-light-ground wire brand wire-veiled rv-scope">
          <div className="wire-chrome-sentinel" aria-hidden="true" />
          <div className="wire-spectrum-rule" data-inview="true" />
          <Header glyphSvg={glyphSvg} wordSvg={wordSvg} />
          <ConsentBanner />
          <MobileNav />
          {children}
          <Footer glyphSvg={glyphSvg} />
          <GlobalInteractions />
          <SiteRuntime />
        </div>
      </body>
    </html>
  );
}
