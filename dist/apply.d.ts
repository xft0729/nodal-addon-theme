import type { ApplyMapThemeOptions, ExportThemeOptions, MapTheme, MetroMap, NodalCommand, UiTheme } from "./types.js";
/**
 * Apply a map theme to a MetroMap. Pure — never mutates the input.
 *
 * - Merges theme.style over map.style (fields the theme omits are kept).
 * - Recolours lines from theme.linePalette in Object.keys(map.lines)
 *   order (insertion order) unless options.recolorLines === false.
 * - Line width/style: preserved by default; set enforce* to apply the
 *   theme's uniform values. A theme lineStyle of "preserve" means
 *   "keep each line's own style" (no-op).
 */
export declare function applyMapTheme(map: MetroMap, theme: MapTheme | string, options?: ApplyMapThemeOptions): MetroMap;
/**
 * Build a Nodal Command that applies a theme, so the change is undoable
 * via CommandStack (packages/core/src/commands.ts). Useful inside
 * useEditor: `stack.dispatch(applyThemeCommand(map, "tokyo-neon"))`.
 *
 * The command captures before/after snapshots, matching Nodal's
 * immutable command style. Name is "SetTitle" to satisfy Nodal's
 * CommandName union (same trick as avoidLabelOverlaps in useEditor.ts);
 * the label carries the real description.
 */
export declare function makeApplyThemeCommand(map: MetroMap, theme: MapTheme | string, options?: ApplyMapThemeOptions): NodalCommand;
/**
 * Extract a reusable MapTheme from the map's current style + line
 * colours. Recovers in insertion order so applying it back reproduces
 * (approximately) the same map. Validates colours.
 */
export declare function exportThemeFromMap(map: MetroMap, opts: ExportThemeOptions): MapTheme;
/**
 * Inject a UI theme into the live Nodal page.
 * - Sets document.documentElement.dataset.theme to the theme id (so
 *   [data-theme="midnight"] etc. match; "nodal-light"/"nodal-dark"
 *   also map to stock "light"/"dark" for backwards compatibility).
 * - Replaces any previous injected <style data-nodal-theme-style>.
 * - Persists localStorage["nodal:theme-addon"] = id and
 *   localStorage["nodal:theme"] = mode.
 *
 * Returns a cleanup function that removes the injected style (Nodal's
 * own light/dark CSS then applies again). No-op in Node.
 */
export declare function applyUiTheme(theme: UiTheme | string): () => void;
/** Remove any previously injected UI theme style. */
export declare function removeUiTheme(): void;
export declare function getAppliedUiThemeId(): string | null;
export interface ValidationResult {
    ok: boolean;
    errors: string[];
}
export declare function validateMapTheme(candidate: unknown): ValidationResult;
export declare function assertValidMapTheme(candidate: unknown): MapTheme;
