import { useEffect, useState } from "react";
import { Rectangle, useMapEvents, Popup } from "react-leaflet";
import { augmentTiles } from "../../domain/lib/util";
import {
  AugemntedTile,
  CoordinateTuple,
  TileAugment,
  TileData,
} from "../../domain/types";
import { useAppDispatch, useAppSelector } from "../../domain/hooks";
import { setTileData } from "../../redux/tileData";
import { Compact } from "@uiw/react-color";
import { getMapBounds } from "./util";

type TilesProps = {
  zoom: number;
};

const Tiles = ({ zoom }: TilesProps) => {
  const { extraTileData } = useAppSelector((state) => state.tileDataReducer);
  const [tiles, setTiles] = useState<CoordinateTuple[]>([]);
  const [augmentedTiles, setAugemntedtiles] = useState<AugemntedTile[]>([]);

  const getMap = () =>
    getMapBounds(map, zoom).then((tiles) => {
      setTiles(tiles);
      setAugemntedtiles(augmentTiles(tiles, extraTileData));
    });

  const map = useMapEvents({
    moveend() {
      getMap();
    },
  });

  useEffect(() => {
    getMap();
  }, [getMapBounds, map]);

  useEffect(() => {
    setAugemntedtiles(augmentTiles(tiles, extraTileData));
  }, [extraTileData]);

  return (
    <>
      {augmentedTiles.map(
        (
          {
            data,
            key,
            coordinates: [
              { lat: swLat, lng: swLng },
              { lat: neLat, lng: neLng },
            ],
          },
          index
        ) => {
          return (
            <Rectangle
              key={key + index}
              stroke
              bounds={[
                [swLat, swLng],
                [neLat, neLng],
              ]}
              pathOptions={{ color: data?.color || "gray", weight: 1 }}
            >
              <Popup autoPan={false} keepInView={true} closeOnClick>
                <TilePopup tileAugment={{ key, data }} />
              </Popup>
            </Rectangle>
          );
        }
      )}
    </>
  );
};

type TilePopupProps = {
  tileAugment: TileAugment;
};

const TilePopup = ({ tileAugment: { key, data } }: TilePopupProps) => {
  const dispatch = useAppDispatch();
  const updateTileData = (newData: TileData) =>
    dispatch(setTileData({ key, data: newData }));

  return (
    <div>
      <Compact
        onChange={(color) => {
          updateTileData({ address: data?.address || "", color: color.hex });
        }}
      />
    </div>
  );
};

export default Tiles;
