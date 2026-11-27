import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FaqRow } from "@/components/ui/faq-row";

describe("FaqRow", () => {
  it("renders a collapsed question wired to its inert answer", () => {
    const { container } = render(
      <FaqRow id="faq-1" question="How does it work?" answer="It runs entirely on this machine." />,
    );

    const row = container.querySelector("li.hp-faq-row");
    expect(row).not.toBeNull();

    const question = screen.getByRole("button", { name: "How does it work?" });
    expect(question).toHaveAttribute("id", "faq-1-question");
    expect(question).toHaveAttribute("type", "button");
    expect(question).toHaveAttribute("aria-expanded", "false");
    expect(question).toHaveAttribute("aria-controls", "faq-1-answer");

    const answer = document.getElementById("faq-1-answer");
    expect(answer).not.toBeNull();
    expect(answer).toHaveAttribute("id", "faq-1-answer");
    expect(answer).toHaveAttribute("role", "region");
    expect(answer).toHaveAttribute("aria-labelledby", "faq-1-question");
    expect(answer).toHaveAttribute("data-open", "false");
    expect(answer).toHaveAttribute("inert");
    expect(answer).toHaveTextContent("It runs entirely on this machine.");

    expect(question.closest("li")).toBe(row);
    expect(answer?.closest("li")).toBe(row);

    const glyph = container.querySelector('[data-expanded="false"]');
    expect(glyph).not.toBeNull();
    expect(glyph).toHaveAttribute("aria-hidden", "true");
  });
});
