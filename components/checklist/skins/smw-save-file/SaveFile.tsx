"use client";

import type { CSSProperties } from "react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { GoalsPanel } from "@/components/checklist/skins/smw-save-file/GoalsPanel";
import { SummaryPanel } from "@/components/checklist/skins/smw-save-file/SummaryPanel";
import { WorldPanel } from "@/components/checklist/skins/smw-save-file/WorldPanel";

/**
 * Super Mario World's save-file skin — docs/themes.md ("Custom skins").
 * Replaces the section and entry renderers but uses the shared progress
 * engine and ChecklistProvider. Colors come from SKIN_TOKENS in lib/themes.
 */

// Column sizes. Phone minimums are a little under the mockup's so the icons
// fit on one line at 390px (docs/themes.md: no horizontal scroll).
const SIZES = {
  "--smw-btn": "clamp(36px, 9.5vw, 56px)",
  "--smw-coin": "clamp(30px, 7.8vw, 46px)",
  "--smw-gap": "clamp(6px, 2.5vw, 20px)",
} as CSSProperties;

export function SaveFile() {
  const { game } = useChecklist();
  return (
    <div
      style={SIZES}
      className="flex-1 bg-(--smw-page) bg-[radial-gradient(circle_at_10px_10px,var(--smw-dots)_2px,transparent_3px)] bg-size-[28px_28px] pb-18 font-(family-name:--font-body) text-base leading-[1.4] text-(--smw-ink)"
    >
      <main className="mx-auto max-w-[1120px] px-4">
        <SummaryPanel />
        <div className="flex flex-col gap-8">
          {game.sections.map((section) => (
            <WorldPanel key={section.id} section={section} />
          ))}
          <GoalsPanel />
        </div>
      </main>
    </div>
  );
}
