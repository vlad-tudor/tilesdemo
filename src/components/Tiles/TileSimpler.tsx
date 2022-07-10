import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { defaultGeoJson, getMapBoundsGeoJson } from "./util";
import { GeoJSON } from "geojson";
import { GeoJSON as GeoJsonDisplay } from "react-leaflet";
import { getCoordinateWords } from "../../fetch/what3words";
import { useAppDispatch, useAppSelector } from "../../domain/hooks";
import { AugemntedTile } from "../../domain/types";
import { addOrSetTileData } from "../../redux/tileDataSimpler";

type TilesSimplerProps = {
  zoom: number;
};

const TilesSimpler = ({ zoom }: TilesSimplerProps) => {
  const { tiles } = useAppSelector((state) => state.tileDataSimplerReducer);
  const dispatch = useAppDispatch();
  const updateTileData = (tile: Required<AugemntedTile>) =>
    dispatch(addOrSetTileData(tile));

  const [grid, setGrid] = useState<GeoJSON>({ ...defaultGeoJson });
  const getMap = () =>
    getMapBoundsGeoJson(map, zoom).then((geoJson) => {
      setGrid(geoJson);
    });

  const map = useMapEvents({
    moveend() {
      getMap();
    },
  });
  return (
    <>
      <GeoJsonDisplay
        key={`grid-${JSON.stringify(grid)}}`}
        eventHandlers={{
          click(lme) {
            const { lat, lng } = lme.latlng;
            getCoordinateWords({
              lat,
              lng,
            });
          },
        }}
        data={grid}
        style={{ weight: 1, color: "rgba(0,0,0,0.2)" }}
      />
    </>
  );
};

export default TilesSimpler;
