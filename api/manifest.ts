import type { VercelApiHandler } from "@vercel/node";
import { fetchParkings } from "../src/fetch-parkings.js";
import { assertHitCache } from "../src/util.js";

const handler: VercelApiHandler = async (req, res) => {
  assertHitCache(req);

  const bikeParkings = await fetchParkings();

  res.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=86400, stale-while-revalidate",
  );
  res.setHeader("Last-Modified", bikeParkings.updatedAt.toUTCString());

  res.status(200).json({
    "bike-parkings": {
      size: bikeParkings.response.length,
      updatedAt: bikeParkings.updatedAt,
    },
  });
};

export default handler;
