import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MAP_THEMES } from "./map-themes.js";
import { UI_THEMES } from "./ui-themes.js";
export * from "./types.js";
export * from "./map-themes.js";
export * from "./ui-themes.js";
export * from "./apply.js";
export * from "./detect.js";
export const ADDON_ID = "nodal-addon-theme";
export const ADDON_VERSION = "1.0.0";
export const ADDON_GITHUB_URL = "https://github.com/xft0729/nodal-addon-theme";
/**
 * AddonManager catalog entry for this addon.
 *
 * Paste into Nodal's packages/app/src/components/AddonManager.tsx:
 *
 *   import { themeAddonMetadata } from "nodal-addon-theme";
 *   const CATALOG: AddonMetadata[] = [themeAddonMetadata];
 *
 * Or copy addon.json verbatim. The JSON file and this object are kept
 * in sync by test/metadata.test.ts.
 */
export const themeAddonMetadata = {
    id: ADDON_ID,
    name: "Nodal Theme Switcher",
    version: ADDON_VERSION,
    author: "xft0729",
    githubUrl: ADDON_GITHUB_URL,
    category: "transit",
    source: "community",
    desc: "Switch between 12 transit map presets and 7 editor UI themes — background, typography, line palettes and workbench colours in one click.",
    longDesc: "Theme Switcher ships 12 map presets (Classic Light, Nodal Dark, Tokyo Neon, London Underground, Taipei Metro, NYC Subway, Retro Blueprint, Minimal Mono, High-Contrast Print, Ocean Depth, Sunset Transit, Pastel Dream) and 7 editor UI themes (Nodal Light, Nodal Dark, Midnight, Forest, Crimson, Solar Paper, High Contrast). Apply map themes as pure MetroMap→MetroMap transforms (undo-safe via Nodal Command), preview UI themes by injecting CSS variables, detect the closest preset, and export your current map style as a reusable theme JSON. Import/export works with plain JSON files and the CLI — no Nodal fork required.",
    features: [
        "12 map style presets (background, grid, corner radius, station size, typography, label colour)",
        "Cycled line palettes per theme (London, NYC, Taipei, Tokyo, …) — recolours all lines deterministically",
        "7 editor UI themes as CSS variables (drop-in tokens.css overrides, persists to localStorage)",
        "Pure, undo-safe transforms: applyMapTheme() + makeApplyThemeCommand() for Nodal CommandStack",
        "Detect closest preset, export current style, validate & import custom theme JSON",
        "CLI: nodal-theme list | apply-map | export-theme | detect",
        "Zero runtime dependencies — runs in browser and Node",
        "MIT licensed, TypeScript strict, tested with Vitest",
    ],
    tags: ["theme", "ui", "map-style", "dark-mode", "preset", "palette", "typography", "accessibility", "print", "neon"],
    defaultEnabled: true,
};
/** Load addon.json from the package root (Node only). */
export function loadAddonMetadata() {
    const here = dirname(fileURLToPath(import.meta.url));
    const candidates = [
        join(here, "..", "addon.json"),
        join(here, "..", "..", "addon.json"),
    ];
    for (const path of candidates) {
        try {
            return JSON.parse(readFileSync(path, "utf8"));
        }
        catch {
            /* try next candidate */
        }
    }
    return themeAddonMetadata;
}
export function listAllThemes() {
    return { ui: UI_THEMES, map: MAP_THEMES };
}
//# sourceMappingURL=index.js.map