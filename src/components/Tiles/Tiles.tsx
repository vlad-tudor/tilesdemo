import { useCallback, useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { Rectangle, useMapEvents, Popup } from "react-leaflet";
import {
  augmentTiles,
  organiseLines,
  latLngToCoordinate,
  linesToCoordinatePairs,
  generateCoordinateKey,
} from "../../domain/lib/util";
import {
  AugemntedTile,
  CoordinateTuple,
  TileAugment,
  TileData,
} from "../../domain/types";
import { getGridSection } from "../../fetch/what3words";
import { useAppDispatch, useAppSelector } from "../../domain/hooks";
import { setTileData } from "../../redux/tileData";
import { Github } from "@uiw/react-color";

// Context

// Whole shebang
type TilesProps = {
  zoom: number;
};

const Tiles = ({ zoom }: TilesProps) => {
  const { extraTileData } = useAppSelector((state) => state.tileDataReducer);

  const [tiles, setTiles] = useState<CoordinateTuple[]>([]);
  const [augmentedTiles, setAugemntedtiles] = useState<AugemntedTile[]>([]);
  const [tile, setTile] = useState<string>(""); //redundant

  // gets map bounds from the map objects,
  const getMapBounds = useCallback(
    (map: L.Map) => {
      var ne = map.getBounds().getNorthEast();
      var sw = map.getBounds().getSouthWest();
      if (map.getZoom() >= zoom) {
        getGridSection([latLngToCoordinate(sw), latLngToCoordinate(ne)]).then(
          (lines) => {
            const tiles = linesToCoordinatePairs(organiseLines(lines));
            setTiles(tiles);
            console.log(extraTileData);
            setAugemntedtiles(augmentTiles(tiles, extraTileData));
          }
        );
      } else {
        setTiles([]);
        setAugemntedtiles([]);
      }
    },
    [extraTileData]
  );

  // handlers

  const map = useMapEvents({
    moveend() {
      getMapBounds(map);
    },
  });

  useEffect(() => {
    getMapBounds(map);
  }, [getMapBounds, map]);

  useEffect(() => {
    setAugemntedtiles(augmentTiles(tiles, extraTileData));
  }, [extraTileData]);

  return <FancyTileDraw tile={tile} tiles={augmentedTiles} setTile={setTile} />;
};

type FancyTileDrawProps = {
  tile: string;
  tiles: AugemntedTile[];
  setTile: (s: string) => void;
};

// draws the tiles
const FancyTileDraw = ({ tile, tiles, setTile }: FancyTileDrawProps) => {
  return (
    <>
      {tiles.map(
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
              eventHandlers={{
                click(e: any) {
                  let { lat, lng } = e.sourceTarget._bounds._southWest;
                  const key = generateCoordinateKey({ lat, lng });

                  setTile(key);
                },
              }}
              key={key + index}
              stroke
              bounds={[
                [swLat, swLng],
                [neLat, neLng],
              ]}
              pathOptions={
                tile === key
                  ? { color: "red" }
                  : { color: data?.color || "gray", weight: 1 }
              }
            >
              <Popup autoPan={false} keepInView={true}>
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
      <Github
        onChange={(color) => {
          updateTileData({ address: data?.address || "", color: color.hex });
          console.log(color.hex);
        }}
      />
    </div>
  );
};

export default Tiles;
