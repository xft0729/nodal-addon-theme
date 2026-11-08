# QUICKSTART — use this addon in 60 seconds

Nodal has no plugin loader, so there is no “Install addon” button.
Everything below is a 1-minute path. Pick one.

## Option 1 — Change the whole app theme (recommended)

1. Run Nodal:
   ```bash
   # in C:\Users\ryanc\Desktop\Nodal
   pnpm install && pnpm dev
   ```
   Open <http://localhost:5173>.
2. Top bar, palette icon → **Theme (App)** dropdown.
   Whole-app themes are listed first (13 total). Pick one — toolbar, panels, menu bar and canvas grid recolour instantly and persist across reload.
   Or use **Window → App Theme: …** for the same list.

No internet needed for app themes (CSS is bundled in Nodal). If you see the icon, the addon is active. If you see the sun/moon toggle instead, the addon is disabled: open **Window → Addon & Extension Manager…** → enable `nodal-addon-theme`.

## Option 2 — See a themed map inside Nodal (no code)

1. Open the live gallery:
   ```bash
   npm install && npm run build && npm run serve:demo
   ```
   Open <http://localhost:4173/demo.html> (12 full Lumen City maps re-rendered per map preset).
2. On the card you like, click **Download map .json** (e.g. `lumen-city.tokyo-neon.json`).
3. In Nodal: **File → Load JSON** → pick the downloaded file. The canvas now shows that map theme.
   To revert, load `examples/lumen-city.source.json`.

Prebuilt files are in `examples/` (`lumen-city.source.json`, `lumen-city.tokyo-neon.json`, `lumen-city.london.json`, `lumen-city.dark.json`) — load them the same way.

## Option 3 — Transform your own map without opening Nodal

```bash
npm install -g nodal-addon-theme
nodal-theme list
nodal-theme apply-map --in YOUR-map.json --theme london-underground --out YOUR-map.london.json
# then File → Load JSON in Nodal with YOUR-map.london.json
```

## What each file does

| File | Do with it |
|------|------------|
| `ADDON manifest` (`addon.json`) | The “addon entry” for AddonManager. |
| `themes/ui/*.css` | Whole-app themes (13). Import into `packages/app/src/styles/tokens.css` or inject via `applyUiTheme()`. |
| `themes/map/*.json` | Canvas presets (12). Apply with the CLI or `applyMapTheme(map, id)`. |
| `examples/*.json` | Ready-to-load maps with themes baked in. |
| `demo.html` | Visual proof: every theme rendered live. |

## Check it worked

- App theme: editor chrome (panels, buttons, menu bar) recoloured; choice persists after reload.
- Map theme: canvas background, line colours and label colour changed; stations/segments untouched.

Trouble? See `docs/USAGE.md` FAQ.
