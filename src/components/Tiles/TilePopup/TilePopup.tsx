import { Button } from "@mui/material";
import { Compact } from "@uiw/react-color";
import React from "react";
import { useAppDispatch } from "../../../domain/hooks";
import { AugemntedTile, TileData } from "../../../domain/types";
import { addOrSetTileData, removeTile } from "../../../redux/tileDataSimpler";
import { ResetButton } from "../../Misc/ResetButton/ResetButton";
import What3wordsAddress from "../../Misc/What3WordsAddress/What3WordsAddress";

type TilePopupProps = {
  tile: Required<AugemntedTile>;
};

const TilePopup = ({ tile }: TilePopupProps) => {
  const {
    data: { address },
  } = tile;
  const dispatch = useAppDispatch();
  const updateTileData = (newData: TileData) =>
    dispatch(addOrSetTileData({ ...tile, data: newData }));

  const onTileReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeTile(tile));
  };

  return (
    <div>
      <What3wordsAddress address={address} />
      <Compact
        style={{ background: "none" }} //
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onChange={(color) => {
          updateTileData({ address, color: color.hex });
        }}
      />
      <ResetButton thingToReset="tile" onClick={onTileReset} light />
    </div>
  );
};

export default TilePopup;
