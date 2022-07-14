// inspired by  https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/
// and here https://dev.to/dqunbp/using-mapbox-gl-in-react-with-next-js-2glg

// maybe this can live somepalce else
import mapboxgl, { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { secretCoordinates1 } from "../../domain/lib/enums";
import { MAPBOX } from "../../fetch";

mapboxgl.accessToken = MAPBOX;

const MapBox = () => {
  // very much an exercise of making it stop complaining
  // I have no idea why I have to go down this crazy road
  // this is just making the linter stop, I have no idea if this is the right approach.
  // whatever
  const mapContainer = useRef<HTMLDivElement>(new HTMLDivElement());
  const map = useRef<Map | null>();
  const [lng, setLng] = useState(secretCoordinates1.lat);
  const [lat, setLat] = useState(secretCoordinates1.lng);
  const [zoom, setZoom] = useState(19);

  useEffect(() => {
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: zoom,
      });
    }
  }, []);

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default MapBox;
