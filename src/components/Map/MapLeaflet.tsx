import { Button } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
import { useAppDispatch, useAppSelector } from "../../domain/hooks";
import { removeAllTiles } from "../../redux/tileDataSimpler";
import TilesSimpler from "../Tiles/TileSimpler";

const MapLeaflet = () => {
  // these constants are very dependent on the map provider, and what they're supporting.
  // that's why I'm leaving them here.
  // Maybe these would be enums/props/provided by whatever backend alongside with the map props perhaps
  const zoom = 19; // dependant on tile provider
  const maxZoom = 21; // levels which may just enlargest higherst res photo available

  const { center } = useAppSelector((state) => state.tileDataSimplerReducer);

  const dispatch = useAppDispatch();
  const clearMap = () => dispatch(removeAllTiles());

  return (
    <>
      <div
        // move to separate styles file
        // yean I know it's ugly
        style={{
          width: "380px",
          border: "0.2rem solid black",
          margin: "auto",
          marginTop: "2rem",
          marginBottom: "2rem",
          borderRadius: "1rem",
          overflow: "hidden",
        }}
      >
        <MapContainer
          style={{
            height: "660px",
            width: "370x",
          }}
          center={center}
          scrollWheelZoom={true}
          zoom={zoom} // zoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={maxZoom} // max zoom
            maxNativeZoom={zoom} // zoom
          />
          {/* <Tiles zoom={zoom} /> */}
          <TilesSimpler zoom={zoom} />
        </MapContainer>
      </div>
      <div style={{ margin: "auto", width: "8rem" }}>
        <Button onClick={clearMap} variant="contained" color="error">
          Reset Grid
        </Button>
      </div>
    </>
  );
};

export default MapLeaflet;
