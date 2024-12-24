import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api";
import { GenericState } from "../../core/types";
import {CheckOut} from "./type";

export const getCheckOut = createAsyncThunk("check-out", async (params: any) => {
  const response = await getRequest("/check-out", params);
  return response.data;
});

export interface DriverMileageState extends GenericState {
  checkOut: CheckOut[];
  count: number;
}

const initialState: DriverMileageState = {
  checkOut: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const CheckOutSlice = createSlice({
  name: "BocTrip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCheckOut.pending, (state) => {
      state.listStatus = "pending";
      state.checkOut = [];
      state.count = 0;
    });
    builder.addCase(getCheckOut.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.checkOut = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getCheckOut.rejected, (state) => {
      state.listStatus = "failed";
    });
  },
});

export default CheckOutSlice.reducer;
