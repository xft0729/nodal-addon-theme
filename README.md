# Nodal Theme Switcher

Theme switcher addon for **Nodal** (Linewright) — the open-source transit map editor.

Switch between **12 transit map presets** and **7 editor UI themes** in one click: background, typography, line palettes, corner radius, station size, and workbench colours. Pure `MetroMap → MetroMap` transforms, undo-safe via Nodal's `CommandStack`, plus CSS you can drop into `tokens.css`.

> GitHub: https://github.com/xft0729/nodal-addon-theme · License: MIT · Zero runtime deps

**→ New here? Start with [QUICKSTART.md](./QUICKSTART.md) (60 seconds, no code).**
Live gallery: `npm run build && npm run serve:demo` → http://localhost:4173/demo.html (12 full maps rendered per theme; download any card → **File → Load JSON** in Nodal).

> Honest note: Nodal has no plugin loader yet (`docs/PLUGINS.md` — “still just an idea”, `CATALOG = []` in `AddonManager.tsx`). So this addon cannot install itself. It works three ways: (1) download a themed map `.json` and load it, (2) run the CLI to transform your map, (3) paste 3 lines into Nodal to list it + add a dropdown (`QUICKSTART.md` Option 3).

## What it adds

Nodal ships with one light / one dark UI theme and hand-tuned `MapStyle` (see `packages/app/src/styles/tokens.css`, `packages/core/src/types.ts`). This addon expands that to:

- **12 map themes** — `style` + `linePalette` (+ optional uniform width/style). Station geometry, segments and labels are never touched.
- **7 UI themes** — semantic CSS variables overriding `tokens.css` (`--color-bg`, `--color-accent`, `--canvas-grid`, …).
- **Undo-safe apply** — `makeApplyThemeCommand()` returns a Nodal `Command` for `CommandStack.dispatch()`.
- **Detect / export / validate** — find the closest preset, export your current style as JSON, validate custom themes.
- **AddonManager entry** — `addon.json` mirrors `AddonMetadata` verbatim so Nodal can list it.
- **CLI + gallery** — transform `.json` maps without opening the editor; `demo.html` previews every theme.

## Themes

### Map themes (`themes/map/*.json`)

| ID | Name | Background | Palette hint |
|----|------|------------|--------------|
| `classic-light` | Classic Light | `#FFFFFF` | Nodal stock `#E00034 #0067C0 #009444 …` |
| `nodal-dark` | Nodal Dark | `#141414` | vivid screen palette |
| `tokyo-neon` | Tokyo Neon | `#0B0F1A` | Marunouchi/Ginza/Tozai family, neon |
| `london-underground` | London Underground | `#F5F0E6` | Bakerloo `#B36305` → Victoria `#0098D4` |
| `taipei-metro` | Taipei Metro | `#FFFFFF` | Bannan `#0070BD`, Tamsui `#CB2C30`, … |
| `nyc-subway` | NYC Subway | `#FFFFFF` | A/C/E `#0039A6`, B/D/F/M `#FF6319`, … |
| `retro-blueprint` | Retro Blueprint | `#F3E9D2` | sepia heritage, serif/italic |
| `minimal-mono` | Minimal Mono | `#FFFFFF` | grayscale ramp, monospace |
| `high-contrast-print` | High-Contrast Print | `#FFFFFF` | AAA, photocopy-safe |
| `ocean-depth` | Ocean Depth | `#0A1929` | harbour blues |
| `sunset-transit` | Sunset Transit | `#FFF3E0` | ember/amber/violet |
| `pastel-dream` | Pastel Dream | `#F8F7FF` | soft illustration pastels |

Each theme sets (when present): `background`, `gridStep`, `cornerRadius`, `fontSize`, `stationRadius`, `fontFamily`, `labelColor`, `fontWeight`, `fontStyle`, `textTransform`, `letterSpacing`, `labelLanguage`.

### UI themes (`themes/ui/*.css`)

| ID | Name | Mode |
|----|------|------|
| `nodal-light` | Nodal Light | light |
| `nodal-dark` | Nodal Dark | dark |
| `midnight` | Midnight (navy, ice-blue) | dark |
| `forest` | Forest (deep green) | dark |
| `crimson` | Crimson Line (near-black + red) | dark |
| `solar` | Solar Paper (warm cream) | light |
| `high-contrast` | High Contrast (A11y) | light |

> Full specs: [docs/USAGE.md](./docs/USAGE.md). Sources of truth: `src/map-themes.ts`, `src/ui-themes.ts`.

## Install

### Option A — List in Nodal's AddonManager (recommended)

Nodal's `CATALOG` in `packages/app/src/components/AddonManager.tsx` is currently `[]`. Register this addon:

```tsx
// packages/app/src/components/AddonManager.tsx
import { themeAddonMetadata } from "nodal-addon-theme";
// …
const CATALOG: AddonMetadata[] = [themeAddonMetadata];
```

Or copy `addon.json` (same fields) into the catalog. The addon then appears under **Transit & Design** with its GitHub pill linking back here.

### Option B — Use the code in Nodal

```bash
# in Nodal repo root
pnpm add -D nodal-addon-theme
```

```ts
// inside Nodal (e.g. store/useEditor.ts or a scratch panel)
import { applyMapTheme, makeApplyThemeCommand } from "nodal-addon-theme";

// Undo-safe: dispatch via CommandStack so Ctrl+Z reverts the theme.
const cmd = makeApplyThemeCommand(useEditor.getState().map, "tokyo-neon");
const next = useEditor.getState().stack.dispatch(cmd);
useEditor.setState({ map: next });
```

`makeApplyThemeCommand` uses `name: "SetTitle"` + a descriptive label — the same compatibility trick `avoidLabelOverlaps` uses in `useEditor.ts` (Nodal's `CommandName` union is closed in core).

### Option C — Transform files without Nodal

```bash
npm i -g nodal-addon-theme   # or: npx nodal-theme …
nodal-theme list
nodal-theme apply-map --in lumen-city.json --theme tokyo-neon --out lumen-city.neon.json
```

Or as a library:

```js
import { applyMapTheme } from "nodal-addon-theme";
import map from "./lumen-city.json" with { type: "json" };
const neon = applyMapTheme(map, "tokyo-neon");
await Bun.write("lumen-city.neon.json", JSON.stringify(neon, null, 2));
```

## Usage

### Map themes

```ts
import { applyMapTheme, detectMapTheme, exportThemeFromMap } from "nodal-addon-theme";

// Apply (pure, returns a new map)
const neon = applyMapTheme(map, "tokyo-neon");
// …or with a custom theme object loaded from themes/map/my-theme.json

// Keep the map's label language (e.g. zh-TW) when the theme says "en"
const themed = applyMapTheme(map, "london-underground", { preserveLabelLanguage: true });

// Detect the closest preset
import { detectMapTheme } from "nodal-addon-theme";
const { themeId, confidence, candidates } = detectMapTheme(map);

// Export current style to reuse
const myTheme = exportThemeFromMap(map, { id: "my-brand", name: "My Brand" });
```

Applying merges `theme.style` over `map.style` and cycles `theme.linePalette` across `Object.keys(map.lines)` order. By default line `width`/`style` are preserved; pass `enforceLineWidth`/`enforceLineStyle` to force the theme's uniforms. Pass `recolorLines: false` to keep existing colours.

### UI themes

Browser (injected `<style data-nodal-theme-style>` + `documentElement.dataset.theme`):

```ts
import { applyUiTheme, getUiThemeCss } from "nodal-addon-theme";

applyUiTheme("midnight");              // inject + persist
// …
applyUiTheme("nodal-dark").cleanup?.() // cleanup function returned? no — see below
```

> `applyUiTheme()` returns a cleanup function. Call it to remove the style tag.

Static (drop-in CSS, survives Nodal's stock `dataset.theme` update):

```css
/* packages/app/src/styles/tokens.css — then set data-theme="midnight" */
:root[data-theme="midnight"] {
  color-scheme: dark;
  --color-bg: #0a0f1e;
  /* … full block: `nodal-theme ui-css --theme midnight` … */
}
```

Or use the prebuilt files in `themes/ui/midnight.css` directly. Extended ids (`midnight`, `forest`, …) need `applyUiTheme()` (or equivalent) because `Editor.tsx` only sets `light`/`dark`; `nodal-light`/`nodal-dark` work with the stock toggle.

To persist across reloads, `applyUiTheme()` writes `localStorage["nodal:theme-addon"] = id` and `localStorage["nodal:theme"] = mode`. On boot, re-apply if `nodal:theme-addon` is set.

### Custom theme

Create `my-theme.json` (validate with `nodal-theme validate --in my-theme.json`):

```json
{
  "id": "my-brand",
  "name": "My Brand",
  "description": "Corporate template",
  "style": { "background": "#FFFFFF", "labelColor": "#000000", "fontSize": 14, "stationRadius": 8, "cornerRadius": 18, "gridStep": 40, "labelLanguage": "en" },
  "linePalette": ["#E00034", "#0067C0", "#009444"]
}
```

Then `applyMapTheme(map, myTheme)`. See `docs/USAGE.md#custom-theme` for the full field table.

## CLI

```bash
nodal-theme list [--ui | --map]
nodal-theme apply-map --in map.json --theme tokyo-neon [--out out.json] [--preserve-lang]
nodal-theme export-theme --in map.json --id my-brand --name "My Brand" [--out theme.json]
nodal-theme detect --in map.json
nodal-theme ui-css --theme midnight [--out theme.css]
nodal-theme validate --in theme.json
```

## Files

```
addon.json                 AddonManager manifest (id: nodal-addon-theme)
QUICKSTART.md              60-second use cases (no code required)
src/
  types.ts                 MetroMap-compatible types (no @linewright/core dep)
  map-themes.ts            12 map presets
  ui-themes.ts             7 UI themes + CSS renderer
  apply.ts                 applyMapTheme / applyUiTheme / command / export / validate
  detect.ts                closest-theme detection
  cli.ts                   nodal-theme CLI
  index.ts                 public API + themeAddonMetadata
themes/map/*.json          generated map-theme JSON
themes/ui/*.css            generated UI-theme CSS
examples/
  lumen-city.source.json     original example
  lumen-city.tokyo-neon.json themed example (generated)
  lumen-city.london.json     themed example
  lumen-city.dark.json       themed example
test/*.test.ts             Vitest (apply, detect, addon.json sync)
docs/USAGE.md              integration details, field tables, FAQ
demo.html                  gallery (npm run serve:demo)
```

`themes/` and `examples/lumen-city.*` are generated by `npm run generate` — edit `src/*-themes.ts` and regenerate.

## Development

```bash
npm install
npm run build       # tsc → dist/
npm run generate    # themes/*.json, themes/*.css, examples/*.json
npm test            # vitest
npm run typecheck
npm run serve:demo  # gallery at http://localhost:4173/demo.html
```

## FAQ

**Does this fork Nodal?** No. Map themes are pure transforms over `MetroMap` JSON. UI themes are CSS variables. The only Nodal touchpoint is the optional `CATALOG` entry (Option A).

**Will exports keep the theme?** Yes. `style` and line `color` live in the map JSON, so `toSVGString` renders the theme identically. UI themes only affect the editor chrome, not the exported map.

**Why `CommandName` "SetTitle"?** Nodal's `CommandName` union in `packages/core/src/commands.ts` doesn't include `"ApplyTheme"`. `makeApplyThemeCommand` uses `"SetTitle"` with label `"Apply theme: …"` — the same pattern `useEditor.ts` already uses for "Arrange labels".

**Fonts?** `fontFamily` values reuse Nodal's existing panel list (`Noto Sans`, `Inter`, `Montserrat`, …). Missing families fall back to `sans-serif` in the browser.

## Contributing

Issues and PRs welcome. Keep themes data-only (no logic in `src/*-themes.ts`), validate new presets with `validateMapTheme`, and regenerate `themes/` + `examples/` (`npm run generate`) before committing.

## License

MIT — see [LICENSE](./LICENSE). Unofficial addon; Nodal / Linewright are trademarks of their respective owners.
