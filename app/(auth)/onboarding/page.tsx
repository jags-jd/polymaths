import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { OnboardingForm } from "@/components/auth/OnboardingForm";
import { getMyProfile, getSessionUser } from "@/lib/auth/session";
import { DISPLAY_NAME_MAX } from "@/lib/safety/profile-fields";

export const metadata: Metadata = { title: "Welcome · Polymaths" };

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome, player</h1>
        <p className="text-muted-foreground">
          Pick the names other players will see. Your IGN is your profile address.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <OnboardingFormForUser />
      </Suspense>
    </main>
  );
}

async function OnboardingFormForUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (await getMyProfile()) redirect("/");

  const suggestedName = (user.providerName ?? "").slice(0, DISPLAY_NAME_MAX);
  return <OnboardingForm suggestedDisplayName={suggestedName} />;
}
