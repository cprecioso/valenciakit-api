import type { GeoJSON } from "geojson";
import ky from "ky";
import assert from "node:assert/strict";

const DATASET_URL =
  "https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/aparcaments-bicicletes-aparcamientos-bicicletas";
const GEOJSON_URL =
  "https://valencia.opendatasoft.com/api/explore/v2.1/catalog/datasets/aparcaments-bicicletes-aparcamientos-bicicletas/exports/geojson";

export const getModifiedDateString = async () => {
  const data = await ky(DATASET_URL).json<
    { metas?: { default?: { modified?: string } } } | undefined
  >();

  const modified = data?.metas?.default?.modified;
  if (modified) return modified;
};

const assertType: <Value extends { type: string }, Type extends Value["type"]>(
  value: Value,
  type: Type,
) => asserts value is Value & { type: Type } = (value, type) =>
  assert(value.type.toLowerCase() === type.toLowerCase());

export const fetchParkings = async () => {
  const dataResponse = await ky(GEOJSON_URL, {
    headers: { Accept: "application/json" },
  });

  const updatedAtString =
    dataResponse.headers.get("Last-Modified") ||
    (await getModifiedDateString());
  const updatedAt = updatedAtString ? new Date(updatedAtString) : new Date(0);

  const data = await dataResponse.json<GeoJSON>();
  assertType(data, "FeatureCollection");

  const spots = data.features.map((feat) => {
    assertType(feat, "Feature");
    assertType(feat.geometry, "Point");

    const { numplazas, tipo } = feat.properties as {
      numplazas?: number;
      tipo?: string;
    };
    const [longitude, latitude] = feat.geometry.coordinates;

    const type = tipo && tipo !== " " ? tipo : null;

    return {
      id: `${latitude}:${longitude}`,
      coordinate: { latitude, longitude },
      capacity: numplazas,
      type,
    };
  });

  const response = JSON.stringify({ updatedAt, spots });

  return { updatedAt, response };
};
