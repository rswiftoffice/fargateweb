import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api";
import { GenericState } from "../../core/types";
import {BocTrip} from "./type";

export const getBocTrips = createAsyncThunk("boc-trip", async (params: any) => {
  const response = await getRequest("/boc-trip", params);
  return response.data;
});

export interface BocTripState extends GenericState {
  bocTrips: BocTrip[];
    count: number;
}

const initialState: BocTripState = {
  bocTrips: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const BocTripSlice = createSlice({
  name: "BocTrip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBocTrips.pending, (state) => {
      state.listStatus = "pending";
      state.bocTrips = [];
      state.count = 0;
    });
    builder.addCase(getBocTrips.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.bocTrips = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getBocTrips.rejected, (state) => {
      state.listStatus = "failed";
    });
  },
});

export default BocTripSlice.reducer;
