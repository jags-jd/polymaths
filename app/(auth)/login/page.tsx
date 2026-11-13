import type { Metadata } from "next";
import { Suspense } from "react";

import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { safeNextPath } from "@/lib/auth/safe-next";

export const metadata: Metadata = { title: "Sign in · Polymaths" };

const ERROR_MESSAGES: Record<string, string> = {
  cancelled: "Sign-in was cancelled. Try again whenever you're ready.",
  callback: "We couldn't finish signing you in. Please try again.",
  start: "We couldn't reach Google. Please try again.",
};

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Sign in</h1>
        <p className="text-muted-foreground">
          Save your progress and show off what you&apos;ve completed.
        </p>
      </div>
      <Suspense fallback={<GoogleSignInButton next="/" />}>
        <LoginForm searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function LoginForm({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const params = await searchParams;
  const next = safeNextPath(typeof params.next === "string" ? params.next : null);
  const errorKey = typeof params.error === "string" ? params.error : null;
  const message = errorKey ? (ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.callback) : null;

  return (
    <div className="flex flex-col gap-4">
      {message && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {message}
        </p>
      )}
      <GoogleSignInButton next={next} />
    </div>
  );
}
