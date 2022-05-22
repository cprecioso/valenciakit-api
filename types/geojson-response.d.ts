export interface GeoJSONResponse {
  type: "FeatureCollection";
  name: "gis.TRA_BICI_APARCAMIENTO";
  features: Feature[];
}

export interface Feature {
  type: "feature";
  geometry: GeometryPoint;
  properties: Properties;
}

export interface GeometryPoint {
  type: "point";
  coordinates: [lon: number, lat: number];
}

export interface Properties {
  tipo: string;
  numplazas: number;
}
