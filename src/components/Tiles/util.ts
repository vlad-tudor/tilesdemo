import {
  latLngToCoordinate,
  linesToCoordinatePairs,
  organiseLines,
} from "../../domain/lib/util";
import { CoordinateTuple } from "../../domain/types";
import { getGridGeoJson, getGridSection } from "../../fetch/what3words";
import { GeoJSON } from "geojson";

export const defaultGeoJson: GeoJSON = {
  type: "FeatureCollection",
  features: [],
};

export const getMapBounds = async (map: L.Map, zoom: number) => {
  var ne = map.getBounds().getNorthEast();
  var sw = map.getBounds().getSouthWest();
  if (map.getZoom() >= zoom) {
    return getGridSection([
      latLngToCoordinate(sw),
      latLngToCoordinate(ne),
    ]).then((lines) => linesToCoordinatePairs(organiseLines(lines)));
  } else {
    return new Promise<CoordinateTuple[]>((res) => {
      res([] as CoordinateTuple[]);
    });
  }
};

export const getMapBoundsGeoJson = async (map: L.Map, zoom: number) => {
  var ne = map.getBounds().getNorthEast();
  var sw = map.getBounds().getSouthWest();
  if (map.getZoom() >= zoom) {
    return getGridGeoJson([latLngToCoordinate(sw), latLngToCoordinate(ne)]);
  } else {
    return new Promise<GeoJSON>((res) => {
      res({ ...defaultGeoJson } as GeoJSON);
    });
  }
};
