import { Check, Coins, Dog, Medal, Shirt, Sprout, Star, Swords, Timer, Scissors, type LucideIcon } from "lucide-react";

import { FlowerIcon, HeartIcon, RedCoinIcon } from "@/components/icons/yoshis-crafted-world/icons";
import { cn } from "@/lib/utils";

/**
 * Icon for a trackable's `icon` key on the shared layouts. Collectibles that
 * appear as rows of pips or meter steps get their own art; chip icons use
 * lucide (already a dependency via shadcn). Unknown keys fall back to a tick,
 * so new data never renders a broken icon.
 */

const ART = { flower: FlowerIcon, "red-coin": RedCoinIcon, heart: HeartIcon } as const;

const CHIP_ICONS: Record<string, LucideIcon> = {
  tick: Check,
  coins: Coins,
  pup: Dog,
  stopwatch: Timer,
  craft: Scissors,
  sprout: Sprout,
  score: Medal,
  challenge: Swords,
  costume: Shirt,
  star: Star,
};

export function hasArt(icon: string): icon is keyof typeof ART {
  return icon in ART;
}

/** Collectible art (flowers, red coins, hearts) in its outline or filled state. */
export function ArtIcon({ icon, filled, className }: { icon: keyof typeof ART; filled: boolean; className?: string }) {
  const Art = ART[icon];
  return <Art filled={filled} className={className} />;
}

/** A small line icon for chips and pip buttons without their own art. */
export function ChipIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = CHIP_ICONS[icon] ?? Check;
  return <Icon aria-hidden="true" className={cn("size-4 shrink-0", className)} strokeWidth={2.4} />;
}
