import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState, RequestStatus } from "../../core/types";
import { Base } from "./type";

export const getBases = createAsyncThunk("getBases", async (params: any) => {
  const response = await getRequest("/base", params);
  return response.data;
});

export const deleteBase = createAsyncThunk(
  "deleteBase",
  async (id: number | string) => {
    try {
      await deleteRequest(`/base/${id}`);
      toast.success("Base deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete Base. Please try again!`
      );
    }
  }
);

export const createBase = createAsyncThunk(
  "createBase",
  async (data: { name: string; description: string; commandId: number }) => {
    try {
      await postRequest("/base", data);
      toast.success(`Base created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new Base. Please try again!`
      );
      throw error;
    }
  }
);

export const updateBase = createAsyncThunk(
  "updateBase",
  async (service: any) => {
    try {
      await putRequest(`/base`, service);
      toast.success(`Base updated successfully!`);
      return service;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update Base. Please try again!`
      );
      throw error;
    }
  }
);

export const getBaseById = createAsyncThunk(
  "getBaseById",
  async (id: number) => {
    const response = await getRequest(`/base/${id}`);
    return response.data;
  }
);

export const transferBase = createAsyncThunk("transfer", async (data: any) => {
  try {
    await putRequest("/base/transfer", data);
    toast.success(`Base has been transferred and deleted!`);
  } catch (error: any) {
    toast.error(error.response.data.message || `Failed to transfer base!`);
  }
});

export interface BaseState extends GenericState {
  bases: Base[];
  count: number;
  transferStatus: RequestStatus;
}

const initialState: BaseState = {
  bases: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  transferStatus: "idle",
};

export const baseSlice = createSlice({
  name: "base",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBases.pending, (state) => {
      state.listStatus = "pending";
      state.bases = [];
      state.count = 0;
    });
    builder.addCase(getBases.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.bases = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getBases.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteBase.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteBase.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteBase.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(createBase.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createBase.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createBase.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(updateBase.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateBase.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateBase.rejected, (state) => {
      state.updateStatus = "failed";
    });

    builder.addCase(getBaseById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getBaseById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getBaseById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

    builder.addCase(transferBase.pending, (state) => {
      state.transferStatus = "pending";
    });
    builder.addCase(transferBase.fulfilled, (state) => {
      state.transferStatus = "succeeded";
    });
    builder.addCase(transferBase.rejected, (state) => {
      state.transferStatus = "failed";
    });
  },
});

export default baseSlice.reducer;
