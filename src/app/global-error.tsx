"use client";

import { useEffect } from "react";

/**
 * Replaces the root layout when it fails, so it must render its own document
 * and cannot rely on globals.css.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0e0d0c",
          color: "#fbf9f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main style={{ maxWidth: 640, padding: 32 }}>
          <p style={{ fontFamily: "monospace", fontSize: 13, color: "#b9b4ad" }}>
            Application error
          </p>
          <h1 style={{ fontSize: 44, lineHeight: 1.05, margin: "16px 0" }}>
            Tano is temporarily unavailable.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: "#b9b4ad" }}>
            The application shell failed to render. Retry the request; if it keeps failing, check
            the server logs.
          </p>
          <button
            onClick={() => retry()}
            style={{
              marginTop: 24,
              padding: "12px 20px",
              borderRadius: 10,
              border: "1px solid #fbf9f5",
              background: "#fbf9f5",
              color: "#0e0d0c",
              fontSize: 15,
              cursor: "pointer",
            }}
            type="button"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
