// Plain HTTP static server for the Astro `dist/` output.
// Used by `bun run preview` and Playwright's webServer. Replaces
// `astro preview` because Astro's preview defaults to HTTPS on Windows,
// which Playwright + curl refuse to negotiate without a real cert.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

const ROOT = resolve(process.cwd(), "dist/client");
const PORT = Number(process.env.PORT ?? 4321);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function tryRead(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
    if (s.isDirectory()) return tryRead(join(p, "index.html"));
  } catch {}
  return null;
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";

    let filePath = join(ROOT, pathname);
    // Prevent directory traversal.
    if (!filePath.startsWith(ROOT + sep) && filePath !== ROOT) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    let resolved = await tryRead(filePath);
    if (!resolved) {
      // Fallback to SPA-style 404 (the static dist already ships /404.html).
      const fallback = join(ROOT, "404.html");
      resolved = await tryRead(fallback);
    }
    if (!resolved) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const buf = await readFile(resolved);
    res.writeHead(200, {
      "content-type": MIME[extname(resolved)] ?? "application/octet-stream",
      "cache-control": "public, max-age=0",
    });
    res.end(buf);
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
});

server.listen(PORT, () => {
  console.log(`Preview server listening on http://localhost:${PORT}`);
});