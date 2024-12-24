import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, putRequest } from "../../api";
import { GenericState } from "../../core/types";
import { Bos } from "./types";

export const getListBos = createAsyncThunk(
  "getListBos",
  async (params: any) => {
    const response = await getRequest("/bos-aos-pol", params);
    return response.data;
  }
);

export const getBosInfoById = createAsyncThunk(
  "getBosInfoById",
  async (id: number) => {
    const response = await getRequest(`/bos-aos-pol/${id}`);
    return response.data;
  }
);

export const updateBosInfo = createAsyncThunk(
  "updateBosInfo",
  async (data: any) => {
    try {
      await putRequest(`/bos-aos-pol/${data.id}`, data);
      toast.success(`BOS/AOS/POL/DI/AHS updated successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update BOS/AOS/POL/DI/AHS. Please try again!`
      );
      throw error;
    }
  }
);

export const deleteBos = createAsyncThunk("deleteBos", async (data: any) => {
  try {
    await deleteRequest(`/bos-aos-pol/${data.id}`);
    toast.success(`BOS/AOS/POL/DI/AHS deleted successfully!`);
  } catch (error: any) {
    toast.error(
      error.response.data.message ||
        `Unable to update BOS/AOS/POL/DI/AHS. Please try again!`
    );
    throw error;
  }
});

export interface BosState extends GenericState {
  listBosTrip: Bos[];
  count: number;
}

const initialState: BosState = {
  listBosTrip: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const bosSlice = createSlice({
  name: "bosSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getListBos.pending, (state) => {
      state.listStatus = "pending";
    });
    builder.addCase(getListBos.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.listBosTrip = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getListBos.rejected, (state) => {
      state.listStatus = "failed";
    });

    // update Bos
    builder.addCase(updateBosInfo.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateBosInfo.fulfilled, (state, action) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateBosInfo.rejected, (state) => {
      state.updateStatus = "failed";
    });

    // delete Bos
    builder.addCase(deleteBos.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteBos.fulfilled, (state, action) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteBos.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    // get status MT Broadcast
    builder.addCase(getBosInfoById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getBosInfoById.fulfilled, (state, action) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getBosInfoById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });
  },
});

export default bosSlice.reducer;