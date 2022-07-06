import { useCallback, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  useMapEvents,
} from "react-leaflet";

import {
  organiseLines,
  latLngToCoordinate,
  linesToCoordinatePairs,
  generateCoordinateKey,
} from "../../domain/lib/util";
import { CoordinateTuple } from "../../domain/types";
import L from "leaflet";
import { getGridSection } from "../../fetch/what3words";
import { secretCoordinates1 } from "../../domain/lib/enums";

const MapLeaflet = () => {
  // move
  return (
    <div
      style={{
        width: "380px",
        border: "0.2rem solid black",
        margin: "auto",
        marginTop: "2rem",
      }}
    >
      <MapContainer
        style={{ height: "660px", width: "370x" }}
        center={secretCoordinates1}
        scrollWheelZoom={true}
        zoom={19}
      >
        {/* image tiles, not the generated tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={21}
          maxNativeZoom={19}
        />
        <Tiles />
      </MapContainer>
    </div>
  );
};

/**
 * bunch of logic managing resources to draw the grid.
 * @returns
 */
const Tiles = () => {
  const [tiles, setTiles] = useState<CoordinateTuple[]>([]);
  const [tile, setTile] = useState<string>("");

  // gets map bounds from the map objects,
  const getMapBounds = useCallback((map: L.Map) => {
    var ne = map.getBounds().getNorthEast();
    var sw = map.getBounds().getSouthWest();
    if (map.getZoom() > 18)
      getGridSection([latLngToCoordinate(sw), latLngToCoordinate(ne)]).then(
        (lines) => {
          console.log({ lines });
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
      // save coords to
    },
  };

  return <TileDraw tile={tile} tiles={tiles} eventHandlers={innerHandlers} />;
};

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
            />
          );
        }
      )}
    </>
  );
};

export default MapLeaflet;
