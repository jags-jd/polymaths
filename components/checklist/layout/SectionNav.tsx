"use client";

import { Check } from "lucide-react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { FOCUS } from "@/components/checklist/layout/Trackables";
import { isComplete, sectionProgress } from "@/lib/games/progress";
import { cn } from "@/lib/utils";

/**
 * Jump to section — docs/spec.md: a row of section links showing each
 * section's progress, with a mark when complete. Plain anchors, as in the
 * mockups; one swipeable line on phones, wrapped from `sm`.
 */
export function SectionNav() {
  const { game, progress } = useChecklist();
  return (
    <nav aria-label="Sections" className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {game.sections.map((section) => {
        const p = sectionProgress(section, progress);
        const complete = isComplete(p);
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              FOCUS,
              "inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-(--radius-control) border-2 bg-(--surface) px-4 text-sm font-bold whitespace-nowrap text-(--text) no-underline",
              complete ? "border-(--accent)" : "border-(--border) hover:border-(--accent)",
            )}
          >
            {complete && <Check aria-hidden="true" className="size-4 text-(--accent)" strokeWidth={3} />}
            {section.title}
            {complete && <span className="sr-only">(complete)</span>}
            <span className="text-(--accent) tabular-nums">{p.percent}%</span>
          </a>
        );
      })}
    </nav>
  );
}
