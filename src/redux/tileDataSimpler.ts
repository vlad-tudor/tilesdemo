import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { AugemntedTile, TileAugment } from "../domain/types";

type TileDataSimplerState = {
  tiles: Required<AugemntedTile>[];
};

const initialState: TileDataSimplerState = {
  tiles: [],
};

const tileDataSimplerSlice = createSlice({
  name: "tileDataSimpler",
  initialState,
  reducers: {
    removeAllTiles: () => ({ ...initialState }),
    addOrSetTileData: (
      state,
      {
        payload: { key, data, coordinates },
      }: PayloadAction<Required<AugemntedTile>>
    ) => {
      const tiles = state.tiles.slice();
      const [tile, rest] = _.partition(tiles, (p) => p.key === key);

      const newTile = !!tile[0]
        ? { ...tile[0], data: { ...data } }
        : { key: key, coordinates, data: { ...data } };
      return {
        ...state,
        tiles: [newTile, ...rest],
      };
    },

    removeTile: (
      state,
      { payload: { key } }: PayloadAction<{ key: TileAugment["key"] }>
    ) =>
      // I cannot stress enough the sheer lack of performance concerns
      ({
        ...state,
        tiles: state.tiles.filter((t) => t.key !== key),
      }),
  },
});

export const {
  reducer: tileDataSimplerReducer,
  actions: { removeAllTiles, removeTile, addOrSetTileData },
} = tileDataSimplerSlice;
