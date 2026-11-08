import { describe, expect, it } from "vitest";
import { applyMapTheme, exportThemeFromMap, makeApplyThemeCommand, validateMapTheme } from "../src/apply.js";
import { MAP_THEMES, getMapThemeOrThrow } from "../src/map-themes.js";
import { UI_THEMES, getUiThemeCss } from "../src/ui-themes.js";
import { themeAddonMetadata } from "../src/index.js";
import type { MetroMap } from "../src/types.js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function fixtureMap(): MetroMap {
  return {
    schemaVersion: 1,
    meta: { title: "Test", createdAt: "2026-11-07T00:00:00.000Z" },
    stations: {
      s1: { id: "s1", name: { en: "A" }, position: { x: 0, y: 0 }, kind: "normal", labelAnchor: "N" },
      s2: { id: "s2", name: { en: "B" }, position: { x: 100, y: 0 }, kind: "normal", labelAnchor: "N" },
    },
    lines: {
      l1: { id: "l1", name: { en: "L1" }, color: "#E00034", style: "solid", width: 8, segments: [{ from: "s1", to: "s2" }] },
      l2: { id: "l2", name: { en: "L2" }, color: "#0067C0", style: "dashed", width: 6, segments: [{ from: "s1", to: "s2" }] },
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

describe("applyMapTheme", () => {
  it("merges style and recolors lines deterministically", () => {
    const map = fixtureMap();
    const next = applyMapTheme(map, "tokyo-neon");
    expect(next.style.background).toBe("#0B0F1A");
    expect(next.style.labelColor).toBe("#E0E7FF");
    const theme = getMapThemeOrThrow("tokyo-neon");
    expect(next.lines["l1"]!.color).toBe(theme.linePalette[0]);
    expect(next.lines["l2"]!.color).toBe(theme.linePalette[1]);
    // Stations untouched, input unmutated.
    expect(next.stations["s1"]).toEqual(map.stations["s1"]);
    expect(map.style.background).toBe("#FFFFFF");
    expect(map.lines["l1"]!.color).toBe("#E00034");
  });

  it("preserves line styles/widths by default, enforces on request", () => {
    const map = fixtureMap();
    const preserved = applyMapTheme(map, "high-contrast-print");
    expect(preserved.lines["l2"]!.style).toBe("dashed");
    expect(preserved.lines["l2"]!.width).toBe(6);
    const enforced = applyMapTheme(map, "high-contrast-print", { enforceLineWidth: true, enforceLineStyle: true });
    // high-contrast-print has no lineStyle, so style stays; width enforced.
    expect(enforced.lines["l2"]!.width).toBe(10);
  });

  it("preserveLabelLanguage keeps zh-TW", () => {
    const map = { ...fixtureMap(), style: { ...fixtureMap().style, labelLanguage: "zh-TW" } };
    const kept = applyMapTheme(map, "tokyo-neon", { preserveLabelLanguage: true });
    expect(kept.style.labelLanguage).toBe("zh-TW");
    const flipped = applyMapTheme(map, "tokyo-neon");
    // tokyo-neon declares labelLanguage en
    expect(flipped.style.labelLanguage).toBe("en");
  });

  it("throws on unknown theme id", () => {
    expect(() => applyMapTheme(fixtureMap(), "does-not-exist")).toThrow(/Unknown map theme/);
  });

  it("cycles palette when there are more lines than colours", () => {
    const map = fixtureMap();
    map.lines["l3"] = { id: "l3", name: { en: "L3" }, color: "#000000", style: "solid", segments: [] };
    const theme = getMapThemeOrThrow("minimal-mono");
    const next = applyMapTheme(map, "minimal-mono");
    expect(next.lines["l3"]!.color).toBe(theme.linePalette[2]);
  });
});

describe("exportThemeFromMap", () => {
  it("round-trips style and dedupes palette", () => {
    const map = applyMapTheme(fixtureMap(), "london-underground");
    const exported = exportThemeFromMap(map, { id: "custom", name: "Custom" });
    expect(exported.style.background).toBe(map.style.background);
    expect(exported.linePalette).toEqual([map.lines["l1"]!.color, map.lines["l2"]!.color]);
    expect(validateMapTheme(exported)).toEqual({ ok: true, errors: [] });
  });
});

describe("makeApplyThemeCommand", () => {
  it("applies and reverts like a Nodal command", () => {
    const map = fixtureMap();
    const cmd = makeApplyThemeCommand(map, "ocean-depth");
    expect(cmd.label).toContain("ocean-depth");
    const after = cmd.apply(map);
    expect(after.style.background).toBe("#0A1929");
    const reverted = cmd.revert(after);
    expect(reverted.style.background).toBe("#FFFFFF");
    expect(reverted.lines["l1"]!.color).toBe("#E00034");
  });
});

describe("validateMapTheme", () => {
  it("accepts all bundled themes", () => {
    for (const t of MAP_THEMES) {
      expect(validateMapTheme(t).ok).toBe(true);
    }
  });

  it("rejects bad colours and empty palette", () => {
    const bad = { id: "x", name: "X", description: "d", style: { background: "red" }, linePalette: [] };
    const r = validateMapTheme(bad);
    expect(r.ok).toBe(false);
    expect(r.errors.length).toBeGreaterThan(0);
  });
});

describe("UI themes", () => {
  it("every map theme id is unique and css renders", () => {
    const ids = new Set(MAP_THEMES.map((t) => t.id));
    expect(ids.size).toBe(MAP_THEMES.length);
    for (const t of UI_THEMES) {
      const css = getUiThemeCss(t.id);
      expect(css).toContain(`[data-theme="${t.id}"]`);
      expect(css).toContain("--color-bg");
    }
  });
});

describe("addon.json sync", () => {
  it("matches themeAddonMetadata", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const raw = JSON.parse(readFileSync(join(here, "..", "addon.json"), "utf8")) as Record<string, unknown>;
    expect(raw["id"]).toBe(themeAddonMetadata.id);
    expect(raw["name"]).toBe(themeAddonMetadata.name);
    expect(raw["version"]).toBe(themeAddonMetadata.version);
    expect(raw["author"]).toBe(themeAddonMetadata.author);
    expect(raw["desc"]).toBe(themeAddonMetadata.desc);
    expect(raw["tags"]).toEqual(themeAddonMetadata.tags);
    expect(Array.isArray(raw["features"])).toBe(true);
    expect((raw["features"] as string[]).length).toBeGreaterThan(0);
  });
});
