"use client";

import { useActionState } from "react";

import { createProfile, type OnboardingState } from "@/app/(auth)/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DISPLAY_NAME_MAX, IGN_MAX, IGN_MIN } from "@/lib/safety/profile-fields";

export function OnboardingForm({ suggestedDisplayName }: { suggestedDisplayName: string }) {
  const [state, formAction, pending] = useActionState<OnboardingState, FormData>(createProfile, {
    values: { displayName: suggestedDisplayName, ign: "" },
  });

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      {state.formError && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.formError}
        </p>
      )}

      <Field
        id="displayName"
        label="Display name"
        hint="Your name as shown on your profile. You can change it later."
        error={state.fieldErrors?.displayName}
      >
        <Input
          id="displayName"
          name="displayName"
          defaultValue={state.values.displayName}
          maxLength={DISPLAY_NAME_MAX}
          autoComplete="nickname"
          required
          aria-invalid={state.fieldErrors?.displayName ? true : undefined}
          aria-describedby="displayName-hint displayName-error"
          className="h-10"
        />
      </Field>

      <Field
        id="ign"
        label="IGN (in-game name)"
        hint={`${IGN_MIN}–${IGN_MAX} letters, numbers or underscores. Your profile lives at /u/your_ign.`}
        error={state.fieldErrors?.ign}
      >
        <Input
          id="ign"
          name="ign"
          defaultValue={state.values.ign}
          maxLength={IGN_MAX}
          pattern="[A-Za-z0-9_]+"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          autoComplete="username"
          required
          aria-invalid={state.fieldErrors?.ign ? true : undefined}
          aria-describedby="ign-hint ign-error"
          className="h-10"
        />
      </Field>

      <Button type="submit" size="lg" className="h-11 text-base" disabled={pending}>
        {pending ? "Saving…" : "Start playing"}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      <p id={`${id}-hint`} className="text-sm text-muted-foreground">
        {hint}
      </p>
      <p id={`${id}-error`} className="text-sm text-destructive" aria-live="polite">
        {error}
      </p>
    </div>
  );
}
