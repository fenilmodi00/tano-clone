"use client";

import { useEffect } from "react";

/**
 * Page behaviours reconstructed from the source runtime: FAQ accordion,
 * category tabs, FAQ search, comparison notes, hero campaign switching,
 * live counters, and the logo marquee.
 * All handlers are delegated so they also cover server-rendered markup.
 */
export function GlobalInteractions() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    /* FAQ ------------------------------------------------------------------ */
    const onFaqClick = (event: Event) => {
      const trigger = (event.target as Element).closest<HTMLButtonElement>(".hp-faq-trigger");
      if (trigger) {
        const answer = document.getElementById(trigger.getAttribute("aria-controls") || "");
        const open = trigger.getAttribute("aria-expanded") !== "true";
        const stack = trigger.closest(".hp-faq-card");
        for (const other of Array.from(
          stack?.querySelectorAll<HTMLButtonElement>(".hp-faq-trigger") ?? [],
        )) {
          if (other === trigger) continue;
          other.setAttribute("aria-expanded", "false");
          const otherAnswer = document.getElementById(other.getAttribute("aria-controls") || "");
          otherAnswer?.setAttribute("data-open", "false");
          otherAnswer?.setAttribute("inert", "");
        }
        trigger.setAttribute("aria-expanded", String(open));
        answer?.setAttribute("data-open", String(open));
        if (answer) {
          if (open) answer.removeAttribute("inert");
          else answer.setAttribute("inert", "");
        }
      }

      const tab = (event.target as Element).closest<HTMLButtonElement>(".hp-faq-tab");
      if (tab) {
        const tabs = Array.from(
          tab.closest(".hp-faq-tabs")?.querySelectorAll<HTMLButtonElement>(".hp-faq-tab") ?? [],
        );
        for (const item of tabs) {
          const active = item === tab;
          item.dataset.active = String(active);
          item.setAttribute("aria-selected", String(active));
          item.setAttribute("tabindex", active ? "0" : "-1");
        }
      }

      const info = (event.target as Element).closest<HTMLButtonElement>(".hp-table-info");
      if (info) {
        const open = info.getAttribute("aria-expanded") !== "true";
        info.setAttribute("aria-expanded", String(open));
        const answer = info.closest(".hp-table-answer");
        answer?.setAttribute("data-open", String(open));
        const note = answer?.querySelector<HTMLElement>(".hp-table-note");
        note?.setAttribute("data-open", String(open));
      }
    };

    const onFaqInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (!input.classList.contains("hp-faq-search-input")) return;
      const query = input.value.trim().toLowerCase();
      const stack = input.closest(".hp-faq-stack");
      let visible = 0;
      for (const row of Array.from(stack?.querySelectorAll<HTMLElement>(".hp-faq-row") ?? [])) {
        const match = !query || (row.textContent || "").toLowerCase().includes(query);
        row.hidden = !match;
        if (match) visible++;
      }
      const status = stack?.querySelector<HTMLElement>(".hp-faq-card > .wire-visually-hidden");
      if (status)
        status.textContent = query ? `${visible} questions match "${input.value.trim()}"` : "";
    };

    document.addEventListener("click", onFaqClick);
    document.addEventListener("input", onFaqInput);

    return () => {
      document.removeEventListener("click", onFaqClick);
      document.removeEventListener("input", onFaqInput);
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return null;
}
