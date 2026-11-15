import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ChecklistProvider } from "@/components/checklist/ChecklistProvider";
import { SaveFile } from "@/components/checklist/skins/smw-save-file/SaveFile";
import { ThemeStyle } from "@/components/themes/ThemeStyle";
import { getSessionUser } from "@/lib/auth/session";
import { getGame, listGames } from "@/lib/games/load";
import type { Game } from "@/lib/games/schema";
import { getProgressRows } from "@/lib/progress/queries";

/**
 * Game checklist — docs/spec.md ("Game checklist"). Public: visitors see the
 * list with nothing ticked and are asked to sign in when they tap.
 *
 * Every supported game is prerendered (generateStaticParams); the player's
 * progress streams in behind <Suspense> (Cache Components).
 */

export function generateStaticParams() {
  return listGames().map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: PageProps<"/games/[slug]">): Promise<Metadata> {
  const game = getGame((await params).slug);
  return game ? { title: `${game.title} checklist · Polymaths` } : {};
}

export default async function GamePage({ params }: PageProps<"/games/[slug]">) {
  const game = getGame((await params).slug);
  // `dynamicParams` isn't available with Cache Components, so unknown slugs
  // are rejected here. Games without a skin get the shared layouts in 0.4.
  if (!game?.skin) notFound();

  return (
    <>
      <ThemeStyle game={game} />
      <Suspense fallback={<div className="flex-1" aria-busy="true" />}>
        <PlayerChecklist game={game} />
      </Suspense>
    </>
  );
}

async function PlayerChecklist({ game }: { game: Game }) {
  const user = await getSessionUser();
  const rows = user ? await getProgressRows(user.id, game.slug) : [];
  return (
    <ChecklistProvider game={game} rows={rows} mode={user ? "edit" : "sign-in"}>
      <SaveFile />
    </ChecklistProvider>
  );
}
