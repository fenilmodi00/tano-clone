"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { mountHeroCampaign } from "../hero-campaign";

/**
 * Owner: HeroCampaign. Mounts the four-reel hero campaign once per route and
 * releases every observer, timer and video on navigation or unmount.
 */
export function useHeroCampaign(): void {
  const pathname = usePathname();

  useEffect(() => {
    const camp = document.querySelector<HTMLElement>(".hp-camp");
    if (!camp) return;
    return mountHeroCampaign(camp);
  }, [pathname]);
}
