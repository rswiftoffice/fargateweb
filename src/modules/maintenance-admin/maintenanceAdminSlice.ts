import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState } from "../../core/types";
import { MaintenanceAdmin } from "./type";

const entity = "Maintenance Admin";
const moduleApiPath = "/maintenance-admins";

export const getMaintenanceAdmins = createAsyncThunk(
  "getMaintenanceAdmins",
  async (params: any) => {
    const response = await getRequest(`${moduleApiPath}`, params);
    return response.data;
  }
);

export const deleteMaintenanceAdmin = createAsyncThunk(
  "deleteMaintenanceAdmin",
  async (id: number | string) => {
    try {
      await deleteRequest(`${moduleApiPath}/${id}`);
      toast.success(`${entity} deleted successfully`);
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete ${entity}. Please try again!`
      );
    }
  }
);

export const createMaintenanceAdmin = createAsyncThunk(
  "createMaintenanceAdmin",
  async (data: any) => {
    try {
      await postRequest(`${moduleApiPath}`, data);
      toast.success(`${entity} created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new ${entity}. Please try again!`
      );
      throw error;
    }
  }
);

export const updateMaintenanceAdmin = createAsyncThunk(
  "updateMaintenanceAdmin",
  async (service: any) => {
    try {
      await putRequest(`${moduleApiPath}`, service);
      toast.success(`${entity} updated successfully!`);
      return service;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update ${entity}. Please try again!`
      );
      throw error;
    }
  }
);

export const getMaintenanceAdminById = createAsyncThunk(
  "getMaintenanceAdminById",
  async (id: number) => {
    const response = await getRequest(`${moduleApiPath}/${id}`);
    return response.data;
  }
);

export interface MaintenanceAdminState extends GenericState {
  list: MaintenanceAdmin[];
  count: number;
}

const initialState: MaintenanceAdminState = {
  list: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const maintenanceAdminSlice = createSlice({
  name: "maintenanceAdminSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMaintenanceAdmins.pending, (state) => {
      state.listStatus = "pending";
    });
    builder.addCase(getMaintenanceAdmins.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.list = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getMaintenanceAdmins.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteMaintenanceAdmin.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteMaintenanceAdmin.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteMaintenanceAdmin.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(createMaintenanceAdmin.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createMaintenanceAdmin.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createMaintenanceAdmin.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(updateMaintenanceAdmin.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateMaintenanceAdmin.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateMaintenanceAdmin.rejected, (state) => {
      state.updateStatus = "failed";
    });

    builder.addCase(getMaintenanceAdminById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getMaintenanceAdminById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getMaintenanceAdminById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });
  },
});

export default maintenanceAdminSlice.reducer;
