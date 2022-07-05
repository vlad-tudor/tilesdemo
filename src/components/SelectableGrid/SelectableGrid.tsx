import { CSSProperties, useState } from "react";
import { DestructuredGrid } from "../../domain/lib/util";

import Tooltip from "@mui/material/Tooltip";


type SelectableGridProps = {
  grid: DestructuredGrid;
};
const SelectableGrid = ({
  grid: [vertical, horizontal],
}: SelectableGridProps) => {

  const gridMultiplier = 50;

  const [clickedTile, setClickedTile] = useState<number>();

  const gridStyle: CSSProperties = {
    display: "grid",

    width: `${vertical.length * gridMultiplier}px`,
    height: `${horizontal.length * gridMultiplier}px`,
    gridTemplateColumns: `repeat(${vertical.length}, 1fr)`,
    gridTemplateRows: `repeat(${horizontal.length}, 1fr)`,
  };

  const divsEmptyArray = [...Array(vertical.length * horizontal.length)];

  return (
    <div style={{ position: "static" }}>
      <div style={gridStyle}>
        {divsEmptyArray.map((_, index) => {
          // good math to have I think
          const rowModulo = index % horizontal.length;
          const lastRow = (horizontal.length - 1) * vertical.length - 1;

          const rowMarker = rowModulo
            ? rowModulo === horizontal.length - 1
              ? "<"
              : ""
            : ">";
          const colMarker =
            index < horizontal.length ? "v" : index > lastRow ? "^" : "";

          const xCoordinate = horizontal[Math.floor(index / vertical.length)];
          const yCoordinate = vertical[index % vertical.length];
          return (

            <Tooltip
              key={`square-index-${index}`}
              open={clickedTile === index}
              title={
                <div
                  className="selectable-grid-tile-content"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <span>
                    mk :{colMarker}
                    {rowMarker}
                  </span>
                  --
                  <span>in:{index}</span>
                  <span>x(s): {xCoordinate.start.lat}</span>
                  <span>x(e): {xCoordinate.end.lat}</span>
                  --
                  <span>y(s): {yCoordinate.start.lng}</span>
                  <span>y(e): {yCoordinate.end.lng}</span>
                </div>
              }
            >
              <div
                className="selectable-grid-tile"
                onClick={() => {
                  if (clickedTile === index) {
                    setClickedTile(undefined);
                  } else {
                    setClickedTile(index);
                  }
                }}
                style={
                  clickedTile === index
                    ? {
                        backgroundColor: "rgba(13, 152, 186, 0.7)",
                        outline: "5px solid lightgray",
                      }
                    : {}
                }
              >
                <div
                  className="selectable-grid-tile-color"
                  style={{
                    opacity: `${(1 / divsEmptyArray.length) * index}`,
                  }}
                ></div>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default SelectableGrid;
