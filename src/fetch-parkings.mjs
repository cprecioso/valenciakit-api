// @ts-check

import got from "got";
import assert from "node:assert/strict";

const DATASET_URL =
  "https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/aparcaments-bicicletes-aparcamientos-bicicletas";
const GEOJSON_URL =
  "https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/aparcaments-bicicletes-aparcamientos-bicicletas/exports/geojson";

export const getModifiedDateString = async () => {
  const data = await got(DATASET_URL).json();

  const modified = data?.metas?.default?.modified;
  if (modified) return modified;
};

export const fetchParkings = async () => {
  const dataResponse = await got(GEOJSON_URL, { responseType: "json" });

  const updatedAtString =
    dataResponse.headers["last-modified"] || (await getModifiedDateString());
  const updatedAt = updatedAtString ? new Date(updatedAtString) : new Date(0);

  /** @type {import("../types/geojson-response").GeoJSONResponse} */
  const data = dataResponse.body;

  assert.equal(data.type, "FeatureCollection");

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
