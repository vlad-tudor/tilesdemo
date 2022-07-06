import React from "react";
import MapLeaflet from "./components/Map/MapLeaflet";

function App() {
  return (
    <div>
      <MapLeaflet />
    </div>
  );
}

export default React.memo(App);
