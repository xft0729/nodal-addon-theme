#!/usr/bin/env node
/**
 * Tiny static server for the theme gallery (demo.html).
 *   npm run build && node scripts/serve-demo.mjs
 * → http://localhost:4173/demo.html
 */
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const port = Number(process.env.PORT ?? 4173);

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const candidates = [join(root, url === "/" ? "demo.html" : url), join(root, "dist", url.replace(/^\//, ""))];
  let file = null;
  for (const c of candidates) {
    if (existsSync(c)) {
      file = c;
      break;
    }
  }
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found\n");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
})
  .listen(port, () => console.log(`demo: http://localhost:${port}/demo.html`));
