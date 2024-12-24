import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState, RequestStatus } from "../../core/types";
import { SubUnit } from "./types";

export const getSubUnits = createAsyncThunk(
  "getSubUnits",
  async (params: any) => {
    const response = await getRequest("/subUnits", params);
    return response.data;
  }
);

export const deleteSubunit = createAsyncThunk(
  "deleteSubunit",
  async (id: number | string) => {
    try {
      await deleteRequest(`/subUnits/${id}`);
      toast.success("SubUnit deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete SubUnit. Please try again!`
      );
    }
  }
);

export const transferSubunit = createAsyncThunk(
  "transferSubunit",
  async (data: any) => {
    try {
      await putRequest("/subUnits/transfer", data);
      toast.success(`SubUnit has been transferred and deleted!`);
    } catch (error: any) {
      toast.error(error.response.data.message || `Failed to transfer SubUnit!`);
    }
  }
);

export const getSubunitById = createAsyncThunk(
  "getSubunitById",
  async (id: number) => {
    const response = await getRequest(`/subUnits/${id}`);
    return response.data;
  }
);

export const createSubunit = createAsyncThunk(
  "createSubunit",
  async (data: any) => {
    try {
      await postRequest("/subUnits", data);
      toast.success(`SubUnit created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new SubUnit. Please try again!`
      );
      throw error;
    }
  }
);

export const updateSubunit = createAsyncThunk(
  "updateSubunit",
  async (data: any) => {
    try {
      await putRequest(`/subUnits/${data.id}`, {
        name: data.name,
        description: data.description,
        baseId: data.baseId,
      });
      toast.success(`SubUnit updated successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update SubUnit. Please try again!`
      );
      throw error;
    }
  }
);

export interface SubUnitState extends GenericState {
  subUnits: SubUnit[];
  count: number;
  transferStatus: RequestStatus;
}

const initialState: SubUnitState = {
  subUnits: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  transferStatus: "idle",
};

export const subUnitSlice = createSlice({
  name: "subUnit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubUnits.pending, (state) => {
      state.listStatus = "pending";
    });
    builder.addCase(getSubUnits.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.subUnits = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getSubUnits.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteSubunit.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteSubunit.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteSubunit.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(transferSubunit.pending, (state) => {
      state.transferStatus = "pending";
    });
    builder.addCase(transferSubunit.fulfilled, (state) => {
      state.transferStatus = "succeeded";
    });
    builder.addCase(transferSubunit.rejected, (state) => {
      state.transferStatus = "failed";
    });

    builder.addCase(getSubunitById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getSubunitById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getSubunitById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

    builder.addCase(createSubunit.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createSubunit.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createSubunit.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(updateSubunit.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateSubunit.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateSubunit.rejected, (state) => {
      state.updateStatus = "failed";
    });
  },
});

export default subUnitSlice.reducer;
