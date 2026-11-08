/**
 * Self-contained types for Nodal (Linewright) MetroMap.
 *
 * These mirror `packages/core/src/types.ts` in Nodal so the addon can run
 * without importing `@linewright/core`. Structural typing means a real
 * `MetroMap` from Nodal is assignable to this `MetroMap` and vice versa
 * for the fields we touch. We intentionally do not re-export the full
 * core API — only what themes need.
 */
export {};
//# sourceMappingURL=types.js.map