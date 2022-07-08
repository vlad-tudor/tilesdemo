import { MapContainer, TileLayer } from "react-leaflet";
import { secretCoordinates1 } from "../../domain/lib/enums";
import Tiles from "../Tiles/Tiles";

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

export default MapLeaflet;
