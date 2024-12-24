import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api";
import { GenericState } from "../../core/types";
import {CheckIn} from "./type";

export const getCheckIn = createAsyncThunk("check-in", async (params: any) => {
  const response = await getRequest("/check-in", params);
  return response.data;
});

export interface DriverMileageState extends GenericState {
  checkIn: CheckIn[];
  count: number;
}

const initialState: DriverMileageState = {
  checkIn: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const CheckInSlice = createSlice({
  name: "BocTrip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCheckIn.pending, (state) => {
      state.listStatus = "pending";
      state.checkIn = [];
      state.count = 0;
    });
    builder.addCase(getCheckIn.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.checkIn = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getCheckIn.rejected, (state) => {
      state.listStatus = "failed";
    });
  },
});

export default CheckInSlice.reducer;
