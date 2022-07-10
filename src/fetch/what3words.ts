import { getApi, WHAT3WORDS } from ".";
import { GeoJSON } from "geojson";
import { Coordinate, CoordinateTuple, Line } from "../domain/types";

type GetGridSectionResponseType = { lines: Line[] };

const what3WordsUrl = "https://api.what3words.com/v3/";

/**
 * Call to the what3words api
 * @param param0  // [southwest, northeast]
 * @returns Promise<Line[]>
 */
export const getGridSection = ([sw, ne]: CoordinateTuple) =>
  getApi<GetGridSectionResponseType>(
    what3WordsUrl +
      `grid-section?bounding-box=${sw.lat},${sw.lng},${ne.lat},${ne.lng}&format=json&key=${WHAT3WORDS}`
  ).then((res) => res.lines);

export const getGridGeoJson = ([sw, ne]: CoordinateTuple) =>
  getApi<GeoJSON>(
    what3WordsUrl +
      `grid-section?bounding-box=${sw.lat},${sw.lng},${ne.lat},${ne.lng}&format=geojson&key=${WHAT3WORDS}`
  );

export const getCoordinateWords = ({ lng, lat }: Coordinate) =>
  getApi<any>(
    what3WordsUrl + `convert-to-3wa?coordinates=${lat},${lng}&key=${WHAT3WORDS}`
  ).then((res) => {});
