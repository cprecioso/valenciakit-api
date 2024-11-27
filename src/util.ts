import type { VercelRequest } from "@vercel/node";
import assert from "node:assert/strict";

export const assertHitCache = (req: VercelRequest) => {
  assert(
    req.method === "GET" || req.method === "HEAD",
    "Only GET  method allowed",
  );
  assert(!req.headers.range, "No Range header allowed");
  assert(!req.headers.authorization, "No Authorization header allowed");
  assert.notEqual(
    req.cookies._vercel_no_cache,
    "1",
    "No _vercel_no_cache cookie allowed",
  );
  assert.notEqual(
    req.query._vercel_no_cache,
    "1",
    "No _vercel_no_cache query parameter allowed",
  );
};
