"use client";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { ChecklistUiProvider } from "@/components/checklist/ChecklistUiProvider";
import { GoalsSection } from "@/components/checklist/layout/GoalsSection";
import { SectionBlock } from "@/components/checklist/layout/SectionBlock";
import { SectionNav } from "@/components/checklist/layout/SectionNav";
import { SummaryCard } from "@/components/checklist/layout/SummaryCard";

/**
 * The shared checklist page for games without a custom skin — docs/themes.md
 * ("Layouts"). Everything is themed by the game's tokens (<ThemeStyle>), and
 * uses the same progress engine and ChecklistProvider as the SMW skin.
 */
export function ChecklistPage() {
  const { game } = useChecklist();
  return (
    <ChecklistUiProvider gameSlug={game.slug}>
      <div className="flex-1 bg-(--bg) font-(family-name:--font-body) text-(--text)">
        <main className="mx-auto flex max-w-[1040px] flex-col gap-10 px-4 pt-8 pb-20 sm:pt-12">
          <div className="flex flex-col gap-5">
            <SummaryCard />
            <SectionNav />
          </div>
          {game.sections.map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))}
          <GoalsSection />
        </main>
      </div>
    </ChecklistUiProvider>
  );
}
