import cookie from "cookie";
import assert from "node:assert/strict";

export const assertHitCache = (req: Request) => {
  assert(
    req.method === "GET" || req.method === "HEAD",
    "Only GET  method allowed",
  );
  assert(!req.headers.has("range"), "No Range header allowed");
  assert(!req.headers.has("authorization"), "No Authorization header allowed");

  assert.notEqual(
    cookie.parse(req.headers.get("cookie") || "")._vercel_no_cache,
    "1",
    "No _vercel_no_cache cookie allowed",
  );

  assert.notEqual(
    new URL(req.url).searchParams.get("_vercel_no_cache"),
    "1",
    "No _vercel_no_cache query parameter allowed",
  );
};
