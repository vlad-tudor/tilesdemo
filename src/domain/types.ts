import { GeoJSONProps } from "react-leaflet";

export type GeoJson = GeoJSONProps["data"];

export type Coordinate = {
  lng: number;
  lat: number;
};

export type DestructuredGrid = [Line[], Line[]];

export type CoordinateTuple = [Coordinate, Coordinate];

export type Line = {
  start: Coordinate;
  end: Coordinate;
};

export type Grid = { lines: Line[] };

export type TileData = {
  color: string;
  address: string;
};

export type TileAugment = {
  key: string;
  data?: TileData;
};

export type AugemntedTile = TileAugment & {
  coordinates: CoordinateTuple;
};
