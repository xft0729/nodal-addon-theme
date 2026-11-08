import type { MetroMap } from "./types.js";
export interface DetectionResult {
    /** Best matching theme id, or null if no confident match. */
    themeId: string | null;
    /** 0..1 confidence (style + palette agreement). */
    confidence: number;
    /** Top 3 candidates with scores. */
    candidates: {
        id: string;
        score: number;
    }[];
}
/**
 * Detect the preset whose style + palette best matches the map.
 * Returns null when the best score is below 0.35 (custom style).
 */
export declare function detectMapTheme(map: MetroMap): DetectionResult;
export declare function detectMapThemeId(map: MetroMap): string | null;
