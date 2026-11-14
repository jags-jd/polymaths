import Link from "next/link";
import { Suspense } from "react";

import { UserMenu } from "@/components/layout/UserMenu";
import { buttonVariants } from "@/components/ui/button";
import { getMyProfile, getSessionUser } from "@/lib/auth/session";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="font-heading text-lg font-bold tracking-tight">
          Polymaths
        </Link>
        {/* The session is read at request time, so it streams in (Cache Components). */}
        <Suspense fallback={<div className="size-8" aria-hidden="true" />}>
          <HeaderAccount />
        </Suspense>
      </div>
    </header>
  );
}

async function HeaderAccount() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <Link href="/login" className={buttonVariants({ variant: "outline" })}>
        Sign in
      </Link>
    );
  }

  // Signed in but not onboarded yet: the proxy keeps them on /onboarding.
  const profile = await getMyProfile();
  return (
    <UserMenu
      ign={profile?.ign ?? null}
      displayName={profile?.displayName ?? user.providerName ?? "Player"}
      avatarUrl={profile?.avatarUrl ?? user.providerAvatarUrl}
    />
  );
}
