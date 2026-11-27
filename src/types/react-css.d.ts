import type * as React from "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }

  namespace JSX {
    interface IntrinsicElements {
      "mux-player": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        nohotkeys?: boolean | string;
        placeholder?: string;
        [key: string]: unknown;
      };
    }
  }
}
