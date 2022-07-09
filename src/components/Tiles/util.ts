import {
  latLngToCoordinate,
  linesToCoordinatePairs,
  organiseLines,
} from "../../domain/lib/util";
import { CoordinateTuple } from "../../domain/types";
import { getGridSection } from "../../fetch/what3words";

export const getMapBounds = async (map: L.Map, zoom: number) => {
  var ne = map.getBounds().getNorthEast();
  var sw = map.getBounds().getSouthWest();
  if (map.getZoom() >= zoom) {
    return getGridSection([
      latLngToCoordinate(sw),
      latLngToCoordinate(ne),
    ]).then((lines) => linesToCoordinatePairs(organiseLines(lines)));
  } else {
    return new Promise<CoordinateTuple[]>(() => {}).then(() => []);
  }
};
