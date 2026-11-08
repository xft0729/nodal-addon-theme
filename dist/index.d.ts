import { MAP_THEMES } from "./map-themes.js";
import { UI_THEMES } from "./ui-themes.js";
import type { AddonMetadata } from "./types.js";
export * from "./types.js";
export * from "./map-themes.js";
export * from "./ui-themes.js";
export * from "./apply.js";
export * from "./detect.js";
export declare const ADDON_ID: "nodal-addon-theme";
export declare const ADDON_VERSION: "1.0.0";
export declare const ADDON_GITHUB_URL: "https://github.com/xft0729/nodal-addon-theme";
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
export declare const themeAddonMetadata: AddonMetadata;
/** Load addon.json from the package root (Node only). */
export declare function loadAddonMetadata(): AddonMetadata;
export declare function listAllThemes(): {
    ui: typeof UI_THEMES;
    map: typeof MAP_THEMES;
};
