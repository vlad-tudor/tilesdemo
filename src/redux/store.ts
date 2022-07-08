import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { tileDataReducer } from "./tileData";

const reducer = combineReducers({ tileDataReducer });

// some persister config & reducer override in the future
export const store = configureStore({
  reducer,
  // some redux persist crap here for later
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
