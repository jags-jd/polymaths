"use client";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { GoalsPanel } from "@/components/checklist/skins/smw-save-file/GoalsPanel";
import { SummaryPanel } from "@/components/checklist/skins/smw-save-file/SummaryPanel";
import { WorldPanel } from "@/components/checklist/skins/smw-save-file/WorldPanel";

/**
 * Super Mario World's save-file skin — docs/themes.md ("Custom skins").
 * Replaces the section and entry renderers but uses the shared progress
 * engine and ChecklistProvider. Colors come from SKIN_TOKENS in lib/themes.
 *
 * Sizes: every pixel icon is drawn at the same scale, `--smw-px` screen
 * pixels per art pixel (1.5 on phones, 2 from `sm`), so exits, coins and
 * moons stay in proportion. Buttons add a little padding around the art.
 */
const SIZES = [
  "[--smw-px:1.5px] sm:[--smw-px:2px]",
  "[--smw-btn:calc(16*var(--smw-px)+8px)]", // 16-pixel-wide art: exits, keys, moons
  "[--smw-coin:calc(12*var(--smw-px)+6px)]", // 12-pixel-wide Dragon Coins
  "[--smw-row:40px] sm:[--smw-row:48px]",
  "[--smw-gap:10px] sm:[--smw-gap:20px]",
].join(" ");

export function SaveFile() {
  const { game } = useChecklist();
  return (
    <div
      className={`${SIZES} flex-1 bg-(--smw-page) bg-[radial-gradient(circle_at_10px_10px,var(--smw-dots)_2px,transparent_3px)] bg-size-[28px_28px] pb-16 font-(family-name:--font-body) text-xs leading-[1.6] text-(--smw-ink)`}
    >
      <main className="mx-auto max-w-[1040px] px-4">
        <SummaryPanel />
        <div className="flex flex-col gap-6">
          {game.sections.map((section) => (
            <WorldPanel key={section.id} section={section} />
          ))}
          <GoalsPanel />
        </div>
      </main>
    </div>
  );
}
