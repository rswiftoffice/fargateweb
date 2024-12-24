import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteRequest, getRequest, postRequest, putRequest } from "api";
import { GenericState } from "core/types";
import toast from "react-hot-toast";
import { BaseAdmin } from "./type";

export const getBaseAdmins = createAsyncThunk(
  "getBaseAdmins",
  async (params: any) => {
    const response = await getRequest("/baseAdmins", params);
    return response.data;
  }
);

export const deleteBaseAdmin = createAsyncThunk(
  "deleteBaseAdmin",
  async (id: number | string) => {
    try {
      await deleteRequest(`/baseAdmins/${id}`);
      toast.success("Base Admin deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete Base Admin. Please try again!`
      );
    }
  }
);

export const createBaseAdmin = createAsyncThunk(
  "createBaseAdmin",
  async (data: any) => {
    try {
      await postRequest("/baseAdmins", data);
      toast.success(`Base Admin created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new Base Admin. Please try again!`
      );
      throw error;
    }
  }
);

export const getBaseAdminById = createAsyncThunk(
  "getBaseAdminById",
  async (id: number) => {
    const response = await getRequest(`/baseAdmins/${id}`);
    return response.data;
  }
);

export const updateBaseAdmin = createAsyncThunk(
  "updateBaseAdmin",
  async (service: any) => {
    try {
      await putRequest(`/baseAdmins`, service);
      toast.success(`Base Admin updated successfully!`);
      return service;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update Base Admin. Please try again!`
      );
      throw error;
    }
  }
);

export interface BaseAdminState extends GenericState {
  list: BaseAdmin[];
  count: number;
}

const initialState: BaseAdminState = {
  list: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const baseAdminSlice = createSlice({
  name: "subUnitAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBaseAdmins.pending, (state) => {
      state.listStatus = "pending";
      state.list = [];
      state.count = 0;
    });
    builder.addCase(getBaseAdmins.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.list = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getBaseAdmins.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteBaseAdmin.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteBaseAdmin.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteBaseAdmin.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(createBaseAdmin.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createBaseAdmin.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createBaseAdmin.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(getBaseAdminById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getBaseAdminById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getBaseAdminById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

    builder.addCase(updateBaseAdmin.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateBaseAdmin.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateBaseAdmin.rejected, (state) => {
      state.updateStatus = "failed";
    });
  },
});

export default baseAdminSlice.reducer;
