"use client";

import type { ReactNode } from "react";
import { useCaseStudyMedia } from "./_components/use-case-study-media";

export default function CaseStudiesLayout({ children }: { children: ReactNode }) {
  useCaseStudyMedia();

  return <>{children}</>;
}
