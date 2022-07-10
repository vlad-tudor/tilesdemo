import { useEffect, useState } from "react";
import { Popup, Rectangle, useMapEvents } from "react-leaflet";
import { defaultGeoJson, getMapBoundsGeoJson } from "./util";
import { GeoJSON } from "geojson";
import { GeoJSON as GeoJsonDisplay } from "react-leaflet";
import { getNewTile } from "../../fetch/what3words";
import { useAppDispatch, useAppSelector } from "../../domain/hooks";
import { AugemntedTile, TileData } from "../../domain/types";
import { addOrSetTileData, removeTile } from "../../redux/tileDataSimpler";
import { Compact } from "@uiw/react-color";
import { Button } from "@mui/material";
import _ from "lodash";

type TilesSimplerProps = {
  zoom: number;
};

const TilesSimpler = ({ zoom }: TilesSimplerProps) => {
  const { tiles } = useAppSelector((state) => state.tileDataSimplerReducer);
  const dispatch = useAppDispatch();
  const updateTileData = (tile: Required<AugemntedTile>) =>
    dispatch(addOrSetTileData(tile));

  const [pending, setPending] = useState(false);
  const [grid, setGrid] = useState<GeoJSON>({ ...defaultGeoJson });

  const getMap = _.debounce(() => {
    getMapBoundsGeoJson(map, zoom).then((geoJson) => {
      setGrid(geoJson);
    });
  }, 500);

  const map = useMapEvents({
    move() {
      getMap();
    },
    click({ latlng }) {
      const { lat, lng } = latlng;
      getNewTile({
        lat,
        lng,
      }).then((tile) => {
        updateTileData(tile);
      });
    },
  });

  useEffect(() => {
    getMap();
  }, []);
  return (
    <>
      <GeoJsonDisplay
        key={`grid-${JSON.stringify(grid)}}`}
        data={grid}
        style={{ weight: 1, color: "rgba(0,0,0,0.2)" }}
      />
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
            <Popup
              autoClose
              autoPan={false}
              //keepInView={true}
              closeOnClick
            >
              <TilePopup tile={tile} />
            </Popup>
          </Rectangle>
        );
      })}
    </>
  );
};

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
          ///
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
      <Button
        color="error"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dispatch(removeTile(tile));
        }}
      >
        Reset
      </Button>
    </div>
  );
};

export default TilesSimpler;
