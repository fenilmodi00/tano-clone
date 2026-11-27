"use client";

import { useCaseStudyMedia } from "./use-case-study-media";

/** Case-study-only media behaviour, mounted by the case-studies layout. */
export function CaseStudyEffects() {
  useCaseStudyMedia();

  return null;
}
