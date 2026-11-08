/**
 * Self-contained types for Nodal (Linewright) MetroMap.
 *
 * These mirror `packages/core/src/types.ts` in Nodal so the addon can run
 * without importing `@linewright/core`. Structural typing means a real
 * `MetroMap` from Nodal is assignable to this `MetroMap` and vice versa
 * for the fields we touch. We intentionally do not re-export the full
 * core API — only what themes need.
 */
export type ID = string;
export interface Vec2 {
    x: number;
    y: number;
}
export type Anchor = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type StationKind = "normal" | "interchange" | "terminus";
export type LineStyle = "solid" | "dashed" | "double";
export interface Station {
    id: ID;
    name: Record<string, string>;
    position: Vec2;
    kind: StationKind;
    labelAnchor: Anchor;
    labelOffset?: Vec2;
    rotation?: number;
}
export interface Segment {
    from: ID;
    to: ID;
    waypoints?: Vec2[];
}
export interface Line {
    id: ID;
    name: Record<string, string>;
    color: string;
    segments: Segment[];
    style: LineStyle;
    width?: number;
}
export interface Label {
    id: ID;
    targetId: ID;
    targetKind: "station" | "line";
    text: Record<string, string>;
    position: Vec2;
    anchor: Anchor;
}
export interface MapStyle {
    background: string;
    gridStep: number;
    cornerRadius: number;
    snap45?: boolean;
    labelLanguage: string;
    fontSize: number;
    stationRadius: number;
    fontFamily?: string;
    labelColor?: string;
    fontWeight?: number;
    fontStyle?: string;
    textTransform?: string;
    letterSpacing?: number;
}
export interface TransferLink {
    id: ID;
    from: ID;
    to: ID;
    label?: Record<string, string>;
}
export interface MetroMap {
    schemaVersion: number;
    meta: {
        title: string;
        author?: string;
        createdAt: string;
    };
    stations: Record<ID, Station>;
    lines: Record<ID, Line>;
    labels: Record<ID, Label>;
    transfers?: Record<ID, TransferLink>;
    style: MapStyle;
}
/** Subset of a map theme that is safe to apply over any map. */
export interface ThemeStylePatch {
    background?: string;
    gridStep?: number;
    cornerRadius?: number;
    labelLanguage?: string;
    fontSize?: number;
    stationRadius?: number;
    fontFamily?: string;
    labelColor?: string;
    fontWeight?: number;
    fontStyle?: string;
    textTransform?: string;
    letterSpacing?: number;
}
export interface MapTheme {
    id: string;
    name: string;
    /** Short one-liner shown in galleries. */
    description: string;
    /** Longer note (contrast/street credibility/print notes). */
    notes?: string;
    style: ThemeStylePatch;
    /** Hex palette cycled across lines in Object.keys(map.lines) order. */
    linePalette: string[];
    /** Uniform line width to enforce, if set. */
    lineWidth?: number;
    /** Uniform line style to enforce, if set ("solid" preserves variants). */
    lineStyle?: LineStyle | "preserve";
    /** Tags for search in AddonManager. */
    tags?: string[];
}
export interface UiTheme {
    id: string;
    name: string;
    description: string;
    /** "light" | "dark" for Nodal's stock `localStorage["nodal:theme"]` fallback. */
    mode: "light" | "dark";
    /** Semantic CSS variables merged over Nodal's tokens.css. */
    variables: Record<string, string>;
    /** Extra tokens.css overrides (same shape, for advanced use). */
    extraVariables?: Record<string, string>;
    tags?: string[];
}
export interface ApplyMapThemeOptions {
    /** Recolour lines from theme.linePalette (default true). */
    recolorLines?: boolean;
    /** Map line `style` from theme.lineStyle (default false — preserve). */
    enforceLineStyle?: boolean;
    /** Map line `width` from theme.lineWidth (default false — preserve). */
    enforceLineWidth?: boolean;
    /** Keep existing labelLanguage (default false — use theme's). */
    preserveLabelLanguage?: boolean;
}
export interface ExportThemeOptions {
    id: string;
    name: string;
    description?: string;
    notes?: string;
}
/** Shape mirrors Nodal AddonManager's AddonMetadata. */
export interface AddonMetadata {
    id: string;
    name: string;
    version: string;
    author: string;
    githubUrl?: string;
    category: "transit" | "localization" | "integrations" | "templates";
    source: "core" | "official" | "community";
    desc: string;
    longDesc?: string;
    features?: string[];
    tags: string[];
    defaultEnabled?: boolean;
}
/** Nodal Command shape (packages/core/src/commands.ts). */
export interface NodalCommand {
    name: string;
    label: string;
    apply: (map: MetroMap) => MetroMap;
    revert: (map: MetroMap) => MetroMap;
}
