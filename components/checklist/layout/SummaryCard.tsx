"use client";

import { useId } from "react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { useChecklistUi } from "@/components/checklist/ChecklistUiProvider";
import { SearchBox } from "@/components/checklist/layout/SearchBox";
import { Switch } from "@/components/ui/switch";
import { gameProgress, gameStats } from "@/lib/games/progress";
import type { Game } from "@/lib/games/schema";
import { isSpoiler } from "@/lib/games/visibility";

/** The game's header card — docs/spec.md ("Header card"). */

function ProgressRing({ percent }: { percent: number }) {
  const r = 62;
  const c = 2 * Math.PI * r;
  return (
    <div role="progressbar" aria-label="Overall progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="relative size-37 shrink-0">
      <svg viewBox="0 0 148 148" className="size-full -rotate-90">
        <circle cx="74" cy="74" r={r} fill="none" stroke="var(--border)" strokeWidth="14" />
        <circle
          cx="74"
          cy="74"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - percent / 100)}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black tabular-nums">{percent}%</span>
        <span className="text-xs text-(--muted)">complete</span>
      </div>
    </div>
  );
}

function hasSpoilers(game: Game): boolean {
  return game.sections.some((s) => [...s.entries, ...(s.extras ?? []).flatMap((g) => g.entries)].some((e) => isSpoiler(s, e)));
}

export function SummaryCard() {
  const { game, progress } = useChecklist();
  const { revealAll, setRevealAll } = useChecklistUi();
  const switchId = useId();
  const p = gameProgress(game, progress);
  const stats = gameStats(game, progress);

  return (
    <div className="flex flex-col gap-6 rounded-(--radius-card) border-2 border-(--border) bg-(--surface) p-5 shadow-(--shadow-card) sm:flex-row sm:items-start sm:gap-8 sm:p-8">
      <ProgressRing percent={p.percent} />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold tracking-widest text-(--muted) uppercase">Game checklist</span>
          <h1 className="m-0 font-(family-name:--font-display) text-4xl leading-tight font-black [text-transform:var(--display-case)] sm:text-5xl">{game.title}</h1>
          <p className="m-0 text-lg">
            {p.done} of {p.total} done. {p.total - p.done} to go.
          </p>
        </div>
        {stats.length > 0 && (
          <dl className="m-0 grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
            {stats.map((s) => (
              // dt comes first for valid HTML; flex-col-reverse shows the number on top.
              <div key={s.label} className="flex flex-col-reverse rounded-[calc(var(--radius-card)*0.5)] border-2 border-(--border) px-3.5 py-2.5">
                <dt className="text-xs text-(--muted)">{s.label}</dt>
                <dd className="m-0 text-xl font-black text-(--accent) tabular-nums">
                  {s.done} / {s.total}
                </dd>
              </div>
            ))}
          </dl>
        )}
        <SearchBox />
        {hasSpoilers(game) && (
          <div className="flex items-center gap-3">
            <Switch id={switchId} checked={revealAll} onCheckedChange={setRevealAll} className="data-checked:bg-(--accent)" />
            <label htmlFor={switchId} className="text-sm font-bold">
              Reveal all spoilers
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
