import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Popup, Rectangle, useMapEvents } from "react-leaflet";
import { defaultGeoJson, getMapBoundsGeoJson } from "./util";
import { GeoJSON } from "geojson";
import { GeoJSON as GeoJsonDisplay } from "react-leaflet";
import { getNewTile } from "../../fetch/what3words";
import { useAppDispatch, useAppSelector } from "../../domain/hooks";
import { AugemntedTile, Coordinate, TileData } from "../../domain/types";
import {
  addOrSetTileData,
  removeTile,
  setCenter,
} from "../../redux/tileDataSimpler";
import { Compact } from "@uiw/react-color";
import { Button } from "@mui/material";

type TilesSimplerProps = {
  zoom: number;
};

const TilesSimpler = ({ zoom }: TilesSimplerProps) => {
  const { tiles } = useAppSelector((state) => state.tileDataSimplerReducer);
  const dispatch = useAppDispatch();
  const updateTileData = (tile: Required<AugemntedTile>) =>
    dispatch(addOrSetTileData(tile));

  const [grid, setGrid] = useState<GeoJSON>({ ...defaultGeoJson });

  // map events
  const map = useMapEvents({
    moveend() {
      const { lat, lng } = map.getCenter();
      dispatch(setCenter({ lat, lng }));
    },
    move() {
      getMap();
    },
    click({ latlng: { lat, lng } }) {
      getTile({ lat, lng });
    },
  });

  const getMap = useMemo(
    () =>
      _.debounce(() => {
        getMapBoundsGeoJson(map, zoom).then((geoJson) => {
          setGrid(geoJson);
        });
      }, 500),
    [map, zoom, setGrid]
  );

  const getTile = _.debounce(({ lat, lng }: Coordinate) => {
    if (map.getZoom() >= zoom) {
      getNewTile({
        lat,
        lng,
      }).then((tile) => {
        updateTileData(tile);
      });
    }
  }, 200);

  useEffect(() => {
    getMap();
  }, [getMap]);

  return (
    <>
      <GeoJsonDisplay
        key={`grid-${JSON.stringify(grid)}}`}
        data={grid}
        style={{ weight: 1, color: "rgba(0,0,0,0.2)" }}
      />
      <RenderRectangles tiles={tiles} />
    </>
  );
};

// maybe move all below crap into a separate file

type RenderRectanglesProps = {
  tiles: Required<AugemntedTile>[];
};

const RenderRectangles = ({ tiles }: RenderRectanglesProps) => (
  <>
    {tiles.map((tile, index) => {
      const {
        data,
        key,
        coordinates: [{ lat: swLat, lng: swLng }, { lat: neLat, lng: neLng }],
      } = tile;
      return (
        <Rectangle
          key={key + index}
          stroke
          bounds={[
            [swLat, swLng],
            [neLat, neLng],
          ]}
          pathOptions={{
            color: data.color,
            weight: 2,
          }}
        >
          <Popup autoClose autoPan={false} closeOnClick>
            <TilePopup tile={tile} />
          </Popup>
        </Rectangle>
      );
    })}
  </>
);
type TilePopupProps = {
  tile: Required<AugemntedTile>;
};

const TilePopup = ({ tile }: TilePopupProps) => {
  const {
    data: { address },
  } = tile;
  const dispatch = useAppDispatch();
  const updateTileData = (newData: TileData) =>
    dispatch(addOrSetTileData({ ...tile, data: newData }));

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: 0 }}>
        <b
          style={{ color: "red", marginLeft: "0.5rem", marginRight: "0.2rem" }}
        >
          {"///"}
        </b>
        <b>{address}</b>
      </h3>
      <Compact
        style={{ background: "none" }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onChange={(color) => {
          updateTileData({ address, color: color.hex });
        }}
      />
      <div style={{ margin: "auto", width: "4rem" }}>
        <Button
          color="error"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(removeTile(tile));
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TilesSimpler;
