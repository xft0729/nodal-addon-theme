import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { MAP_THEMES } from "./map-themes.js";
import { UI_THEMES } from "./ui-themes.js";
import type { AddonMetadata } from "./types.js";

export * from "./types.js";
export * from "./map-themes.js";
export * from "./ui-themes.js";
export * from "./apply.js";
export * from "./detect.js";

export const ADDON_ID = "nodal-addon-theme" as const;
export const ADDON_VERSION = "1.0.0" as const;
export const ADDON_GITHUB_URL = "https://github.com/xft0729/nodal-addon-theme" as const;

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
export const themeAddonMetadata: AddonMetadata = {
  id: ADDON_ID,
  name: "Nodal Theme Switcher",
  version: ADDON_VERSION,
  author: "xft0729",
  githubUrl: ADDON_GITHUB_URL,
  category: "transit",
  source: "community",
  desc: "Editor themes and canvas presets for Nodal.",
  longDesc:
    "Adds 13 editor themes and 12 canvas presets. Pick a theme from the palette button in the toolbar. Settings stay in your browser.",
  features: [
    "13 editor themes, from light and dark to high contrast",
    "12 canvas presets with matching line colors",
    "Import and export custom theme files as JSON",
    "No runtime dependencies",
    "MIT licensed",
  ],
  tags: ["theme", "ui", "map-style", "dark-mode", "preset", "palette", "typography", "accessibility", "print", "neon"],
  defaultEnabled: true,
};

/** Load addon.json from the package root (Node only). */
export function loadAddonMetadata(): AddonMetadata {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    join(here, "..", "addon.json"),
    join(here, "..", "..", "addon.json"),
  ];
  for (const path of candidates) {
    try {
      return JSON.parse(readFileSync(path, "utf8")) as AddonMetadata;
    } catch {
      /* try next candidate */
    }
  }
  return themeAddonMetadata;
}

export function listAllThemes(): { ui: typeof UI_THEMES; map: typeof MAP_THEMES } {
  return { ui: UI_THEMES, map: MAP_THEMES };
}
