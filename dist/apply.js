import { getMapThemeOrThrow } from "./map-themes.js";
import { getUiThemeOrThrow, uiThemeToCss } from "./ui-themes.js";
/* ------------------------------------------------------------------ */
/*  Map themes                                                         */
/* ------------------------------------------------------------------ */
function clone(value) {
    return structuredClone(value);
}
function isHexColor(s) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s);
}
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
export function applyMapTheme(map, theme, options = {}) {
    const resolved = typeof theme === "string" ? getMapThemeOrThrow(theme) : theme;
    if (!resolved || !resolved.id || !Array.isArray(resolved.linePalette) || resolved.linePalette.length === 0) {
        throw new Error("Invalid map theme: linePalette must be a non-empty array of hex colours.");
    }
    for (const c of resolved.linePalette) {
        if (!isHexColor(c))
            throw new Error(`Invalid map theme colour "${c}" — expected "#rrggbb".`);
    }
    const { recolorLines = true, enforceLineStyle = false, enforceLineWidth = false, preserveLabelLanguage = false } = options;
    const nextStyle = { ...map.style };
    for (const [key, value] of Object.entries(resolved.style)) {
        if (value === undefined)
            continue;
        // labelLanguage can be pinned so a zh-TW map doesn't flip to English.
        if (key === "labelLanguage" && preserveLabelLanguage)
            continue;
        nextStyle[key] = value;
    }
    const lineIds = Object.keys(map.lines);
    const lines = {};
    lineIds.forEach((lineId, idx) => {
        const line = map.lines[lineId];
        const copy = clone(line);
        if (recolorLines) {
            copy.color = resolved.linePalette[idx % resolved.linePalette.length];
        }
        if (enforceLineWidth && resolved.lineWidth !== undefined) {
            copy.width = resolved.lineWidth;
        }
        if (enforceLineStyle && resolved.lineStyle && resolved.lineStyle !== "preserve") {
            copy.style = resolved.lineStyle;
        }
        lines[lineId] = copy;
    });
    return {
        ...map,
        style: nextStyle,
        lines,
    };
}
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
export function makeApplyThemeCommand(map, theme, options) {
    const before = clone(map);
    const after = applyMapTheme(map, theme, options);
    const themeName = typeof theme === "string" ? theme : theme.name;
    const label = `Apply theme: ${themeName}`;
    return {
        name: "SetTitle",
        label,
        apply: () => clone(after),
        revert: () => clone(before),
    };
}
/**
 * Extract a reusable MapTheme from the map's current style + line
 * colours. Recovers in insertion order so applying it back reproduces
 * (approximately) the same map. Validates colours.
 */
export function exportThemeFromMap(map, opts) {
    const lineIds = Object.keys(map.lines);
    const linePalette = lineIds.map((id) => map.lines[id].color);
    // Dedupe preserve order while keeping palette cyclable.
    const deduped = [];
    const seen = new Set();
    for (const c of linePalette) {
        const up = c.toUpperCase();
        if (!seen.has(up)) {
            seen.add(up);
            deduped.push(c);
        }
    }
    const s = map.style;
    return {
        id: opts.id,
        name: opts.name,
        description: opts.description ?? `Exported from "${map.meta.title}"`,
        notes: opts.notes,
        style: {
            background: s.background,
            gridStep: s.gridStep,
            cornerRadius: s.cornerRadius,
            labelLanguage: s.labelLanguage,
            fontSize: s.fontSize,
            stationRadius: s.stationRadius,
            fontFamily: s.fontFamily,
            labelColor: s.labelColor,
            fontWeight: s.fontWeight,
            fontStyle: s.fontStyle,
            textTransform: s.textTransform,
            letterSpacing: s.letterSpacing,
        },
        linePalette: deduped.length > 0 ? deduped : ["#E00034"],
        tags: ["custom", "exported"],
    };
}
/* ------------------------------------------------------------------ */
/*  UI themes                                                          */
/* ------------------------------------------------------------------ */
const UI_STYLE_TAG = "data-nodal-theme-style";
let injectedStyleEl = null;
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
export function applyUiTheme(theme) {
    const resolved = typeof theme === "string" ? getUiThemeOrThrow(theme) : theme;
    try {
        document.documentElement.dataset["theme"] = resolved.id === "nodal-light" || resolved.id === "nodal-dark"
            ? resolved.mode
            : resolved.id;
    }
    catch {
        /* Node / no DOM */
    }
    try {
        localStorage.setItem("nodal:theme-addon", resolved.id);
        localStorage.setItem("nodal:theme", resolved.mode);
    }
    catch {
        /* storage unavailable */
    }
    try {
        if (injectedStyleEl) {
            injectedStyleEl.remove();
            injectedStyleEl = null;
        }
        const el = document.createElement("style");
        el.setAttribute(UI_STYLE_TAG, resolved.id);
        el.textContent = uiThemeToCss(resolved);
        document.head.appendChild(el);
        injectedStyleEl = el;
    }
    catch {
        /* Node / no DOM */
    }
    return () => {
        try {
            injectedStyleEl?.remove();
            injectedStyleEl = null;
            delete document.documentElement.dataset["theme"];
            try {
                localStorage.removeItem("nodal:theme-addon");
            }
            catch {
                /* ignore */
            }
        }
        catch {
            /* ignore */
        }
    };
}
/** Remove any previously injected UI theme style. */
export function removeUiTheme() {
    try {
        document.querySelectorAll(`style[${UI_STYLE_TAG}]`).forEach((el) => el.remove());
        injectedStyleEl = null;
    }
    catch {
        /* ignore */
    }
}
export function getAppliedUiThemeId() {
    try {
        return localStorage.getItem("nodal:theme-addon");
    }
    catch {
        return null;
    }
}
export function validateMapTheme(candidate) {
    const errors = [];
    if (typeof candidate !== "object" || candidate === null) {
        return { ok: false, errors: ["Theme must be an object."] };
    }
    const t = candidate;
    if (typeof t["id"] !== "string" || !t["id"].trim())
        errors.push("id must be a non-empty string.");
    if (typeof t["name"] !== "string" || !t["name"].trim())
        errors.push("name must be a non-empty string.");
    if (typeof t["description"] !== "string" || !t["description"].trim()) {
        errors.push("description must be a non-empty string.");
    }
    if (typeof t["style"] !== "object" || t["style"] === null) {
        errors.push("style must be an object.");
    }
    else {
        const s = t["style"];
        if (s["background"] !== undefined && (typeof s["background"] !== "string" || !isHexColor(s["background"]))) {
            errors.push('style.background must be a hex colour like "#FFFFFF".');
        }
        if (s["labelColor"] !== undefined && (typeof s["labelColor"] !== "string" || !isHexColor(s["labelColor"]))) {
            errors.push('style.labelColor must be a hex colour like "#000000".');
        }
        for (const k of ["gridStep", "fontSize", "stationRadius"]) {
            if (s[k] !== undefined && (typeof s[k] !== "number" || s[k] <= 0)) {
                errors.push(`style.${k} must be a positive number.`);
            }
        }
        if (s["cornerRadius"] !== undefined && (typeof s["cornerRadius"] !== "number" || s["cornerRadius"] < 0)) {
            errors.push("style.cornerRadius must be a non-negative number.");
        }
        if (s["fontWeight"] !== undefined && ![400, 500, 600, 700].includes(s["fontWeight"])) {
            errors.push("style.fontWeight must be one of 400, 500, 600, 700.");
        }
        if (s["textTransform"] !== undefined && !["none", "uppercase", "lowercase"].includes(s["textTransform"])) {
            errors.push('style.textTransform must be "none" | "uppercase" | "lowercase".');
        }
        if (s["fontStyle"] !== undefined && !["normal", "italic"].includes(s["fontStyle"])) {
            errors.push('style.fontStyle must be "normal" | "italic".');
        }
    }
    if (!Array.isArray(t["linePalette"]) || t["linePalette"].length === 0) {
        errors.push("linePalette must be a non-empty array of hex colours.");
    }
    else {
        for (const c of t["linePalette"]) {
            if (typeof c !== "string" || !isHexColor(c))
                errors.push(`linePalette entry is not a hex colour: ${String(c)}`);
        }
    }
    return { ok: errors.length === 0, errors };
}
export function assertValidMapTheme(candidate) {
    const r = validateMapTheme(candidate);
    if (!r.ok)
        throw new Error(`Invalid map theme: ${r.errors.join("; ")}`);
    return candidate;
}
//# sourceMappingURL=apply.js.map