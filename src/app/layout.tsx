import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/sites/tano/shell/site-header";
import { SiteFooter } from "@/components/sites/tano/shell/site-footer";
import { Announcement } from "@/components/sites/tano/shell/announcement";
import { SiteConsent } from "@/components/sites/tano/shell/consent";
import { SiteDrawer } from "@/components/sites/tano/shell/site-drawer";
import { SiteRuntime } from "@/components/sites/tano/runtime";
import { SiteInteractions } from "@/components/sites/tano/interactions";
import { tanoGlyphSvg, tanoWordSvg } from "@/components/sites/tano/shell/logo-data";

export const metadata: Metadata = {
  title: "Tano — The Creator Advertising Platform",
  description:
    "Tano enables consumer brands to partner with creators programmatically, running it like a performance channel.",
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
          "--hp-notify-push": "120px",
        } as React.CSSProperties
      }
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function revealAll(){var root=document.querySelector(".rv-scope main");if(!root)return;root.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,figure,img,picture,video,table,hr,details,form,label,.hp-asset,.wire-media,.hp-band-actions,.hp-action,.wire-button,.tano-button,.wire-case-mark,.wire-case-stat,.wire-case-card,.wire-cg-item,.wire-cg,.gd-stage,.gd-frame,.gd-card,.gd-verdict,.gd-code,.gd-spec,.gd-band-actions,.gd-index-link,.gd-pager-link").forEach(function(el){el.classList.add("rv-in");});root.querySelectorAll('.hp-reveal[data-shown="false"]').forEach(function(el){el.setAttribute("data-shown","true");});}function ensure(){timer=0;if(!document.querySelector(".rv-scope main .rv-in"))revealAll();}setTimeout(ensure,3000);window.addEventListener("load",function(){setTimeout(ensure,1500);});})();`,
          }}
        />
        <div className="tano tano-light-ground wire brand wire-veiled rv-scope">
          <div className="wire-chrome-sentinel" aria-hidden="true" />
          <div className="wire-spectrum-rule" data-inview="true" />
          <SiteHeader glyphSvg={tanoGlyphSvg} wordSvg={tanoWordSvg} />
          <Announcement />
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
