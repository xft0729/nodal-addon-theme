#!/usr/bin/env node
/**
 * nodal-theme CLI — transform Nodal MetroMap JSON files without the editor.
 *
 *   nodal-theme list [--ui | --map]
 *   nodal-theme apply-map --in map.json --theme tokyo-neon [--out out.json] [--preserve-lang]
 *   nodal-theme export-theme --in map.json --id my-theme --name "My Theme" [--out theme.json]
 *   nodal-theme detect --in map.json
 *   nodal-theme ui-css --theme midnight [--out theme.css]
 *
 * --out omitted writes to stdout. Exit code 1 on validation errors.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { applyMapTheme, assertValidMapTheme, exportThemeFromMap } from "./apply.js";
import { detectMapTheme } from "./detect.js";
import { MAP_THEMES } from "./map-themes.js";
import { UI_THEMES, getUiThemeCss } from "./ui-themes.js";
import type { MetroMap } from "./types.js";

interface Args {
  _: string[];
  flags: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): Args {
  const _: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      _.push(a);
    }
  }
  return { _, flags };
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeOut(data: unknown, out: string | boolean | undefined, pretty = true) {
  const text = typeof data === "string" ? data : JSON.stringify(data, null, pretty ? 2 : undefined);
  if (typeof out === "string" && out) {
    writeFileSync(out, text + (text.endsWith("\n") ? "" : "\n"), "utf8");
    console.error(`wrote ${out}`);
  } else {
    process.stdout.write(text + (text.endsWith("\n") ? "" : "\n"));
  }
}

function fail(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function printHelp() {
  console.log(`nodal-theme — Theme Switcher for Nodal maps

USAGE
  nodal-theme list [--ui | --map]
  nodal-theme apply-map --in <map.json> --theme <id> [--out <file>] [--preserve-lang]
  nodal-theme export-theme --in <map.json> --id <id> --name <name> [--out <file>] [--description <text>]
  nodal-theme detect --in <map.json>
  nodal-theme ui-css --theme <id> [--out <file>]
  nodal-theme validate --in <theme.json>

OPTIONS
  --in <path>          input JSON file
  --out <path>         output path (default: stdout)
  --theme <id>         theme id (see "list")
  --preserve-lang      keep map.style.labelLanguage when applying

EXAMPLES
  nodal-theme apply-map --in lumen-city.json --theme tokyo-neon --out lumen-city.neon.json
  nodal-theme export-theme --in lumen-city.json --id my-brand --name "My Brand" --out my-brand.json
  nodal-theme ui-css --theme midnight --out midnight.css
`);
}

function main() {
  const { _: cmd, flags } = parseArgs(process.argv.slice(2));
  const verb = cmd[0];

  if (!verb || verb === "help" || verb === "--help" || verb === "-h") {
    printHelp();
    return;
  }

  switch (verb) {
    case "list": {
      if (flags["ui"]) {
        for (const t of UI_THEMES) console.log(`${t.id.padEnd(16)} ${t.name} [${t.mode}] — ${t.description}`);
      } else if (flags["map"]) {
        for (const t of MAP_THEMES) console.log(`${t.id.padEnd(22)} ${t.name} — ${t.description}`);
      } else {
        console.log("UI themes");
        for (const t of UI_THEMES) console.log(`  ${t.id.padEnd(14)} ${t.name} [${t.mode}]`);
        console.log("\nMap themes");
        for (const t of MAP_THEMES) console.log(`  ${t.id.padEnd(21)} ${t.name}`);
      }
      return;
    }
    case "apply-map": {
      const input = flags["in"] as string | undefined;
      const theme = flags["theme"] as string | undefined;
      if (!input) fail("apply-map requires --in <map.json>");
      if (!theme) fail("apply-map requires --theme <id> (run `nodal-theme list --map`)");
      const map = readJson(input!) as MetroMap;
      const next = applyMapTheme(map, theme!, { preserveLabelLanguage: Boolean(flags["preserve-lang"]) });
      writeOut(next, flags["out"]);
      return;
    }
    case "export-theme": {
      const input = flags["in"] as string | undefined;
      const id = flags["id"] as string | undefined;
      const name = flags["name"] as string | undefined;
      if (!input) fail("export-theme requires --in <map.json>");
      if (!id || !name) fail("export-theme requires --id <id> and --name <name>");
      const map = readJson(input!) as MetroMap;
      const theme = exportThemeFromMap(map, {
        id: id!,
        name: name!,
        description: typeof flags["description"] === "string" ? flags["description"] : undefined,
      });
      writeOut(theme, flags["out"]);
      return;
    }
    case "detect": {
      const input = flags["in"] as string | undefined;
      if (!input) fail("detect requires --in <map.json>");
      const map = readJson(input!) as MetroMap;
      console.log(JSON.stringify(detectMapTheme(map), null, 2));
      return;
    }
    case "ui-css": {
      const theme = flags["theme"] as string | undefined;
      if (!theme) fail("ui-css requires --theme <id> (run `nodal-theme list --ui`)");
      writeOut(getUiThemeCss(theme!), flags["out"]);
      return;
    }
    case "validate": {
      const input = flags["in"] as string | undefined;
      if (!input) fail("validate requires --in <theme.json>");
      try {
        assertValidMapTheme(readJson(input!));
        console.log("valid");
      } catch (e) {
        fail(e instanceof Error ? e.message : String(e));
      }
      return;
    }
    default:
      fail(`unknown command "${verb}" — run \`nodal-theme help\``);
  }
}

main();
