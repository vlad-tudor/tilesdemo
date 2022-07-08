import {
  AugemntedTile,
  Coordinate,
  CoordinateTuple,
  DestructuredGrid,
  Line,
  TileAugment,
} from "../types";
import { Feature, GeoJSON } from "geojson";
import { LatLng } from "leaflet";
import { MagicValues } from "./enums";

/**
 * // NEED TO ADD SORTING
 * organises lines into vertical and horizontal lines
 * @param lines
 * @returns [ verticalLines[], horizontalLines[]]
 */
export const organiseLines = (lines: Line[]): DestructuredGrid => {
  const [verticalLines, horizontalLines]: DestructuredGrid = [[], []];
  for (let line of lines) {
    const { start, end } = line;
    if (start.lat === end.lat) {
      horizontalLines.push(line);
    } else if (start.lng === end.lng) {
      verticalLines.push(line);
    }
  }
  return [verticalLines, horizontalLines];
};

/**
 * NOT USED
 * @param [ vericalLine[], horizontalLine[]]
 * @returns Coodinate[]
 */
const linesToCoordinates = ([
  verticalLines,
  horizontalLines,
]: DestructuredGrid): Coordinate[] => {
  const coordinates: Coordinate[] = [];
  for (let hline of horizontalLines) {
    for (let vline of verticalLines) {
      coordinates.push({ lat: hline.start.lat, lng: vline.start.lng });
    }
  }

  return coordinates;
};

/**
 * Returns NW and NE points of a tile given a set of intersecting lines
 * Assumes ordered lines.
 * WARNING: a shape like this ( # ) would return a single square because only one square is formed.
 * @param [ vericalLine[], horizontalLine[]]
 * @returns CoordinateTuple[]
 *
 */
export const linesToCoordinatePairs = ([
  verticalLines,
  horizontalLines,
]: DestructuredGrid): CoordinateTuple[] => {
  const coordinates: CoordinateTuple[] = [];
  for (let hlineIndx = 0; hlineIndx < horizontalLines.length - 1; hlineIndx++) {
    for (let vlineIndx = 0; vlineIndx < verticalLines.length - 1; vlineIndx++) {
      const [swLat, swlng] = [
        horizontalLines[hlineIndx].start.lat,
        verticalLines[vlineIndx].start.lng,
      ];
      const [neLat, nelng] = [
        horizontalLines[hlineIndx + 1].start.lat,
        verticalLines[vlineIndx + 1].start.lng,
      ];
      coordinates.push([
        { lat: swLat, lng: swlng },
        { lat: neLat, lng: nelng },
      ]);
    }
  }

  return coordinates;
};

/**
 * NOT USED
 * @param coordinates processed lat/lng coordinates
 * @returns Feature array for GeoJson composition
 */
const coodinatesToGetJsonPoints = (coordinates: Coordinate[]): Feature[] =>
  coordinates.map((coor) => ({
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: [coor.lat, coor.lng],
    },
  }));

// NOT USED
const linesToGeoJson = (lines: Line[]): GeoJSON => ({
  type: "FeatureCollection",
  features: coodinatesToGetJsonPoints(linesToCoordinates(organiseLines(lines))),
});

/**
 *
 * @param param0
 * @returns Coordinate
 */
export const latLngToCoordinate = ({ lat, lng }: LatLng): Coordinate => ({
  lat,
  lng,
});

/**
 * Use this to get a unique ke from a coordinate
 *
 * ALWAYS use southWest coordinates from the tiles.
 * @param southWest Coordinate
 * @returns
 */
export const generateCoordinateKey = ({ lat, lng }: Coordinate) =>
  `${lat.toFixed(MagicValues.ROUNDTO)}${lng.toFixed(MagicValues.ROUNDTO)}`;

/**
 * Augemnts tiles with extra data .
 *
 * This is quite inneficient.
 * Ideally you'd want to manage spacial data with an appropriate data structure.
 * Like quad trees or a hilbert curve.
 *
 * But hey, it's a demo and you probably won't read this :)
 * @param tiles
 * @param data
 * @returns
 */
export const augmetTiles = (
  tiles: CoordinateTuple[],
  tileData: TileAugment[]
): AugemntedTile[] => {
  const newTiles: AugemntedTile[] = tiles.map(([southWest, northEast]) => {
    const key = generateCoordinateKey(southWest);
    const data = tileData.find((dt) => dt.key === key)?.data;
    return {
      key,
      coordinates: [southWest, northEast],
      data,
    };
  });
  return newTiles;
};
