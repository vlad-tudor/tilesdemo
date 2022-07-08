import React, { useEffect, useState } from "react";
import MapLeaflet from "./components/Map/MapLeaflet";

const globes = ["🌎", "🌏", "🌍"];

function App() {
  const [globeIndex, setGlobe] = useState(0);
  useEffect(() => {
    let interval: NodeJS.Timer | null = setInterval(() => {
      setGlobe((g) => (g + 1) % globes.length);
    }, 300);
    return () => {
      interval = null;
    };
  }, []);
  return (
    <div>
      <br />
      <div style={{ margin: "auto", width: "1rem" }}>{globes[globeIndex]}</div>
      <MapLeaflet />
    </div>
  );
}

export default React.memo(App);
