import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api";
import { GenericState } from "../../core/types";
import {ElogBook} from "./type";

export const getElogBooks = createAsyncThunk("elog-book", async (params: any) => {
  const response = await getRequest("/elog-book", params);
  return response.data;
});

export interface ElogBookState extends GenericState {
    eLogBooks: ElogBook[];
    count: number;
}

const initialState: ElogBookState = {
  eLogBooks: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const ElogBookSlice = createSlice({
  name: "ElogBook",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getElogBooks.pending, (state) => {
      state.listStatus = "pending";
      state.eLogBooks = [];
      state.count = 0;
    });
    builder.addCase(getElogBooks.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.eLogBooks = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getElogBooks.rejected, (state) => {
      state.listStatus = "failed";
    });
  },
});

export default ElogBookSlice.reducer;
