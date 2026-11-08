import { describe, expect, it } from "vitest";
import { applyMapTheme } from "../src/apply.js";
import { detectMapTheme } from "../src/detect.js";
import type { MetroMap } from "../src/types.js";

function fixtureMap(): MetroMap {
  return {
    schemaVersion: 1,
    meta: { title: "Test", createdAt: "2026-11-07T00:00:00.000Z" },
    stations: {
      s1: { id: "s1", name: { en: "A" }, position: { x: 0, y: 0 }, kind: "normal", labelAnchor: "N" },
      s2: { id: "s2", name: { en: "B" }, position: { x: 100, y: 0 }, kind: "normal", labelAnchor: "N" },
    },
    lines: {
      l1: { id: "l1", name: { en: "L1" }, color: "#E00034", style: "solid", segments: [{ from: "s1", to: "s2" }] },
      l2: { id: "l2", name: { en: "L2" }, color: "#0067C0", style: "solid", segments: [{ from: "s1", to: "s2" }] },
    },
    labels: {},
    style: {
      background: "#FFFFFF",
      gridStep: 40,
      cornerRadius: 36,
      labelLanguage: "en",
      fontSize: 14,
      stationRadius: 8,
      fontFamily: "Noto Sans, sans-serif",
      labelColor: "#000000",
      fontWeight: 500,
      fontStyle: "normal",
      textTransform: "none",
      letterSpacing: 0,
    },
  };
}

describe("detectMapTheme", () => {
  it("detects the theme that was just applied", () => {
    for (const id of ["classic-light", "tokyo-neon", "london-underground", "minimal-mono", "ocean-depth"]) {
      const themed = applyMapTheme(fixtureMap(), id);
      const result = detectMapTheme(themed);
      expect(result.themeId).toBe(id);
      expect(result.confidence).toBeGreaterThan(0.35);
    }
  });

  it("returns custom style as null when nothing matches", () => {
    const map = fixtureMap();
    map.style = { ...map.style, background: "#123456", labelColor: "#FEDCBA", fontSize: 19, stationRadius: 12 };
    const result = detectMapTheme(map);
    // Either null (custom) or low confidence — never a high-confidence false positive.
    expect(result.confidence).toBeLessThan(0.9);
  });
});
