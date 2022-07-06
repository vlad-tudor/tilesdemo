import { getApi, WHAT3WORDS } from ".";
import { CoordinateTuple, Line } from "../domain/types";

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
