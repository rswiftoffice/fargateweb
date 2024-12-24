import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { getRequest, putRequest } from "../../api";
import { RequestStatus } from "../../core/types";
import { Destination } from "./type";

const entity = "Destination";
const moduleApiPath = "/destinations";

export const getDestinations = createAsyncThunk(
  "getDestinations",
  async (params: any) => {
    const response = await getRequest(`${moduleApiPath}`, params);
    return response.data;
  }
);

export const updateDestination = createAsyncThunk(
  "updateDestination",
  async (data: any) => {
    try {
      await putRequest(`${moduleApiPath}/${data.id}`, data);
      toast.success(`${entity} updated successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update ${entity}. Please try again!`
      );
      throw error;
    }
  }
);

export const getDestinationById = createAsyncThunk(
  "getDestinationById",
  async (id: number) => {
    const response = await getRequest(`${moduleApiPath}/${id}`);
    return response.data;
  }
);

export interface DestinationStore {
  list: Destination[];
  count: number;
  listStatus: RequestStatus;
  getDetailStatus: RequestStatus;
  updateStatus: RequestStatus;
}

const initialState: DestinationStore = {
  list: [],
  count: 0,
  listStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
};

export const destinationSlice = createSlice({
  name: "destinationSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDestinations.pending, (state) => {
      state.listStatus = "pending";
    });
    builder.addCase(getDestinations.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.list = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getDestinations.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(updateDestination.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateDestination.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateDestination.rejected, (state) => {
      state.updateStatus = "failed";
    });

    builder.addCase(getDestinationById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getDestinationById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getDestinationById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });
  },
});

export default destinationSlice.reducer;
