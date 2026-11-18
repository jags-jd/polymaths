import type { CSSProperties } from "react";

/**
 * Renders original pixel art crisply — see docs/themes.md ("Pixel icons").
 *
 * `map` is a list of equal-length strings, one character per pixel; `.` is
 * transparent and every other character is looked up in `palette`. Horizontal
 * runs of one color become a single <rect>. Size it with CSS (`className` or
 * `style`); the viewBox stays integer so pixels never blur.
 */

export type PixelArt = {
  map: readonly string[];
  palette: Readonly<Record<string, string>>;
};

type Props = PixelArt & {
  className?: string;
  style?: CSSProperties;
  /** Accessible name. Omit when the icon sits inside a labelled button. */
  label?: string;
};

type Run = { x: number; y: number; width: number; fill: string };

export function pixelRuns(map: readonly string[], palette: Readonly<Record<string, string>>): Run[] {
  const runs: Run[] = [];
  map.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x]!;
      let end = x + 1;
      while (end < row.length && row[end] === ch) end++;
      if (ch !== ".") {
        const fill = palette[ch];
        if (!fill) throw new Error(`PixelIcon: no palette color for "${ch}"`);
        runs.push({ x, y, width: end - x, fill });
      }
      x = end;
    }
  });
  return runs;
}

export function PixelIcon({ map, palette, className, style, label }: Props) {
  const runs = pixelRuns(map, palette);
  const width = map[0]?.length ?? 0;
  const height = map.length;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      className={className}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {runs.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.width} height={1} fill={r.fill} />
      ))}
    </svg>
  );
}
