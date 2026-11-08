import { MAP_THEMES } from "./map-themes.js";
import type { MapTheme, MetroMap } from "./types.js";

export interface DetectionResult {
  /** Best matching theme id, or null if no confident match. */
  themeId: string | null;
  /** 0..1 confidence (style + palette agreement). */
  confidence: number;
  /** Top 3 candidates with scores. */
  candidates: { id: string; score: number }[];
}

function colorDistance(a: string, b: string): number {
  const pa = parseHex(a);
  const pb = parseHex(b);
  if (!pa || !pb) return Infinity;
  return Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]);
}

function parseHex(s: string): [number, number, number] | null {
  const m = /^#([0-9a-fA-F]{6})$/.exec(s.trim());
  if (!m) return null;
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function numScore(a: number | undefined, b: number | undefined, scale: number): number {
  if (a === undefined || b === undefined) return 0.5;
  return Math.max(0, 1 - Math.abs(a - b) / scale);
}

function strScore(a: string | undefined, b: string | undefined): number {
  if (!a || !b) return 0.5;
  return a === b ? 1 : 0;
}

function scoreTheme(map: MetroMap, theme: MapTheme): number {
  const s = map.style;
  const t = theme.style;
  let score = 0;
  let weight = 0;

  const add = (v: number, w: number) => {
    score += v * w;
    weight += w;
  };

  // Background + label colour dominate (weight 3 each).
  if (s.background && t.background) {
    const d = colorDistance(s.background, t.background);
    add(Math.max(0, 1 - d / 441.7), 3);
  }
  if (s.labelColor && t.labelColor) {
    const d = colorDistance(s.labelColor, t.labelColor);
    add(Math.max(0, 1 - d / 441.7), 3);
  } else if (!s.labelColor && t.labelColor) {
    // Maps without labelColor render black; treat as black.
    const d = colorDistance("#000000", t.labelColor);
    add(Math.max(0, 1 - d / 441.7), 2);
  }

  add(numScore(s.fontSize, t.fontSize, 8), 1);
  add(numScore(s.stationRadius, t.stationRadius, 8), 1);
  add(numScore(s.cornerRadius, t.cornerRadius, 36), 1);
  add(numScore(s.gridStep, t.gridStep, 40), 0.5);
  add(strScore(s.fontFamily, t.fontFamily), 1);
  add(numScore(s.fontWeight ?? 500, t.fontWeight ?? 500, 400), 0.5);
  add(strScore(s.textTransform ?? "none", t.textTransform ?? "none"), 0.5);
  add(strScore(s.fontStyle ?? "normal", t.fontStyle ?? "normal"), 0.25);

  // Palette: fraction of theme colours present in the map's line colours.
  const lineColors = new Set(Object.values(map.lines).map((l) => l.color.toUpperCase()));
  if (theme.linePalette.length > 0 && lineColors.size > 0) {
    let hits = 0;
    for (const c of theme.linePalette) if (lineColors.has(c.toUpperCase())) hits += 1;
    add(hits / theme.linePalette.length, 2);
  }

  return weight === 0 ? 0 : score / weight;
}

/**
 * Detect the preset whose style + palette best matches the map.
 * Returns null when the best score is below 0.35 (custom style).
 */
export function detectMapTheme(map: MetroMap): DetectionResult {
  const scored = MAP_THEMES.map((t) => ({ id: t.id, score: Math.round(scoreTheme(map, t) * 1000) / 1000 })).sort(
    (a, b) => b.score - a.score,
  );
  const best = scored[0];
  return {
    themeId: best && best.score >= 0.35 ? best.id : null,
    confidence: best ? best.score : 0,
    candidates: scored.slice(0, 3),
  };
}

export function detectMapThemeId(map: MetroMap): string | null {
  return detectMapTheme(map).themeId;
}
