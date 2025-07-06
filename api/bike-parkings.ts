import { fetchParkings } from "../src/fetch-parkings.js";
import { assertHitCache } from "../src/util.js";

export async function GET(req?: Request): Promise<Response> {
  if (req) assertHitCache(req);

  const { updatedAt, response } = await fetchParkings();

  return Response.json(response, {
    headers: {
      "Cache-Control": "max-age=0, s-maxage=86400, stale-while-revalidate",
      "Last-Modified": updatedAt.toUTCString(),
      "Content-Type": "application/json",
    },
  });
}
