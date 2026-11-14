"use client";

import { useState, type CSSProperties } from "react";

import { useChecklist } from "@/components/checklist/ChecklistProvider";
import { PixelIcon } from "@/components/icons/pixel/PixelIcon";
import { isSmwIconKey, SMW_ICONS, type SmwIconPair } from "@/components/icons/super-mario-world/pixel-maps";
import { FOCUS } from "@/components/checklist/skins/smw-save-file/parts";
import { entryProgress, isComplete, isPipDone } from "@/lib/games/progress";
import type { Entry, Pips, Trackable } from "@/lib/games/schema";
import { cn } from "@/lib/utils";

/**
 * One level: name, then exits (every check but the moon), Dragon Coins
 * (pips), and the 3-Up Moon, each in an aligned column. Sizes follow the
 * mockup; --smw-btn / --smw-coin / --smw-gap are set on the skin root.
 */

type Check = Extract<Trackable, { kind: "check" }>;

const ICON = "h-auto w-[clamp(30px,8vw,46px)]";
const COIN_ICON = "h-auto w-[clamp(21px,5.8vw,33px)]";
const BUTTON = "flex h-[clamp(52px,12vw,70px)] shrink-0 items-center justify-center";

function icon(key: string): SmwIconPair {
  if (!isSmwIconKey(key)) throw new Error(`Super Mario World has no "${key}" icon`);
  return SMW_ICONS[key];
}

type Props = {
  entry: Entry;
  stripe: "a" | "b";
  spoiler: boolean;
  /** Width of the coin column in coins: the world's largest set (at least 5). */
  coinSlots: number;
};

export function LevelRow({ entry, stripe, spoiler, coinSlots }: Props) {
  const { progress, toggleCheck, togglePip } = useChecklist();
  const [revealed, setRevealed] = useState(false);
  const live = entry.trackables.filter((t) => !t.retired);
  const exits = live.filter((t): t is Check => t.kind === "check" && t.icon !== "moon");
  const coins = live.filter((t): t is Pips => t.kind === "pips");
  const moons = live.filter((t): t is Check => t.kind === "check" && t.icon === "moon");
  const hidden = spoiler && !revealed && !isComplete(entryProgress(entry, progress));

  const checkButton = (t: Check) => {
    const done = (progress.get(t.id) ?? 0) >= 1;
    return (
      <button
        key={t.id}
        type="button"
        aria-pressed={done}
        aria-label={`${hidden ? "Hidden level" : entry.name}: ${t.label}`}
        title={t.label}
        onClick={() => toggleCheck(t)}
        className={cn(BUTTON, FOCUS, "w-(--smw-btn)")}
      >
        <PixelIcon {...icon(t.icon)[done ? "filled" : "outline"]} className={ICON} />
      </button>
    );
  };

  return (
    <div
      className={cn(
        "mt-1 flex min-h-[clamp(52px,12vw,70px)] flex-wrap items-center gap-x-5 rounded-[10px] px-[clamp(10px,3vw,18px)]",
        stripe === "a" ? "bg-(--smw-row-a)" : "bg-(--smw-row-b)",
      )}
    >
      <div className="flex min-w-0 flex-[0_1_460px] items-center py-2">
        {hidden ? (
          <button type="button" onClick={() => setRevealed(true)} className={cn(FOCUS, "text-left")} aria-label="Hidden spoiler. Reveal level name">
            <span aria-hidden="true" className="block blur-[7px] select-none text-[clamp(20px,5vw,27px)] leading-[1.1] font-bold uppercase">
              {entry.name}
            </span>
          </button>
        ) : (
          <span className="text-[clamp(20px,5vw,27px)] leading-[1.1] font-bold uppercase">{entry.name}</span>
        )}
      </div>
      <div className="flex max-w-full min-w-0 flex-nowrap items-center gap-x-(--smw-gap)">
        <div className="flex w-[calc(var(--smw-btn)*2)] shrink-0">{exits.map(checkButton)}</div>
        {/* As wide as the world's biggest coin set, so moons line up; on
            phones it may shrink to 5 coins and wrap (Way Cool has 8). */}
        <div
          className="flex w-[calc(var(--smw-coin)*var(--coin-slots))] min-w-[calc(var(--smw-coin)*5)] flex-wrap"
          style={{ "--coin-slots": coinSlots } as CSSProperties}
        >
          {coins.length === 0 && <span className="block h-[clamp(52px,12vw,70px)]" />}
          {coins.map((t) =>
            Array.from({ length: t.count }, (_, i) => {
              const n = i + 1;
              const done = isPipDone(t, n, progress);
              return (
                <button
                  key={`${t.id}#${n}`}
                  type="button"
                  aria-pressed={done}
                  aria-label={`${hidden ? "Hidden level" : entry.name}: ${t.label} ${n} of ${t.count}`}
                  onClick={() => togglePip(t, n)}
                  className={cn(BUTTON, FOCUS, "w-(--smw-coin)")}
                >
                  <PixelIcon {...icon(t.icon)[done ? "filled" : "outline"]} className={COIN_ICON} />
                </button>
              );
            }),
          )}
        </div>
        <div className="flex w-(--smw-btn) shrink-0">{moons.map(checkButton)}</div>
      </div>
    </div>
  );
}
