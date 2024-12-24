import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api";
import { GenericState } from "../../core/types";
import {VehicleServicing} from "./type";

export const getVehicleServicing = createAsyncThunk("vehicle-servicing", async (params: any) => {
  const response = await getRequest("/vehicle-servicing", params);
  return response.data;
});

export interface VehicleServicingState extends GenericState {
  vehicleServicing: VehicleServicing[];
  count: number;
}

const initialState: VehicleServicingState = {
  vehicleServicing: [],
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
    builder.addCase(getVehicleServicing.pending, (state) => {
      state.listStatus = "pending";
      state.vehicleServicing = [];
      state.count = 0;
    });
    builder.addCase(getVehicleServicing.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.vehicleServicing = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getVehicleServicing.rejected, (state) => {
      state.listStatus = "failed";
    });
  },
});

export default BocTripSlice.reducer;
