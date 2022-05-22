// @ts-check

import got from "got";
import assert from "node:assert/strict";
import { assertHitCache } from "../src/util.mjs";

const GEOJSON_URL =
  "https://geoportal.valencia.es/apps/OpenData/Trafico/tra_bici_aparcamiento.json";

/** @type {import("@vercel/node").VercelApiHandler} */
const handler = async (req, res) => {
  assertHitCache(req);

  /** @type {import("../types/geojson-response").GeoJSONResponse} */
  const data = await got(GEOJSON_URL).json();

  assert.equal(data.type, "FeatureCollection");
  assert.equal(data.name, "gis.TRA_BICI_APARCAMIENTO");

  const spots = data.features.map((feat) => {
    assert(feat.type, "feature");
    assert(feat.geometry.type, "point");

    const [lon, lat] = feat.geometry.coordinates;

    let type = feat.properties.tipo;
    if (type === " " || !type) type = null;

    return {
      id: `${lat}:${lon}`,
      coordinate: { lat, lon },
      capacity: feat.properties.numplazas,
      type,
    };
  });

  res.setHeader("Cache-Control", "max-age=86400, stale-while-revalidate");
  res.status(200).json({ spots });
};

export default handler;
