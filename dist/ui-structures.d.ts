/**
 * Structural tokens per whole-app theme.
 * Colors alone do not make a "different UI" — these change font,
 * corner radius, density, panel width, type size, shadows and
 * control heights so each theme feels like a different product.
 * Merged into every `uiThemeToCss` output after colour variables.
 *
 * Stock themes (nodal-light / nodal-dark) intentionally return {}
 * so they stay byte-identical to Nodal's baseline tokens.css.
 */
export declare const UI_STRUCTURES: Record<string, Record<string, string>>;
