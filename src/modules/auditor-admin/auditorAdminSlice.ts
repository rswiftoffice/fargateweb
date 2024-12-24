import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState } from "../../core/types";
import { AuditorAdmin } from "./type";

const entity = "Auditor Admin";

export const getAuditorAdmins = createAsyncThunk(
  "getAuditorAdmins",
  async (params: any) => {
    const response = await getRequest("/auditorAdmins", params);
    return response.data;
  }
);

export const deleteAuditorAdmin = createAsyncThunk(
  "deleteAuditorAdmin",
  async (id: number | string) => {
    try {
      await deleteRequest(`/auditorAdmins/${id}`);
      toast.success(`${entity} deleted successfully`);
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete ${entity}. Please try again!`
      );
    }
  }
);

export const createAuditorAdmin = createAsyncThunk(
  "createAuditorAdmin",
  async (data: any) => {
    try {
      await postRequest("/auditorAdmins", data);
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

export const updateAuditorAdmin = createAsyncThunk(
  "updateAuditorAdmin",
  async (service: any) => {
    try {
      await putRequest(`/auditorAdmins`, service);
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

export const getAuditorAdminById = createAsyncThunk(
  "getAuditorAdminById",
  async (id: number) => {
    const response = await getRequest(`/auditorAdmins/${id}`);
    return response.data;
  }
);

export interface AuditorAdminState extends GenericState {
  list: AuditorAdmin[];
  count: number;
}

const initialState: AuditorAdminState = {
  list: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const auditorAdminSlice = createSlice({
  name: "auditorAdminSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAuditorAdmins.pending, (state) => {
      state.listStatus = "pending";
    });
    builder.addCase(getAuditorAdmins.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.list = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getAuditorAdmins.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteAuditorAdmin.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteAuditorAdmin.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteAuditorAdmin.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(createAuditorAdmin.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createAuditorAdmin.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createAuditorAdmin.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(updateAuditorAdmin.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateAuditorAdmin.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateAuditorAdmin.rejected, (state) => {
      state.updateStatus = "failed";
    });

    builder.addCase(getAuditorAdminById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getAuditorAdminById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getAuditorAdminById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });
  },
});

export default auditorAdminSlice.reducer;
