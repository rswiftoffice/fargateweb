import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../../api";
import { GenericState } from "../../core/types";
import {MtracForm} from "./type";

export const getMtracForms = createAsyncThunk('mtrac-form', async (params: any) => {
  const response = await getRequest("/mtrac-form", params);
  return response.data;
});

export interface MtracFormState extends GenericState {
  mtracForms: MtracForm[];
  count: number;
}

const initialState: MtracFormState = {
  mtracForms: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const MtracFormSlice = createSlice({
  name: "BocTrip",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMtracForms.pending, (state) => {
      state.listStatus = "pending";
      state.mtracForms = [];
      state.count = 0;
    });
    builder.addCase(getMtracForms.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.mtracForms = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getMtracForms.rejected, (state) => {
      state.listStatus = "failed";
    });
  },
});

export default MtracFormSlice.reducer;
