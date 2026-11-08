# QUICKSTART — use this addon in 60 seconds

Nodal has no plugin loader, so there is no “Install addon” button.
Everything below is a 1-minute path. Pick one.

## Option 1 — See a themed map inside Nodal (no code)

1. Open the live gallery:
   ```bash
   npm install && npm run build && npm run serve:demo
   ```
   Open <http://localhost:4173/demo.html> (you will see 12 full Lumen City maps re-rendered per theme).
2. On the card you like, click **Download map .json** (e.g. `lumen-city.tokyo-neon.json`).
3. Run Nodal:
   ```bash
   # in C:\Users\ryanc\Desktop\Nodal
   pnpm install && pnpm dev
   ```
   Open <http://localhost:5173>.
4. In Nodal: **File → Load JSON** → pick the downloaded file. The canvas now shows that theme.
   To try another theme, repeat step 2 with another card. To revert, load `examples/lumen-city.source.json`.

You can also skip the gallery: load these prebuilt files directly in Nodal the same way:

- `examples/lumen-city.source.json` (original)
- `examples/lumen-city.tokyo-neon.json`
- `examples/lumen-city.london.json`
- `examples/lumen-city.dark.json`

## Option 2 — Transform your own map without opening Nodal

```bash
npm install -g nodal-addon-theme
nodal-theme list
nodal-theme apply-map --in YOUR-map.json --theme london-underground --out YOUR-map.london.json
# then File → Load JSON in Nodal with YOUR-map.london.json
```

## Option 3 — Get a real theme dropdown inside Nodal

Copy-paste this 5-minute patch so Nodal shows a theme picker:

1. In Nodal, open `packages/app/src/components/AddonManager.tsx`. Change:
   ```ts
   const CATALOG: AddonMetadata[] = [];
   ```
   to:
   ```ts
   // Add at the top:
   // import { themeAddonMetadata } from "nodal-addon-theme";
   // (after: pnpm add -D nodal-addon-theme)
   const CATALOG: AddonMetadata[] = [themeAddonMetadata];
   ```
   The addon now appears in **Window → Addon & Extension Manager…** under *Transit & Design*.
2. For one-click map theming, add an `applyTheme` action to the store and a menu item in `MenuBar.tsx` (Window menu). See `docs/USAGE.md §5` for the exact snippet (`makeApplyThemeCommand(map, id)` + `stack.dispatch`). Undo (`Ctrl+Z`) reverts the theme.
3. For editor (workbench) themes, add `applyUiTheme()` call in `Editor.tsx` on mount and re-apply `localStorage["nodal:theme-addon"]` on boot — or import `themes/ui/midnight.css` into `tokens.css`.

## What each file does

| File | Do with it |
|------|------------|
| `ADDON manifest` (`addon.json`) | The “addon entry” for AddonManager. |
| `themes/map/*.json` | Theme definitions. Apply with the CLI or `applyMapTheme(map, id)`. |
| `themes/ui/*.css` | Workbench themes. Import into `packages/app/src/styles/tokens.css` or inject via `applyUiTheme()`. |
| `examples/*.json` | Ready-to-load maps with themes baked in. |
| `demo.html` | Visual proof: every theme rendered live. |

## Check it worked

- Map theme: canvas background, line colours and label colour changed; stations/segments untouched.
- UI theme: editor chrome (panels, buttons) recoloured; exported SVG is unaffected (exports use map style only, not UI theme).

Trouble? See `docs/USAGE.md` FAQ.
