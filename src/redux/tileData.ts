import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { TileAugment } from "../domain/types";

type TileDataState = {
  extraTileData: TileAugment[];
};

const initialState: TileDataState = {
  extraTileData: [],
};

const tileDataSlice = createSlice({
  name: "tileData",
  initialState,

  // I like my reducers to have returns since it bundles up state assignment
  reducers: {
    reset: () => initialState,
    setTileData: (
      state,
      { payload: { key, data } }: PayloadAction<TileAugment>
    ) => {
      // absolutely no performance concerns whatsoever, sorry
      const [tile, rest] = _.partition(
        state.extraTileData,
        (p) => p.key === key
      );

      const newTile = !!tile[0] ? { ...tile[0], data } : { key, data };
      return { ...state, extraTileData: [newTile, ...rest] };
    },
    resetTile: (
      state,
      { payload: { key } }: PayloadAction<{ key: TileAugment["key"] }>
    ) =>
      // I cannot stress enough the sheer lack of performance concerns
      ({
        ...state,
        extraTileData: state.extraTileData.filter((t) => t.key !== key),
      }),
  },
});

export const {
  reducer: tileDataReducer,
  actions: { reset: tileDataReset, setTileData },
} = tileDataSlice;
