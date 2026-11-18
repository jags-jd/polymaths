import Link from "next/link";
import { Suspense } from "react";

import { HEADER_FOCUS } from "@/components/layout/header-styles";
import { UserMenu } from "@/components/layout/UserMenu";
import { getMyProfile, getSessionUser } from "@/lib/auth/session";

/**
 * The minimal site bar (docs/themes.md, "Site header"). Colors come from the
 * `--header-*` tokens, so on a game page it takes that game's look.
 */

export function SiteHeader() {
  return (
    <header className="site-header">
      {/* Same width as a game page's content, so the logo lines up with the cards. */}
      <div className="mx-auto flex h-12 w-full max-w-[1040px] items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className={`${HEADER_FOCUS} flex items-center gap-2 rounded-md font-[family-name:var(--font-display,var(--font-heading))] text-[17px] font-extrabold tracking-tight`}
        >
          {/* The mark from the mockups (docs/design/). */}
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="22" height="22" rx="7" />
            <path d="M9 14.5l3.5 3.5L19.5 10.5" />
          </svg>
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
      <Link
        href="/login"
        className={`${HEADER_FOCUS} inline-flex h-8 items-center rounded-full border-2 border-current px-3.5 text-sm font-bold hover:bg-white/10`}
      >
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
