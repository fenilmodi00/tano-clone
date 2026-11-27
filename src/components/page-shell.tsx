import type { ReactNode } from "react";
import { PageEffects } from "@/app/_runtime/page-effects";

/**
 * Page-scope contract: effects mount after the page's captured body, inside the
 * route subtree. Keeping this in one component stops route files from drifting
 * on the hydration-safe mounting order.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <PageEffects />
    </>
  );
}
