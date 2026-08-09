import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#f2f2ef",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(242,242,239,0.55)",
          }}
        >
          <span>{siteConfig.name}</span>
          <span>Portfolio</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#ff4d24",
              marginBottom: 28,
            }}
          >
            Index of web projects
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 108,
              fontWeight: 600,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            <span>Selected </span>
            <span style={{ fontStyle: "italic" }}>work</span>
            <span style={{ color: "#ff4d24" }}>.</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
