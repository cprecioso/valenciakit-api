// @ts-check

import got from "got";
import assert from "node:assert/strict";

const GEOJSON_URL =
  "https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/aparcaments-bicicletes-aparcamientos-bicicletas/exports/geojson?lang=es&timezone=Europe%2FBerlin";

export const fetchParkings = async () => {
  const dataResponse = await got(GEOJSON_URL);

  const lastModifiedHeader = dataResponse.headers["last-modified"];
  const updatedAt = lastModifiedHeader
    ? new Date(lastModifiedHeader)
    : new Date(0);

  /** @type {import("../types/geojson-response").GeoJSONResponse} */
  const data = JSON.parse(dataResponse.body);

  assert.equal(data.type, "FeatureCollection");
  assert(
    data.name === "gis.TRA_BICI_APARCAMIENTO" ||
      data.name === "TRA_BICI_APARCAMIENTO"
  );

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

  const response = JSON.stringify({ updatedAt, spots });

  return { updatedAt, response };
};
