import type { ReactNode } from "react";
import { CaseStudyEffects } from "./_components/case-study-effects";

export default function CaseStudiesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CaseStudyEffects />
    </>
  );
}
