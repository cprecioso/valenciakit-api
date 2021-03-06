// @ts-check

import got from "got";
import assert from "node:assert/strict";
import { assertHitCache } from "../src/util.mjs";

const GEOJSON_URL =
  "https://geoportal.valencia.es/apps/OpenData/Trafico/tra_bici_aparcamiento.json";

/** @type {import("@vercel/node").VercelApiHandler} */
const handler = async (req, res) => {
  assertHitCache(req);

  const dataResponse = await got(GEOJSON_URL);

  const lastModifiedHeader = dataResponse.headers["last-modified"];
  const updatedAt = lastModifiedHeader
    ? new Date(lastModifiedHeader)
    : new Date(0);

  /** @type {import("../types/geojson-response").GeoJSONResponse} */
  const data = JSON.parse(dataResponse.body);

  assert.equal(data.type, "FeatureCollection");
  assert.equal(data.name, "gis.TRA_BICI_APARCAMIENTO");

  const spots = data.features.map((feat) => {
    assert(feat.type, "feature");
    assert(feat.geometry.type, "point");

    const [longitude, latitude] = feat.geometry.coordinates;

    /** @type {string | null} */
    let type = feat.properties.tipo;
    if (type === " " || !type) type = null;

    return {
      id: `${latitude}:${longitude}`,
      coordinate: { latitude, longitude },
      capacity: feat.properties.numplazas,
      type,
    };
  });

  res.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=86400, stale-while-revalidate"
  );
  res.status(200).json({ updatedAt, spots });
};

export default handler;
