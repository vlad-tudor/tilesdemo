import React from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLEMAPS } from "../../fetch";
import { mockGeoData } from "../../mocks";
const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: 51.531266793287784,
  lng: -0.2835367607769496,
};

const MapGoogle = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLEMAPS,
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    map.data.addGeoJson(mockGeoData);
    map.data.setStyle({
      visible: (map.getZoom() || 3) > 17,
      strokeColor: "#777",
      strokeWeight: 0.5,
      clickable: false,
    });
    setMap(map);
  }, []);

  const onUnmount = React.useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(MapGoogle);
