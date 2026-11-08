# Nodal Theme Switcher

Whole-app themes for **Nodal** (Linewright) — the open-source transit map editor.

Switch the **entire editor** (menu bar, toolbar, panels, status bar) between **13 workbench themes** in one click. Every theme is a set of CSS variables for `tokens.css` — no canvas-only hack, no fork needed. Canvas map presets (12) are a bonus transform for `.json` files.

> GitHub: https://github.com/xft0729/nodal-addon-theme · License: MIT · Zero runtime deps

**→ New here? Start with [QUICKSTART.md](./QUICKSTART.md) (60 seconds).**
Live gallery: `npm run build && npm run serve:demo` → http://localhost:4173/demo.html

> How Nodal loads this addon: `Window → Addon & Extension Manager` fetches `addon.json` from the CDN, and the palette icon in the toolbar (`Theme (App)`) applies app themes via `setTheme()`. App themes are bundled in Nodal's `styles/tokens.css`; canvas map themes are online transforms in `dist/` (served via jsdelivr).

## What it adds

Nodal ships with one light / one dark workbench theme (`packages/app/src/styles/tokens.css`, `store/useEditor.ts` `Theme = "light" | "dark"`). This addon expands that to **13 whole-app themes** with swatch + checkmark selection, plus **12 canvas map presets** you can apply to any `.json`.

- **13 whole-app themes** — semantic CSS variables overriding `tokens.css` (`--color-bg`, `--color-accent`, `--canvas-grid`, …). Applied via `setTheme()` → `documentElement.dataset.theme`, persisted in `localStorage["nodal:theme"]`.
- **12 canvas map presets** — `style` + `linePalette` (+ optional uniform width/style). Station geometry, segments and labels are never touched.
- **AddonManager entry** — `addon.json` mirrors `AddonMetadata` verbatim.
- **CLI + library** — transform `.json` maps without the editor; `applyMapTheme()` / `applyUiTheme()` / `detectMapTheme()` in plain TS/JS.

## App themes — whole app (13)

Palette icon (toolbar) → **Whole-app theme** → pick one. Entire UI recolours and persists across reload. No internet needed (CSS is bundled in Nodal).

| ID | Name | Mode | Accent |
|----|------|------|--------|
| `nodal-light` / `light` | Nodal Light | light | `#1473e6` |
| `nodal-dark` / `dark` | Nodal Dark | dark | `#2680eb` |
| `midnight` | Midnight | dark | `#4cc9f0` |
| `forest` | Forest | dark | `#52d273` |
| `crimson` | Crimson Line | dark | `#ff4d6d` |
| `violet` | Violet Night | dark | `#a78bfa` |
| `teal` | Deep Teal | dark | `#2dd4bf` |
| `solar` | Solar Paper | light | `#c25307` |
| `lavender` | Lavender | light | `#7c3aed` |
| `mint` | Mint | light | `#059669` |
| `sky` | Sky | light | `#0284c7` |
| `rose` | Rose | light | `#e11d48` |
| `high-contrast` | High Contrast (A11y) | light | `#0000c8` |

In Nodal, `nodal-light`/`nodal-dark` map to the store ids `light`/`dark`. All other ids are used as-is (`data-theme="midnight"` etc.). See `themes/ui/*.css` for the full variable blocks and `docs/USAGE.md` for the field table.

### How it applies

```ts
import { applyUiTheme, getUiThemeCss } from "nodal-addon-theme";

applyUiTheme("midnight"); // inject <style> + dataset.theme + localStorage (standalone use)
getUiThemeCss("midnight"); // → CSS text for tokens.css / a <style> tag
```

In Nodal's store (bundled path):

```ts
useEditor.getState().setTheme("midnight"); // dataset.theme = "midnight", UI recolours, saved
```

## Map themes — canvas (12, bonus)

Pure `MetroMap → MetroMap` transforms (background + typography + line palette). Use via the CLI or `applyMapTheme()`; in Nodal they are applied via File → Load JSON or `makeApplyThemeCommand()` (undo-safe).

| ID | Name | Background |
|----|------|------------|
| `classic-light` | Classic Light | `#FFFFFF` |
| `nodal-dark` | Nodal Dark | `#141414` |
| `tokyo-neon` | Tokyo Neon | `#0B0F1A` |
| `london-underground` | London Underground | `#F5F0E6` |
| `taipei-metro` | Taipei Metro | `#FFFFFF` |
| `nyc-subway` | NYC Subway | `#FFFFFF` |
| `retro-blueprint` | Retro Blueprint | `#F3E9D2` |
| `minimal-mono` | Minimal Mono | `#FFFFFF` |
| `high-contrast-print` | High-Contrast Print | `#FFFFFF` |
| `ocean-depth` | Ocean Depth | `#0A1929` |
| `sunset-transit` | Sunset Transit | `#FFF3E0` |
| `pastel-dream` | Pastel Dream | `#F8F7FF` |

```ts
import { applyMapTheme } from "nodal-addon-theme";
const neon = applyMapTheme(map, "tokyo-neon"); // new map, input untouched
```

Applying merges `theme.style` over `map.style` and cycles `theme.linePalette` across `Object.keys(map.lines)` order. By default line `width`/`style` are preserved; pass `enforceLineWidth`/`enforceLineStyle` to force uniforms.

## Install

Nodal has no plugin loader yet (`docs/PLUGINS.md` — “still just an idea”).

- **In Nodal (recommended)**: `Window → Addon & Extension Manager…` lists this addon automatically (fetched from the CDN). Enable it, then use the palette icon in the top bar. App themes work offline (bundled CSS); map themes load online from `dist/` (served by jsdelivr — no `dist/` gitignore, rebuilt on every `npm run build`).
- **As a dependency**: `npm i nodal-addon-theme` and use `applyUiTheme()` / `applyMapTheme()` in your own code (see `docs/USAGE.md`).
- **Files only**: copy any `themes/ui/*.css` into `packages/app/src/styles/tokens.css`, or any `themes/map/*.json` through `nodal-theme apply-map`.

## CLI

```bash
nodal-theme list [--ui | --map]
nodal-theme apply-map --in map.json --theme tokyo-neon [--out out.json]
nodal-theme export-theme --in map.json --id my-brand --name "My Brand" [--out theme.json]
nodal-theme detect --in map.json
nodal-theme ui-css --theme midnight [--out theme.css]
```

## Files

```
addon.json                 AddonManager manifest (id: nodal-addon-theme)
QUICKSTART.md              60-second use cases
src/
  ui-themes.ts             13 whole-app themes + CSS renderer
  map-themes.ts            12 canvas presets
  apply.ts                 applyMapTheme / applyUiTheme / command / export / validate
  detect.ts                closest-preset detection (map)
  cli.ts                   nodal-theme CLI
themes/ui/*.css            generated whole-app CSS (13 files)
themes/map/*.json          generated map-theme JSON (12 files)
examples/lumen-city.*.json  ready-to-load themed maps
dist/                      built JS (committed — Nodal loads it via CDN; rebuild after any src change)
test/*.test.ts             Vitest (apply, detect, addon.json sync)
docs/USAGE.md              integration details, field tables, FAQ
demo.html                  gallery (npm run serve:demo)
```

## Development

```bash
npm install
npm run build       # tsc → dist/
npm run generate    # themes/*.json, themes/*.css, examples/*.json
npm test            # vitest
npm run serve:demo  # gallery at http://localhost:4173/demo.html
```

> `dist/` is committed on purpose: Nodal's theme picker imports `https://cdn.jsdelivr.net/gh/xft0729/nodal-addon-theme@main/dist/*` at runtime. If you change `src/`, run `npm run build` and commit `dist/`.

## License

MIT — see [LICENSE](./LICENSE). Unofficial addon; Nodal / Linewright are trademarks of their respective owners.
