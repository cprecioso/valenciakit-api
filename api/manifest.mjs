// @ts-check

import { assertHitCache } from "../src/util.mjs";
import { getLastUpdated } from "./bike-parkings.mjs";

/** @type {import("@vercel/node").VercelApiHandler} */
const handler = async (req, res) => {
  assertHitCache(req);

  const bikeParkings = {
    identifier: "bike-parkings",
    updatedAt: await getLastUpdated(),
  };

  res.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=86400, stale-while-revalidate"
  );
  res.status(200).json({ bikeParkings });
};

export default handler;
