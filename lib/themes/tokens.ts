import type { Game, SkinName, ThemeName } from "@/lib/games/schema";

/**
 * Theme tokens — see docs/themes.md. Components only use these CSS variables
 * (`bg-(--surface)`, `text-(--text)`), never raw hex. A game page applies its
 * theme with <ThemeStyle>, which sets them on :root while the page is shown.
 */

export const TOKEN_NAMES = [
  "bg",
  "surface",
  "surface-2",
  "border",
  "text",
  "muted",
  "accent",
  "on-accent",
  "done-bg",
  "done-border",
  "header-bg",
  "header-text",
  "header-stripe",
  "radius-card",
  "radius-control",
  "font-body",
  "font-display",
  "display-case",
  "shadow-card",
] as const;

export type TokenName = (typeof TOKEN_NAMES)[number];
export type ThemeTokens = Record<TokenName, string>;

// Font variables come from next/font in app/layout.tsx. Fonts for themes not
// used yet (Inter, Space Grotesk, EB Garamond, Cinzel, Rajdhani) are loaded
// when their first game arrives in phase 0.4; until then they fall back.
const SANS = "system-ui, sans-serif";

export const THEMES: Record<ThemeName, ThemeTokens> = {
  default: {
    bg: "#0F1117",
    surface: "#181B24",
    "surface-2": "#20242F",
    border: "#2A2F3D",
    text: "#ECEEF4",
    muted: "#A3A9B8",
    accent: "#7CE0C3",
    "on-accent": "#0F1117",
    "done-bg": "#16302A",
    "done-border": "#7CE0C3",
    "header-bg": "#0F1117",
    "header-text": "#ECEEF4",
    "header-stripe": "#2A2F3D",
    "radius-card": "16px",
    "radius-control": "999px",
    "font-body": `var(--font-inter, ${SANS})`,
    "font-display": `var(--font-space-grotesk, ${SANS})`,
    "display-case": "none",
    "shadow-card": "none",
  },
  nintendo: {
    bg: "#F4F4F6",
    surface: "#FFFFFF",
    "surface-2": "#F4F4F6",
    border: "#E3E4E8",
    text: "#1F2329",
    muted: "#5F6470",
    accent: "#E60012",
    "on-accent": "#FFFFFF",
    "done-bg": "#FDECEE",
    "done-border": "#E60012",
    "header-bg": "#E60012",
    "header-text": "#FFFFFF",
    "header-stripe": "#E60012",
    "radius-card": "22px",
    "radius-control": "999px",
    "font-body": `var(--font-nunito, ${SANS})`,
    "font-display": `var(--font-nunito, ${SANS})`,
    "display-case": "none",
    "shadow-card": "0 2px 0 #E3E4E8",
  },
  souls: {
    bg: "#0B0A08",
    surface: "#15130F",
    "surface-2": "#1D1A15",
    border: "#3A3326",
    text: "#E8E1CF",
    muted: "#A99F89",
    accent: "#C9A25A",
    "on-accent": "#0B0A08",
    "done-bg": "#221D13",
    "done-border": "#C9A25A",
    "header-bg": "#0B0A08",
    "header-text": "#E8E1CF",
    "header-stripe": "#3A3326",
    "radius-card": "3px",
    "radius-control": "2px",
    "font-body": "var(--font-eb-garamond, Georgia, serif)",
    "font-display": "var(--font-cinzel, Georgia, serif)",
    "display-case": "uppercase",
    "shadow-card": "none",
  },
  square: {
    bg: "#0B0F13",
    surface: "#121A22",
    "surface-2": "#18222C",
    border: "#253242",
    text: "#E6EEF5",
    muted: "#93A4B5",
    accent: "#4FE0B0",
    "on-accent": "#06120E",
    "done-bg": "#0F2A22",
    "done-border": "#4FE0B0",
    "header-bg": "#0B0F13",
    "header-text": "#E6EEF5",
    "header-stripe": "#4FE0B0",
    "radius-card": "8px",
    "radius-control": "6px",
    "font-body": `var(--font-inter, ${SANS})`,
    "font-display": `var(--font-rajdhani, ${SANS})`,
    "display-case": "uppercase",
    "shadow-card": "none",
  },
};

/**
 * Extra tokens a custom skin needs on top of its theme, plus any theme tokens
 * it overrides. Prefixed per skin so they can't collide.
 */
export const SKIN_TOKENS: Record<SkinName, Record<string, string>> = {
  "smw-save-file": {
    "header-bg": "#D3202A",
    "header-stripe": "#1E4FBF",
    "header-stripe-size": "6px",
    bg: "#FFF1BF",
    text: "#1B1F4A",
    "smw-page": "#FFF1BF",
    "smw-dots": "rgba(232, 170, 40, 0.18)",
    "smw-frame": "#F8C030",
    "smw-brown": "#6B4700",
    "smw-inner": "#FFFBEA",
    "smw-row-a": "#FBE3F0",
    "smw-row-b": "#FAD27A",
    "smw-ink": "#1B1F4A",
    "smw-blue": "#1E4FBF",
    "smw-red": "#C8221C",
    "smw-bar": "#E0302A",
    "smw-rule": "#E2C98A",
    "smw-off": "#8C7A4A",
    "smw-star": "#FFD21A",
    "font-pixel": "var(--font-press-start, monospace)",
    "font-body": `var(--font-pixelify, var(--font-nunito, ${SANS}))`,
  },
};

/** The tokens for a game: theme, then the game's accent, then its skin. */
export function gameTokens(game: Pick<Game, "theme" | "accent" | "skin">): Record<string, string> {
  const tokens: Record<string, string> = { ...THEMES[game.theme] };
  if (game.accent) {
    tokens.accent = game.accent;
    // On the nintendo theme the header is the accent color.
    if (game.theme === "nintendo") tokens["header-bg"] = game.accent;
  }
  if (game.skin) Object.assign(tokens, SKIN_TOKENS[game.skin]);
  return tokens;
}

/** `:root { --bg: …; … }` for a token set. Values are our own constants. */
export function tokensToCss(tokens: Record<string, string>): string {
  const body = Object.entries(tokens)
    .map(([name, value]) => `--${name}:${value};`)
    .join("");
  return `:root{${body}}`;
}

// --- Contrast (WCAG 2.x) ---------------------------------------------------------

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
