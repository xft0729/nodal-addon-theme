# Usage — Nodal Theme Switcher

Detailed integration notes. For the quick path, see [README.md](../README.md).

## 1. How Nodal theming works today

| Concern | Source in Nodal | Fields |
|---------|-----------------|--------|
| Editor UI theme | `packages/app/src/store/useEditor.ts` (`Theme = "light" \| "dark"`, `localStorage["nodal:theme"]`) → `Editor.tsx` sets `documentElement.dataset.theme` → CSS vars | `packages/app/src/styles/tokens.css` (`--color-bg`, …, `--canvas-grid`) |
| Map style | `MetroMap.style` (`core/types.ts: MapStyle`) | `background`, `gridStep`, `cornerRadius`, `labelLanguage`, `fontSize`, `stationRadius`, `fontFamily`, `labelColor`, `fontWeight`, `fontStyle`, `textTransform`, `letterSpacing` |
| Line appearance | `Line.color`, `Line.width`, `Line.style` | hex colour, px width, `solid`/`dashed`/`double` |
| Addon listing | `packages/app/src/components/AddonManager.tsx` (`AddonMetadata`, `CATALOG: AddonMetadata[] = []`) | this addon's `addon.json` |
| Undo | `packages/core/src/commands.ts` (`Command`, `CommandStack.dispatch`) | `makeApplyThemeCommand()` targets this |
| Export | `packages/renderer/src/svg.ts` (`toSVGString`) | renders `style` + line colours as-is |

This addon never imports `@linewright/core` at runtime. Its `src/types.ts` mirrors the `MetroMap` shape so structural typing accepts a real Nodal map directly.

## 2. Map themes — API

```ts
import { applyMapTheme, MAP_THEMES, getMapTheme } from "nodal-addon-theme";

// By id
const neon = applyMapTheme(map, "tokyo-neon");

// By object (custom JSON)
const custom = JSON.parse(await fs.readFile("my-theme.json", "utf8"));
const themed = applyMapTheme(map, custom);

// Options
applyMapTheme(map, "high-contrast-print", {
  recolorLines: true,        // default true — cycle linePalette
  enforceLineWidth: true,    // default false — keep each line's width
  enforceLineStyle: true,    // default false — keep each line's style
  preserveLabelLanguage: true // default false — keep map's labelLanguage
});
```

Semantics:

- **Style**: `theme.style` fields overwrite `map.style`. Missing fields keep the map's values (so partial custom themes work).
- **Palette**: `linePalette` cycles in `Object.keys(map.lines)` order. With 3 lines and a palette of 1, all lines share that colour — intended. Extra lines beyond the palette wrap around.
- **No mutation**: input `map` is `structuredClone`-d; safe to call inside `CommandStack.dispatch`.

### Style field table

| Field | Type | Notes |
|-------|------|-------|
| `background` | hex | Map background rect (renderer). |
| `gridStep` | number > 0 | Grid pattern step (editor + export `showGrid`). |
| `cornerRadius` | number ≥ 0 | Polyline corner radius. |
| `labelLanguage` | string | `en` / `zh-TW` / `ja`. Use `preserveLabelLanguage` to keep the map's value. |
| `fontSize` | number > 0 | Station/line label size. |
| `stationRadius` | number > 0 | Station disc radius. |
| `fontFamily` | string | Reuse Nodal's panel list; falls back to `sans-serif`. |
| `labelColor` | hex | Label text colour. Must match background contrast (see each preset's `notes`). |
| `fontWeight` | 400/500/600/700 | |
| `fontStyle` | `normal`/`italic` | |
| `textTransform` | `none`/`uppercase`/`lowercase` | NYC preset uses `uppercase`. |
| `letterSpacing` | number | px. Minimal Mono uses `1.2`. |

### Theme fields

| Field | Required | Notes |
|-------|----------|-------|
| `id`, `name`, `description` | yes | `id` is kebab-case, stable across versions. |
| `style` | yes | Partial — missing fields inherit from the map. |
| `linePalette` | yes | Non-empty hex array. |
| `lineWidth` | no | Uniform width when `enforceLineWidth: true`. |
| `lineStyle` | no | One of `solid`/`dashed`/`double`/`preserve`. |
| `notes`, `tags` | no | Shown in gallery / search. |

## 3. UI themes — API

```ts
import { applyUiTheme, getUiThemeCss, listUiThemes } from "nodal-addon-theme";

// Injected (live)
const cleanup = applyUiTheme("midnight");
localStorage.getItem("nodal:theme-addon"); // "midnight"
cleanup(); // removes <style data-nodal-theme-style>

// Static CSS (for tokens.css / <style> / <link>)
import midnightCss from "nodal-addon-theme/themes/ui/midnight.css?inline";
```

`applyUiTheme()`:

1. Sets `documentElement.dataset.theme` — for `nodal-light`/`nodal-dark` this is `light`/`dark` (stock); for extended ids it is the id itself (`midnight`, …).
2. Injects/ replaces `<style data-nodal-theme-style="…">` with `uiThemeToCss()` output.
3. Persists `localStorage["nodal:theme-addon"] = id` and `localStorage["nodal:theme"] = mode` so Nodal's `initialTheme()` boots to the right mode.

Re-apply on boot:

```ts
const saved = localStorage.getItem("nodal:theme-addon");
if (saved) try { applyUiTheme(saved); } catch { /* unknown id — ignore */ }
```

Add your own variables via `extraVariables` (e.g. `--panel-w`, shadows) — they render after `variables` so they win on conflict.

## 4. Detect / export / validate

```ts
import { detectMapTheme, exportThemeFromMap, validateMapTheme } from "nodal-addon-theme";

const { themeId, confidence, candidates } = detectMapTheme(map);
// confidence < 0.35 → themeId is null (custom style)

const exported = exportThemeFromMap(map, { id: "brand", name: "Brand", description: "…" });
validateMapTheme(exported); // { ok: true, errors: [] }
```

Scoring: background + label colour distance (weight 3), font size/radius/corner/family/weight/case (weight ≤1), palette overlap (weight 2). Deterministic, no network.

## 5. Nodal integration patterns

### A. One-shot in devtools

```js
// With Nodal dev running (module bundle exposes useEditor? fall back to CLI)
const map = JSON.parse(localStorage.getItem("…")); // or from File > Open
```

Prefer **B** or **C** for real use.

### B. Store patch (undo-safe)

```ts
// packages/app/src/store/useEditor.ts (add to EditorState)
applyTheme: (themeId: string) => void;
// …
applyTheme: (themeId) => {
  const { stack, map } = get();
  const { makeApplyThemeCommand } = await import("nodal-addon-theme");
  const next = stack.dispatch(makeApplyThemeCommand(map, themeId));
  set({ map: next, toast: `Theme applied` });
}
```

A full drop-in panel component is out of scope for the addon (Nodal owns its UI); the addon exposes the data + transforms so the panel stays a feature of Nodal itself, per `docs/PLUGINS.md`.

### C. File pipeline (no editor needed)

```bash
nodal-theme apply-map --in map.json --theme london-underground --out map.london.json
# File > Load JSON in Nodal — theme is already baked into style + colours
```

## 6. FAQ

**Do UI themes affect exported SVG/PNG/PDF?** No. Exports render `MetroMap.style` only. UI themes affect the editor chrome. Map themes affect exports.

**Dark map with white station discs?** Nodal's renderer draws station discs white with a coloured stroke (`svg.ts`), so dark map themes show white discs with vivid strokes. That's stock behaviour; pick a `labelColor` that reads on the background.

**An extended UI theme reverts to light/dark after reload?** `Editor.tsx` overwrites `dataset.theme` from its own store (light/dark only). Extended ids work if you re-apply on boot (§3) or put `applyUiTheme()` in a `useEffect` after mount. `nodal-light`/`nodal-dark` never revert because they reuse `light`/`dark`.

**Custom theme with only a palette?** Allowed — `style` can be `{}` and `labelLanguage` is inherited. Full partial themes validate.

**Adding a theme to `MAP_THEMES`?** Add an entry in `src/map-themes.ts`, run `npm run generate` (regenerates `themes/map/*.json`), add a row to README, commit. `test/apply.test.ts` validates every bundled theme automatically.

## 7. Repro / report

If a preset looks wrong, note the Nodal commit, map JSON, addon version, and whether the issue is screen (editor) or export (`toSVGString`). A screenshot of `demo.html` vs. the editor helps narrow it to UI vs. map theme.
