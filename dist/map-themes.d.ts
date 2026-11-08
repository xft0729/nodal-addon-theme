import type { MapTheme } from "./types.js";
/**
 * Map presets — each theme is { style, linePalette, lineWidth?, lineStyle? }.
 * Applying a theme merges `style` over map.style and cycles `linePalette`
 * across lines in Object.keys(map.lines) order. Nothing else is touched
 * (stations, segments, waypoints, labels, meta stay identical).
 *
 * Values are chosen to validate against Nodal's schema and render via
 * packages/renderer/src/svg.ts without extra CSS.
 */
export declare const MAP_THEMES: MapTheme[];
export declare const MAP_THEME_IDS: string[];
export declare function getMapTheme(id: string): MapTheme | undefined;
export declare function getMapThemeOrThrow(id: string): MapTheme;
export declare function listMapThemes(): MapTheme[];
