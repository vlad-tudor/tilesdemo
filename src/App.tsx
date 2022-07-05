
import React from "react";
import { mockData } from "./mocks";
import SelectableGrid from "./components/SelectableGrid/SelectableGrid";
import { gridDestructure } from "./domain/lib/util";
import MapGoogle from "./components/Map/MapGoogle";
import MapLeaflet from "./components/Map/MapLeaflet";

function App() {
  const grid = gridDestructure(mockData.lines);

  return (
    <div>
      {/*<MapGoogle />*/}
      <MapLeaflet />
      {/*<SelectableGrid grid={grid} />*/}
    </div>
  );
}


export default React.memo(App);

