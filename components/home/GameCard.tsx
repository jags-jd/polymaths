import Link from "next/link";

import type { Progress } from "@/lib/games/progress";
import type { Game } from "@/lib/games/schema";
import { gameTokens } from "@/lib/themes/tokens";
import { cn } from "@/lib/utils";

/**
 * A game on the home page. The colored band uses the game's own header
 * colors (red with a blue stripe for Super Mario World). They're inline
 * values because the home page doesn't put a game's tokens on :root.
 */
export function GameCard({ game, progress }: { game: Game; progress?: Progress }) {
  const t = gameTokens(game);
  const color = t["header-bg"];
  const started = progress && progress.done > 0;

  return (
    <Link
      href={`/games/${game.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs transition-shadow outline-none",
        "hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50",
      )}
    >
      <div
        className="flex min-h-20 items-end px-4 pb-3"
        style={{ background: color, color: t["header-text"], borderBottom: `${t["header-stripe-size"] ?? "4px"} solid ${t["header-stripe"]}` }}
      >
        <span className="text-lg leading-tight font-extrabold">{game.title}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs text-muted-foreground">{game.platforms.join(" · ")}</span>
        {started ? (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xl font-bold tabular-nums">{progress.percent}%</span>
              <span className="text-sm text-muted-foreground tabular-nums">
                {progress.done} of {progress.total} done
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${game.title} progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.percent}
              className="h-2 overflow-hidden rounded-full bg-muted"
            >
              <div className="h-full rounded-full" style={{ width: `${progress.percent}%`, background: color }} />
            </div>
          </>
        ) : (
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-muted-foreground">Not started</span>
            <span className="text-sm font-semibold group-hover:underline">Start →</span>
          </div>
        )}
      </div>
    </Link>
  );
}

/** One column on phones, two from `sm`, three from `lg`. */
export function GameGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
