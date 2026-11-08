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

export const UI_THEMES: UiTheme[] = [
  {
    id: "nodal-light",
    name: "Nodal Light",
    description: "Stock Nodal light workbench — #f3f3f3 surfaces, blue accent.",
    mode: "light",
    variables: {
      "--color-bg": "#f3f3f3",
      "--color-bg-surface": "#ffffff",
      "--color-bg-canvas": "#e8e8e8",
      "--color-bg-inset": "#eaeaea",
      "--color-bg-panel-header": "#fafafa",
      "--color-text": "#1a1a1a",
      "--color-text-secondary": "#6e6e6e",
      "--color-text-tertiary": "#909090",
      "--color-border": "#e0e0e0",
      "--color-border-subtle": "#eaeaea",
      "--color-border-strong": "#cccccc",
      "--color-accent": "#1473e6",
      "--color-accent-hover": "#095ec2",
      "--color-accent-soft": "rgba(20, 115, 230, 0.08)",
      "--color-accent-contrast": "#ffffff",
      "--color-danger": "#e34850",
      "--color-danger-soft": "#fef2f2",
      "--color-success": "#268e6c",
      "--color-success-soft": "#edfbf6",
      "--color-focus-ring": "#2680eb",
      "--canvas-grid": "#dedede",
    },
    tags: ["default", "light", "workbench"],
  },
  {
    id: "nodal-dark",
    name: "Nodal Dark",
    description: "Stock Nodal dark charcoal — #1c1c1c surfaces (default).",
    mode: "dark",
    variables: {
      "--color-bg": "#1c1c1c",
      "--color-bg-surface": "#242424",
      "--color-bg-canvas": "#161616",
      "--color-bg-inset": "#1a1a1a",
      "--color-bg-panel-header": "#212121",
      "--color-text": "#dedede",
      "--color-text-secondary": "#949494",
      "--color-text-tertiary": "#666666",
      "--color-border": "#2e2e2e",
      "--color-border-subtle": "#272727",
      "--color-border-strong": "#3d3d3d",
      "--color-accent": "#2680eb",
      "--color-accent-hover": "#378add",
      "--color-accent-soft": "rgba(38, 128, 235, 0.15)",
      "--color-accent-contrast": "#ffffff",
      "--color-danger": "#e34850",
      "--color-danger-soft": "rgba(227, 72, 80, 0.15)",
      "--color-success": "#268e6c",
      "--color-success-soft": "rgba(38, 142, 108, 0.15)",
      "--color-focus-ring": "#2680eb",
      "--canvas-grid": "#222222",
    },
    tags: ["default", "dark", "workbench"],
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep blue-black workbench — navy surfaces, ice-blue accent.",
    mode: "dark",
    variables: {
      "--color-bg": "#0a0f1e",
      "--color-bg-surface": "#111a2e",
      "--color-bg-canvas": "#070b16",
      "--color-bg-inset": "#0d1526",
      "--color-bg-panel-header": "#0f1930",
      "--color-text": "#e3e9ff",
      "--color-text-secondary": "#8b99c7",
      "--color-text-tertiary": "#5a6b9e",
      "--color-border": "#1c2a4a",
      "--color-border-subtle": "#16223d",
      "--color-border-strong": "#2a3d6b",
      "--color-accent": "#4cc9f0",
      "--color-accent-hover": "#7dd8fd",
      "--color-accent-soft": "rgba(76, 201, 240, 0.14)",
      "--color-accent-contrast": "#06202e",
      "--color-danger": "#ff5d73",
      "--color-danger-soft": "rgba(255, 93, 115, 0.14)",
      "--color-success": "#2ee6a8",
      "--color-success-soft": "rgba(46, 230, 168, 0.12)",
      "--color-focus-ring": "#4cc9f0",
      "--canvas-grid": "#13203c",
    },
    tags: ["dark", "blue", "night", "oled"],
  },
  {
    id: "forest",
    name: "Forest",
    description: "Botanical dark workbench — deep green surfaces, spring accent.",
    mode: "dark",
    variables: {
      "--color-bg": "#0e1a12",
      "--color-bg-surface": "#14251a",
      "--color-bg-canvas": "#0a130d",
      "--color-bg-inset": "#101e14",
      "--color-bg-panel-header": "#122217",
      "--color-text": "#e2f0e3",
      "--color-text-secondary": "#8fb593",
      "--color-text-tertiary": "#5d7f64",
      "--color-border": "#1e3a28",
      "--color-border-subtle": "#1a3222",
      "--color-border-strong": "#2c5439",
      "--color-accent": "#52d273",
      "--color-accent-hover": "#7be495",
      "--color-accent-soft": "rgba(82, 210, 115, 0.14)",
      "--color-accent-contrast": "#062213",
      "--color-danger": "#ff6b6b",
      "--color-danger-soft": "rgba(255, 107, 107, 0.14)",
      "--color-success": "#4ecdc4",
      "--color-success-soft": "rgba(78, 205, 196, 0.13)",
      "--color-focus-ring": "#52d273",
      "--canvas-grid": "#16291d",
    },
    tags: ["dark", "green", "nature", "oled"],
  },
  {
    id: "crimson",
    name: "Crimson Line",
    description: "Near-black workbench with signal-red accent — for high-attention editing.",
    mode: "dark",
    variables: {
      "--color-bg": "#161011",
      "--color-bg-surface": "#201517",
      "--color-bg-canvas": "#100a0b",
      "--color-bg-inset": "#1b1113",
      "--color-bg-panel-header": "#1e1315",
      "--color-text": "#f5e6e6",
      "--color-text-secondary": "#b08f8f",
      "--color-text-tertiary": "#7a5a5a",
      "--color-border": "#382224",
      "--color-border-subtle": "#2d1a1c",
      "--color-border-strong": "#4d3133",
      "--color-accent": "#ff4d6d",
      "--color-accent-hover": "#ff7a93",
      "--color-accent-soft": "rgba(255, 77, 109, 0.14)",
      "--color-accent-contrast": "#2b0710",
      "--color-danger": "#ff6b6b",
      "--color-danger-soft": "rgba(255, 107, 107, 0.15)",
      "--color-success": "#5ed3a3",
      "--color-success-soft": "rgba(94, 211, 163, 0.13)",
      "--color-focus-ring": "#ff4d6d",
      "--canvas-grid": "#2a191c",
    },
    tags: ["dark", "red", "night", "accent"],
  },
  {
    id: "solar",
    name: "Solar Paper",
    description: "Warm paper light workbench — cream surfaces, terracotta accent.",
    mode: "light",
    variables: {
      "--color-bg": "#faf5ec",
      "--color-bg-surface": "#fffdf7",
      "--color-bg-canvas": "#f1e8d7",
      "--color-bg-inset": "#f5edd9",
      "--color-bg-panel-header": "#fffaf0",
      "--color-text": "#2b2118",
      "--color-text-secondary": "#7a6a57",
      "--color-text-tertiary": "#a89880",
      "--color-border": "#e6dbc3",
      "--color-border-subtle": "#efe6cf",
      "--color-border-strong": "#d4c5a3",
      "--color-accent": "#c25307",
      "--color-accent-hover": "#a54405",
      "--color-accent-soft": "rgba(194, 83, 7, 0.10)",
      "--color-accent-contrast": "#ffffff",
      "--color-danger": "#c92a2a",
      "--color-danger-soft": "#fdecec",
      "--color-success": "#2f9e6e",
      "--color-success-soft": "#eafaf0",
      "--color-focus-ring": "#c25307",
      "--canvas-grid": "#e2d5b8",
    },
    tags: ["light", "warm", "paper", "retro"],
  },
  {
    id: "high-contrast",
    name: "High Contrast (A11y)",
    description: "WCAG AAA workbench — black/white with yellow focus ring.",
    mode: "light",
    variables: {
      "--color-bg": "#ffffff",
      "--color-bg-surface": "#ffffff",
      "--color-bg-canvas": "#ffffff",
      "--color-bg-inset": "#ffffff",
      "--color-bg-panel-header": "#ffffff",
      "--color-text": "#000000",
      "--color-text-secondary": "#222222",
      "--color-text-tertiary": "#444444",
      "--color-border": "#000000",
      "--color-border-subtle": "#666666",
      "--color-border-strong": "#000000",
      "--color-accent": "#0000c8",
      "--color-accent-hover": "#0000a0",
      "--color-accent-soft": "rgba(0, 0, 200, 0.08)",
      "--color-accent-contrast": "#ffffff",
      "--color-danger": "#c30000",
      "--color-danger-soft": "#ffe5e5",
      "--color-success": "#005a1e",
      "--color-success-soft": "#d6f5d6",
      "--color-focus-ring": "#ffcc00",
      "--canvas-grid": "#dddddd",
    },
    tags: ["a11y", "contrast", "light", "print"],
  },
];

export const UI_THEME_IDS: string[] = UI_THEMES.map((t) => t.id);

export function getUiTheme(id: string): UiTheme | undefined {
  return UI_THEMES.find((t) => t.id === id);
}

export function getUiThemeOrThrow(id: string): UiTheme {
  const t = getUiTheme(id);
  if (!t) throw new Error(`Unknown UI theme "${id}". Known themes: ${UI_THEME_IDS.join(", ")}`);
  return t;
}

export function listUiThemes(): UiTheme[] {
  return [...UI_THEMES];
}

/**
 * Render a theme as a drop-in CSS block.
 * Targets `:root[data-theme="<id>"]` so Nodal's dataset.theme = id picks it up.
 * Also includes `color-scheme`.
 */
export function uiThemeToCss(theme: UiTheme): string {
  const lines: string[] = [
    `/* Nodal Theme Switcher — ${theme.name} (${theme.id}) */`,
    `:root[data-theme="${theme.id}"] {`,
    `  color-scheme: ${theme.mode === "dark" ? "dark" : "light"};`,
  ];
  for (const [k, v] of Object.entries(theme.variables)) {
    lines.push(`  ${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.extraVariables ?? {})) {
    lines.push(`  ${k}: ${v};`);
  }
  lines.push("}");
  return lines.join("\n") + "\n";
}

export function getUiThemeCss(id: string): string {
  return uiThemeToCss(getUiThemeOrThrow(id));
}

export function getAllUiThemeCss(): string {
  return UI_THEMES.map(uiThemeToCss).join("\n");
}
