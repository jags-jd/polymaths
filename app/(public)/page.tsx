import Link from "next/link";
import { Suspense } from "react";

import { GameCard, GameGrid } from "@/components/home/GameCard";
import { buttonVariants } from "@/components/ui/button";
import { getMyProfile, getSessionUser } from "@/lib/auth/session";
import { hasPage, listGames } from "@/lib/games/load";
import { summarizeGames } from "@/lib/games/my-games";
import { getMyProgressRows } from "@/lib/progress/queries";

/**
 * Home — docs/spec.md ("Home"). Visitors get the pitch and every game;
 * players get "My games" (started, most recently played first) and the
 * rest under "All games". Friends' activity arrives in 0.6, game search
 * with the other games in 0.4.
 */
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1040px] flex-1 flex-col gap-10 px-4 py-10 sm:py-14">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-4xl font-bold tracking-tight">Polymaths</h1>
        <p className="text-muted-foreground">Tick off everything there is to do in your favourite games.</p>
      </div>
      {/* Who's viewing is read at request time, so it streams in (Cache Components). */}
      <Suspense fallback={<div className="h-64" aria-busy="true" />}>
        <HomeForViewer />
      </Suspense>
    </main>
  );
}

async function HomeForViewer() {
  const [user, profile] = await Promise.all([getSessionUser(), getMyProfile()]);

  if (!user || !profile) {
    return (
      <>
        <div>
          <Link href="/login" className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}>
            Sign in to start tracking
          </Link>
        </div>
        <GamesSection title="Games" id="games">
          {listGames()
            .filter(hasPage)
            .map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
        </GamesSection>
      </>
    );
  }

  const { started, others } = summarizeGames(listGames(), await getMyProgressRows(user.id));

  return (
    <>
      <GamesSection title="My games" id="my-games">
        {started.length > 0 ? (
          started.map((s) => <GameCard key={s.game.slug} game={s.game} progress={s.progress} />)
        ) : (
          <p className="text-muted-foreground sm:col-span-2 lg:col-span-3">
            Nothing ticked yet, {profile.displayName}. Pick a game below to start.
          </p>
        )}
      </GamesSection>
      {others.length > 0 && (
        <GamesSection title="All games" id="all-games">
          {others.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </GamesSection>
      )}
    </>
  );
}

function GamesSection({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <h2 id={id} className="font-heading text-xl font-semibold">
        {title}
      </h2>
      <GameGrid>{children}</GameGrid>
    </section>
  );
}
