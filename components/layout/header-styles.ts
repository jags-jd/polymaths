/**
 * Shared by the server-rendered SiteHeader and the client UserMenu.
 * Focus ring in the header's own text color, so it shows on any bar.
 */
export const HEADER_FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--header-text,var(--foreground))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--header-bg,var(--background))]";
