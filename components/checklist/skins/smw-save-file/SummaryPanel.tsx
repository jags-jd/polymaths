"use client";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { Chevrons, FramedPanel, InnerBox, Score, Star, FOCUS } from "@/components/checklist/skins/smw-save-file/parts";
import { gameProgress, gameStats, isComplete, sectionProgress, statValue } from "@/lib/games/progress";
import { cn } from "@/lib/utils";

/** Title, overall progress bar, stat list, and the world tabs below it. */
export function SummaryPanel() {
  const { game, progress } = useChecklist();
  const p = gameProgress(game, progress);
  const stats = gameStats(game, progress);
  const tabStat = game.stats.find((s) => !s.match.section);

  return (
    <div className="flex flex-col gap-5 pt-8 pb-6">
      <FramedPanel labelledBy="game-title">
        <div className="flex items-center gap-3 px-2.5 pt-2 pb-3">
          <Chevrons size={21} />
          <h1
            id="game-title"
            className="m-0 min-w-0 flex-1 font-(family-name:--font-pixel) text-[clamp(24px,5.1vw,42px)] leading-[1.3] uppercase [text-shadow:2px_2px_0_#FFFFFF]"
          >
            {game.title}
          </h1>
          <Chevrons dir="left" size={21} />
        </div>
        <InnerBox className="flex flex-wrap items-center gap-x-7 gap-y-4 px-[18px] py-4">
          <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-(family-name:--font-pixel) text-[18px]">COMPLETE</span>
              <span className="font-(family-name:--font-pixel) text-[33px] text-(--smw-red)">{p.percent}%</span>
            </div>
            <div
              role="progressbar"
              aria-label="Overall progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={p.percent}
              className="h-[18px] overflow-hidden rounded-sm border-3 border-(--smw-brown) bg-(--smw-row-a)"
            >
              <div
                className="h-full bg-(--smw-bar) bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.25)_0_6px,transparent_6px_12px)] transition-[width] duration-300"
                style={{ width: `${p.percent}%` }}
              />
            </div>
            <span className="text-[22.5px] font-semibold">
              {p.done} of {p.total} done. {p.total - p.done} to go.
            </span>
          </div>
          <dl className="m-0 grid min-w-0 flex-[1_1_300px] grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-x-[18px] gap-y-1.5">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-2 border-b-2 border-dotted border-(--smw-rule) py-1">
                <dt className="text-[21px] font-bold uppercase">{s.label}</dt>
                <dd className="m-0">
                  <Score done={s.done} total={s.total} className="text-[18px] text-(--smw-blue)" />
                </dd>
              </div>
            ))}
          </dl>
        </InnerBox>
      </FramedPanel>

      <nav aria-label="Worlds" className="flex flex-wrap gap-2">
        {game.sections.map((section) => {
          const complete = isComplete(sectionProgress(section, progress));
          const tab = tabStat ? statValue(game, tabStat, progress, section) : null;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                FOCUS,
                "inline-flex min-h-11 items-center gap-2 rounded-lg border-3 border-(--smw-brown) px-3 text-[22.5px] font-bold text-(--smw-ink) uppercase no-underline shadow-[0_3px_0_var(--smw-brown)]",
                complete ? "bg-(--smw-row-b)" : "bg-white",
              )}
            >
              <span style={{ visibility: complete ? "visible" : "hidden" }}>
                <Star size={16} />
              </span>
              <span>{section.title}</span>
              {complete && <span className="sr-only">(complete)</span>}
              {tab && <Score done={tab.done} total={tab.total} className="text-[15px] text-(--smw-red)" />}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
