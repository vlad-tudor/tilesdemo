import { MapContainer, TileLayer } from "react-leaflet";
import { secretCoordinates1 } from "../../domain/lib/enums";
import Tiles from "../Tiles/Tiles";

const MapLeaflet = () => {
  // these constants are very dependent on the map provider, and what they're supporting.
  // that's why I'm leaving them here.
  // Maybe these would be enums/props/provided by whatever backend alongside with the map props perhaps

  const zoom = 19; // dependant on tile provider
  const maxZoom = 21; // levels which may just enlargest higherst res photo available

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
        zoom={zoom} // zoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={maxZoom} // max zoom
          maxNativeZoom={zoom} // zoom
        />
        <Tiles zoom={zoom} />
      </MapContainer>
    </div>
  );
};

export default MapLeaflet;
