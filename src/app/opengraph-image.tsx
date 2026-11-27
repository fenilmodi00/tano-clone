import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "Tano — The Creator Advertising Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0e0d0c",
          color: "#fbf9f5",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "linear-gradient(135deg, #46b7d1, #cc6add, #fb751f)",
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: -0.6 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 82, lineHeight: 1, letterSpacing: -3, maxWidth: 900 }}>
            The Creator Advertising Platform
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#b9b4ad", maxWidth: 780 }}>
            Run creator programmes like a performance channel: sourcing, outreach, gifting, payment
            and reporting.
          </div>
        </div>
        <div
          style={{
            height: 6,
            width: "100%",
            borderRadius: 999,
            background:
              "linear-gradient(90deg, #ed5263, #fb751f, #f3c507, #89de16, #46b7d1, #8464e3, #cc6add)",
          }}
        />
      </div>
    ),
    size,
  );
}
