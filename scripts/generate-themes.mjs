#!/usr/bin/env node
/**
 * Regenerate themes/map/*.json, themes/ui/*.css and examples/*.json
 * from the TypeScript sources so the JSON/CSS files never drift.
 * Requires a prior `npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const dist = join(root, "dist");

if (!existsSync(join(dist, "index.js"))) {
  console.error("dist/index.js not found. Run `npm run build` first.");
  process.exit(1);
}

const mod = await import("../dist/index.js");

mkdirSync(join(root, "themes", "map"), { recursive: true });
mkdirSync(join(root, "themes", "ui"), { recursive: true });
mkdirSync(join(root, "examples"), { recursive: true });

for (const theme of mod.MAP_THEMES) {
  writeFileSync(join(root, "themes", "map", `${theme.id}.json`), JSON.stringify(theme, null, 2) + "\n", "utf8");
  console.log(`themes/map/${theme.id}.json`);
}

for (const theme of mod.UI_THEMES) {
  writeFileSync(join(root, "themes", "ui", `${theme.id}.css`), mod.getUiThemeCss(theme.id), "utf8");
  console.log(`themes/ui/${theme.id}.css`);
}

const lumen = JSON.parse(readFileSync(join(root, "examples", "lumen-city.source.json"), "utf8"));
for (const [themeId, out] of [
  ["tokyo-neon", "lumen-city.tokyo-neon.json"],
  ["london-underground", "lumen-city.london.json"],
  ["nodal-dark", "lumen-city.dark.json"],
]) {
  writeFileSync(
    join(root, "examples", out),
    JSON.stringify(mod.applyMapTheme(lumen, themeId), null, 2) + "\n",
    "utf8",
  );
  console.log(`examples/${out}`);
}
