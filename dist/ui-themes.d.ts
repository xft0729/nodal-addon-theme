import type { UiTheme } from "./types.js";
/**
 * Editor UI themes — semantic CSS variables that override Nodal's
 * packages/app/src/styles/tokens.css.
 *
 * Usage:
 *   1. `applyUiTheme("midnight")` — injects a <style data-nodal-theme>
 *      and sets document.documentElement.dataset.theme = "midnight".
 *      Also writes localStorage["nodal:theme-addon"] = "midnight" and
 *      localStorage["nodal:theme"] = mode ("dark" | "light") so Nodal's
 *      stock initialTheme() still boots to the right mode.
 *   2. Or copy `getUiThemeCss("midnight")` into tokens.css / a <style>.
 *
 * Nodal's Editor.tsx only sets dataset.theme = "light" | "dark". To use
 * extended ids, call applyUiTheme() after mount, or set data-theme to
 * the extended id in CSS with [data-theme="midnight"] selectors (what
 * the bundled themes/*.css files do).
 */
export declare const UI_THEMES: UiTheme[];
export declare const UI_THEME_IDS: string[];
export declare function getUiTheme(id: string): UiTheme | undefined;
export declare function getUiThemeOrThrow(id: string): UiTheme;
export declare function listUiThemes(): UiTheme[];
/**
 * Render a theme as a drop-in CSS block.
 * Targets `:root[data-theme="<id>"]` so Nodal's dataset.theme = id picks it up.
 * Also includes `color-scheme`.
 */
export declare function uiThemeToCss(theme: UiTheme): string;
export declare function getUiThemeCss(id: string): string;
export declare function getAllUiThemeCss(): string;
