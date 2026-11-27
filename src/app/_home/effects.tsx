"use client";

import { useConversations } from "./hooks/use-conversations";
import { useCounters } from "./hooks/use-counters";
import { useExperiments } from "./hooks/use-experiments";
import { useHeroCampaign } from "./hooks/use-hero-campaign";
import { useHomeInfo } from "./hooks/use-home-info";
import { useHomeMedia } from "./hooks/use-home-media";

/** Home-only behaviours, mounted with the home captured body. */
export function HomeEffects() {
  useHeroCampaign();
  useConversations();
  useExperiments();
  useHomeMedia();
  useHomeInfo();
  useCounters();

  return null;
}
