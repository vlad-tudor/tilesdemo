import { useMemo, useState } from "react";
import { createDivOverlayComponent } from "@react-leaflet/core";
import {
  MapContainer,
  TileLayer,
  Rectangle,
  SVGOverlay,
  useMapEvents,
} from "react-leaflet";

import {
  CoordinateTuple,
  gridDestructure,
  latLngToCoordinate,
  linesToCoordinatePairs,
  linesToCoordinates,
} from "../../domain/lib/util";
import { Coordinate } from "../../domain/types";
import { mockData } from "../../mocks";
import L, { Map } from "leaflet";
import { getGridSection } from "../../fetch/what3words";

const MapLeaflet = () => {
  const coordinates = linesToCoordinates(gridDestructure(mockData.lines));
  const [center, setCenter] = useState<Coordinate>(coordinates[0]);
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
        center={center}
        scrollWheelZoom={true}
        zoom={19}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={21}
          maxNativeZoom={19}
        />
        <RenderTiles />
      </MapContainer>
    </div>
  );
};

type RenderTilesProps = {
  zoom: number;
};

const RenderTiles = () => {
  const roundTolerance = 5;
  const [tiles, setTiles] = useState<CoordinateTuple[]>([]);
  const [tile, setTile] = useState<string>("");

  const mapBounds = (map: L.Map) => {
    var ne = map.getBounds().getNorthEast();
    var sw = map.getBounds().getSouthWest();
    if (map.getZoom() > 18)
      getGridSection([latLngToCoordinate(sw), latLngToCoordinate(ne)]).then(
        (lines) => setTiles(linesToCoordinatePairs(gridDestructure(lines)))
      );
  };

  // handlers
  const map = useMapEvents({
    moveend() {
      mapBounds(map);
    },
  });

  const innerHandlers = useMemo(
    () => ({
      click(e: any) {
        let { lat, lng } = e.sourceTarget._bounds._southWest;
        const key = `${lat.toFixed(roundTolerance)}${lng.toFixed(
          roundTolerance
        )}`;
        console.log(key);
        setTile(key);
      },
    }),
    [map]
  );

  return (
    <>
      {tiles.map(
        ([{ lat: swLat, lng: swLng }, { lat: neLat, lng: neLng }], index) => {
          const key = `${swLat.toFixed(roundTolerance)}${swLng.toFixed(
            roundTolerance
          )}`;
          if (index === 0) console.log(key);
          return (
            <Rectangle
              eventHandlers={innerHandlers}
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

const RenderSvgs = ({ tiles }: { tiles: CoordinateTuple[] }) =>
  tiles.map(
    ([{ lat: swLat, lng: swLng }, { lat: neLat, lng: neLng }], index) => (
      <SVGOverlay
        key={`svg-${swLat}-${swLng}`}
        attributes={{ stroke: "gray" }}
        bounds={[
          [swLat, swLng],
          [neLat, neLng],
        ]}
      >
        <rect x="0" y="0" width="100%" height="100%" fill="none" />
      </SVGOverlay>
    )
  );

export default MapLeaflet;
