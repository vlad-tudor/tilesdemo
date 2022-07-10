import { getApi, WHAT3WORDS } from ".";
import { GeoJSON } from "geojson";
import {
  AugemntedTile,
  CoordinateTuple,
  Coordinate,
  Line,
} from "../domain/types";
import { LatLng } from "leaflet";
import { generateCoordinateKey } from "../domain/lib/util";

type GetGridSectionResponseType = { lines: Line[] };

type GetGidGeoJsonResponseType = {
  country: string; // "GB"
  square: {
    southwest: {
      lng: -0.195543;
      lat: 51.520833;
    };
    northeast: {
      lng: -0.195499;
      lat: 51.52086;
    };
  };
  nearestPlace: string; // "Bayswater, London";
  coordinates: LatLng; //{  lng: -0.195521,  lat: 51.520847}

  words: string; // "filled.count.soap"
  language: string; //"en";
  map: string; //"https://w3w.co/filled.count.soap";
};

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

export const getNewTile = ({ lng, lat }: Coordinate) =>
  getApi<GetGidGeoJsonResponseType>(
    what3WordsUrl + `convert-to-3wa?coordinates=${lat},${lng}&key=${WHAT3WORDS}`
  ).then(({ square: { southwest, northeast }, words }) => {
    const coordinates: CoordinateTuple = [southwest, northeast];
    const tile: Required<AugemntedTile> = {
      key: generateCoordinateKey(southwest),
      coordinates,
      data: {
        address: words,
        color: "rgba(255,0,0,0.5)",
      },
    };
    return tile;
  });
