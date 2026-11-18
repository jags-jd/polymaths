/**
 * Yoshi's Crafted World icons — our own vector art (docs/themes.md, "Icons":
 * smooth vector icons, outline and filled). Original, so license "original".
 * Outline state is grey; filled uses the item's own colors, which stay the
 * same on every theme (Hearts and Red Coins stay red).
 */

type Props = { filled: boolean; className?: string };

const OFF = "#9AA0AB";

/** Smiley Flower: a daisy with a smiling center. */
export function FlowerIcon({ filled, className }: Props) {
  const petal = filled ? "#FFFFFF" : "none";
  const line = filled ? "#E0A100" : OFF;
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="16" cy="7.5" rx="4" ry="6" transform={`rotate(${deg} 16 16)`} fill={petal} stroke={line} strokeWidth="1.6" />
      ))}
      <circle cx="16" cy="16" r="6" fill={filled ? "#FFD23F" : "#FFFFFF"} stroke={line} strokeWidth="1.6" />
      <path d="M13.3 17.2c1.4 1.6 4 1.6 5.4 0" fill="none" stroke={filled ? "#7A4B00" : OFF} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14" cy="14.6" r="0.9" fill={filled ? "#7A4B00" : OFF} />
      <circle cx="18" cy="14.6" r="0.9" fill={filled ? "#7A4B00" : OFF} />
    </svg>
  );
}

/** Red Coin: an upright oval coin with an inner ring. */
export function RedCoinIcon({ filled, className }: Props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
      <ellipse cx="16" cy="16" rx="9" ry="12.5" fill={filled ? "#E5202E" : "none"} stroke={filled ? "#8E0F18" : OFF} strokeWidth="2" />
      <ellipse cx="16" cy="16" rx="4.6" ry="7.5" fill="none" stroke={filled ? "#FFB3B8" : OFF} strokeWidth="1.8" />
    </svg>
  );
}

/** Heart. */
export function HeartIcon({ filled, className }: Props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={className}>
      <path
        d="M16 27.5S4 20.4 4 12.2C4 8.3 7 5.5 10.6 5.5c2.3 0 4.3 1.2 5.4 3 1.1-1.8 3.1-3 5.4-3C25 5.5 28 8.3 28 12.2c0 8.2-12 15.3-12 15.3z"
        fill={filled ? "#E5202E" : "none"}
        stroke={filled ? "#8E0F18" : OFF}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {filled && <path d="M9 10.5c.6-1.4 1.9-2.2 3.2-2.2" fill="none" stroke="#FFB3B8" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}
