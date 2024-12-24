import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api";
import { GenericState } from "../../core/types";
import {DriverMileage} from "./type";

export const getDriverMileages = createAsyncThunk("driver-mileage", async (params: any) => {
  const response = await getRequest("/driver-mileage", params);
  return response.data;
});

export interface DriverMileageState extends GenericState {
  driverMileages: DriverMileage[];
  count: number;
}

const initialState: DriverMileageState = {
  driverMileages: [],
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
    builder.addCase(getDriverMileages.pending, (state) => {
      state.listStatus = "pending";
      state.driverMileages = [];
      state.count = 0;
    });
    builder.addCase(getDriverMileages.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.driverMileages = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getDriverMileages.rejected, (state) => {
      state.listStatus = "failed";
    });
  },
});

export default BocTripSlice.reducer;
