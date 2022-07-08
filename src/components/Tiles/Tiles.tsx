import { useCallback, useEffect, useState } from "react";
import L from "leaflet";
import { Rectangle, useMapEvents, Popup } from "react-leaflet";
import {
  organiseLines,
  latLngToCoordinate,
  linesToCoordinatePairs,
  generateCoordinateKey,
} from "../../domain/lib/util";
import { AugemntedTile, CoordinateTuple } from "../../domain/types";
import { getGridSection } from "../../fetch/what3words";

/**
 * bunch of logic managing resources to draw the grid.
 * @returns
 */
const Tiles = () => {
  const [tiles, setTiles] = useState<CoordinateTuple[]>([]);
  const [augmentedTiles, setAugmentedtiles] = useState<AugemntedTile[]>([]);
  const [tile, setTile] = useState<string>("");

  // gets map bounds from the map objects,
  const getMapBounds = useCallback((map: L.Map) => {
    var ne = map.getBounds().getNorthEast();
    var sw = map.getBounds().getSouthWest();
    if (map.getZoom() > 18)
      getGridSection([latLngToCoordinate(sw), latLngToCoordinate(ne)]).then(
        (lines) => {
          setTiles(linesToCoordinatePairs(organiseLines(lines)));
        }
      );
  }, []);

  // handlers
  const map = useMapEvents({
    moveend() {
      getMapBounds(map);
    },
  });

  useEffect(() => {
    getMapBounds(map);
  }, [getMapBounds, map]);

  const innerHandlers = {
    click(e: any) {
      let { lat, lng } = e.sourceTarget._bounds._southWest;
      const key = generateCoordinateKey({ lat, lng });
      setTile(key);
      // add a click to the tile
      // save coords to
    },
  };

  return <TileDraw tile={tile} tiles={tiles} eventHandlers={innerHandlers} />;
};

type FancyTileDrawProps = {
  tile: string;
  tiles: AugemntedTile[];
  eventHandlers: L.LeafletEventHandlerFnMap;
};

// draws the tiles
const FancyTileDraw = ({ tile, tiles, eventHandlers }: FancyTileDrawProps) => {
  // hook in redux? or maybe pass thang down
  return (
    <>
      {tiles.map(
        // some advanced destructing.
        // add data to each tile.

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
          //const key = generateCoordinateKey({ lat: swLat, lng: swLng });
          return (
            // returns a little rectangle bounded by the coordinates
            <Rectangle
              eventHandlers={eventHandlers}
              key={key + index}
              stroke
              bounds={[
                [swLat, swLng],
                [neLat, neLng],
              ]}
              // eventHandlers={innerHandlers}
              pathOptions={
                tile === key ? { color: "red" } : { color: "gray", weight: 1 }
              }
            >
              <Popup>
                <TilePopup />
              </Popup>
            </Rectangle>
          );
        }
      )}
    </>
  );
};

const TilePopup = () => {
  useEffect(() => {}, []);
  return <div>tile :)</div>;
};

/**
 * WILL DEPRFECATE BELOW STUFF
 */
type TileDrawProps = {
  tile: string;
  tiles: CoordinateTuple[];
  eventHandlers: L.LeafletEventHandlerFnMap;
};

// draws the tiles
const TileDraw = ({ tile, tiles, eventHandlers }: TileDrawProps) => {
  return (
    <>
      {tiles.map(
        // some advanced destructing.
        // add data to each tile.

        ([{ lat: swLat, lng: swLng }, { lat: neLat, lng: neLng }], index) => {
          const key = generateCoordinateKey({ lat: swLat, lng: swLng });
          return (
            // returns a little rectangle bounded by the coordinates
            <Rectangle
              eventHandlers={eventHandlers}
              key={key + index}
              stroke
              bounds={[
                [swLat, swLng],
                [neLat, neLng],
              ]}
              // eventHandlers={innerHandlers}
              pathOptions={
                tile === key ? { color: "red" } : { color: "gray", weight: 1 }
              }
            >
              <Popup>Popup for Marker</Popup>
            </Rectangle>
          );
        }
      )}
    </>
  );
};
export default Tiles;
