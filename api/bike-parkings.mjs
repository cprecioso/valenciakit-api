// @ts-check

import { fetchParkings } from "../src/fetch-parkings.mjs";
import { assertHitCache } from "../src/util.mjs";

/** @type {import("@vercel/node").VercelApiHandler} */
const handler = async (req, res) => {
  assertHitCache(req);

  const { updatedAt, response } = await fetchParkings();
  res.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=86400, stale-while-revalidate"
  );
  res.setHeader("Last-Modified", updatedAt.toUTCString());
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(response);
};

export default handler;
