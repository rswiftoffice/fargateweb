import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest } from "../../api";
import { GenericState } from "../../core/types";
import { MTBroadcast } from "./types";

export const getMtBroadCastList = createAsyncThunk(
  "getMtBroadCastList",
    async (params: any) => {
      const response = await getRequest("/admin/mt-broadcast", params);
      return response.data;
    }
  );

export const createMtBroadCast = createAsyncThunk(
  "createMtBroadCast",
  async (data: any) => {
    try {
      await postRequest("/admin/mt-broadcast", data);
      toast.success(`MT broadcast created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new MT broadcast. Please try again!`
      );
      throw error;
    }
  }
);

export const deleteMTBroadcast = createAsyncThunk(
  "deleteMTBroadcast",
  async(id: number | string) => {
    try {
      await deleteRequest(`/admin/mt-broadcast/${id}`);
      toast.success(`MT Broadcast deleted successfully`);
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete MT Broadcast. Please try again!`
      );
    }
  }
)

export interface MTBroadcastState extends GenericState {
  listMTBroadcast: MTBroadcast[];
  count: number;
}

const initialState: MTBroadcastState = {
  listMTBroadcast: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const mtBroadcastSlice = createSlice({
  name: "mtBroadcastSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMtBroadCastList.pending, (state) => {
      state.listStatus = "pending";
    });
    builder.addCase(getMtBroadCastList.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.listMTBroadcast = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getMtBroadCastList.rejected, (state) => {
      state.listStatus = "failed";
    });

    // add MT Broadcast
    builder.addCase(createMtBroadCast.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createMtBroadCast.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createMtBroadCast.rejected, (state) => {
      state.createStatus = "failed";
    });

    // delete MT Broadcast
    builder.addCase(deleteMTBroadcast.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteMTBroadcast.fulfilled, (state, action) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteMTBroadcast.rejected, (state) => {
      state.deleteStatus = "failed";
    });
  },
});

export default mtBroadcastSlice.reducer;