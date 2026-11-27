"use client";

import { useEffect } from "react";
import { mountHomeMediaSections } from "../home/media-sections";

/** Owner: HomeMedia. Mounts main-page media behaviour and returns its cleanup. */
export function useHomeMedia(): void {
  useEffect(() => mountHomeMediaSections(), []);
}
