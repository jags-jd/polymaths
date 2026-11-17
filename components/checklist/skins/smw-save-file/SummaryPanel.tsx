"use client";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { FOCUS, FramedPanel, InnerBox, Score, Star } from "@/components/checklist/skins/smw-save-file/parts";
import { gameProgress, gameStats, isComplete, sectionProgress, statValue } from "@/lib/games/progress";
import { cn } from "@/lib/utils";

/** Title, overall progress bar, stat list, and the world tabs below it. */
export function SummaryPanel() {
  const { game, progress } = useChecklist();
  const p = gameProgress(game, progress);
  const stats = gameStats(game, progress);
  const tabStat = game.stats.find((s) => !s.match.section);

  return (
    <div className="flex flex-col gap-4 pt-6 pb-5">
      <FramedPanel labelledBy="game-title">
        <div className="px-3.5 py-2.5 sm:px-5 sm:py-3">
          <h1 id="game-title" className="m-0 text-[clamp(18px,3.8vw,32px)] leading-[1.3] uppercase [text-shadow:2px_2px_0_#FFFFFF]">
            {game.title}
          </h1>
        </div>
        <InnerBox className="flex flex-wrap items-center gap-x-7 gap-y-4 px-3.5 py-3.5 sm:px-5 sm:py-4">
          <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] sm:text-xs">COMPLETE</span>
              <span className="text-[22px] text-(--smw-red) sm:text-[26px]">{p.percent}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="Overall progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={p.percent}
              className="h-[14px] overflow-hidden rounded-sm border-3 border-(--smw-brown) bg-(--smw-row-a)"
            >
              <div
                className="h-full bg-(--smw-bar) bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.25)_0_6px,transparent_6px_12px)] transition-[width] duration-300"
                style={{ width: `${p.percent}%` }}
              />
            </div>
            <span className="text-[10px] sm:text-[11px]">
              {p.done} of {p.total} done. {p.total - p.done} to go.
            </span>
          </div>
          <dl className="m-0 grid min-w-0 flex-[1_1_300px] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-[18px] gap-y-1">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-2 border-b-2 border-dotted border-(--smw-rule) py-1.5">
                <dt className="text-[10px] uppercase sm:text-[11px]">{s.label}</dt>
                <dd className="m-0">
                  <Score done={s.done} total={s.total} className="text-[11px] text-(--smw-blue) sm:text-xs" />
                </dd>
              </div>
            ))}
          </dl>
        </InnerBox>
      </FramedPanel>

      {/* One swipeable line on phones (the tabs alone would be nine rows tall), wrapped from `sm`. */}
      <nav
        aria-label="Worlds"
        className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-1.5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {game.sections.map((section) => {
          const complete = isComplete(sectionProgress(section, progress));
          const tab = tabStat ? statValue(game, tabStat, progress, section) : null;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                FOCUS,
                "inline-flex min-h-10 shrink-0 snap-start items-center gap-1.5 rounded-lg border-3 border-(--smw-brown) px-2.5 text-[10px] whitespace-nowrap text-(--smw-ink) uppercase no-underline shadow-[0_3px_0_var(--smw-brown)] sm:text-[11px]",
                complete ? "bg-(--smw-row-b)" : "bg-white",
              )}
            >
              {complete && <Star size={12} />}
              <span>{section.title}</span>
              {complete && <span className="sr-only">(complete)</span>}
              {tab && <Score done={tab.done} total={tab.total} className="text-(--smw-red)" />}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
