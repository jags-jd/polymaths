/**
 * Returns `next` if it is a safe same-site path to redirect to after sign-in,
 * otherwise `/`. Blocks open redirects such as `//evil.com` or `https://…`.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/")) return "/";
  // "//host" and "/\host" are treated as absolute URLs by browsers.
  if (next.startsWith("//") || next.startsWith("/\\")) return "/";
  // Control characters (tabs, newlines) are stripped by URL parsers and can
  // turn "/\t/evil.com" into "//evil.com".
  if (/[\u0000-\u001f\u007f]/.test(next)) return "/";
  // Never bounce back into the auth flow.
  if (next === "/login" || next.startsWith("/auth/") || next === "/onboarding") return "/";
  return next;
}
