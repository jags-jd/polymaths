import Link from "next/link";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { getMyProfile } from "@/lib/auth/session";

// Phase 0.2: pitch + sign-in for visitors, an empty "My games" for players.
// Game search, the games grid and friends' activity arrive in later phases
// (see docs/spec.md).
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-4 py-16">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-4xl font-bold tracking-tight">Polymaths</h1>
        <p className="text-muted-foreground">
          Tick off everything there is to do in your favourite games.
        </p>
      </div>
      <Suspense fallback={<div className="h-28" aria-hidden="true" />}>
        <HomeForViewer />
      </Suspense>
    </main>
  );
}

async function HomeForViewer() {
  const profile = await getMyProfile();

  if (!profile) {
    return (
      <div>
        <Link href="/login" className={buttonVariants({ size: "lg", className: "h-11 px-5 text-base" })}>
          Sign in to start tracking
        </Link>
      </div>
    );
  }

  return (
    <section aria-labelledby="my-games" className="flex flex-col gap-3">
      <h2 id="my-games" className="font-heading text-xl font-semibold">
        My games
      </h2>
      <div className="rounded-xl border border-dashed px-4 py-8 text-center">
        <p className="font-medium">No games started yet, {profile.displayName}.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Checklists for the first games are on their way.
        </p>
      </div>
    </section>
  );
}
