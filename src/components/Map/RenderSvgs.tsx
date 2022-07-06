import { SVGOverlay } from "react-leaflet";
import { CoordinateTuple } from "../../domain/lib/util";

export const RenderSvgs = ({ tiles }: { tiles: CoordinateTuple[] }) =>
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
