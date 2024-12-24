import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteRequest, getRequest, postRequest, putRequest } from "api";
import { GenericState } from "core/types";
import toast from "react-hot-toast";
import { SubUnitAdmin } from "./type";

export const getSubUnitAdmins = createAsyncThunk(
  "getSubUnitAdmins",
  async (params: any) => {
    const response = await getRequest("/subUnitAdmins", params);
    return response.data;
  }
);

export const deleteSubUnitAdmin = createAsyncThunk(
  "deleteSubUnitAdmin",
  async (id: number | string) => {
    try {
      await deleteRequest(`/subUnitAdmins/${id}`);
      toast.success("SubUnit Admin deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete SubUnit Admin. Please try again!`
      );
    }
  }
);

export const createSubUnitAdmin = createAsyncThunk(
  "createSubUnitAdmin",
  async (data: any) => {
    try {
      await postRequest("/subUnitAdmins", data);
      toast.success(`SubUnit Admin created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new SubUnit Admin. Please try again!`
      );
      throw error;
    }
  }
);

export const getSubUnitAdminById = createAsyncThunk(
  "getSubUnitAdminById",
  async (id: number) => {
    const response = await getRequest(`/subUnitAdmins/${id}`);
    return response.data;
  }
);

export const updateSubUnitAdmin = createAsyncThunk(
  "updateSubUnitAdmin",
  async (service: any) => {
    try {
      await putRequest(`/subUnitAdmins`, service);
      toast.success(`SubUnit Admin updated successfully!`);
      return service;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update SubUnit Admin. Please try again!`
      );
      throw error;
    }
  }
);

export interface SubUnitAdminState extends GenericState {
  list: SubUnitAdmin[];
  count: number;
}

const initialState: SubUnitAdminState = {
  list: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const subUnitAdminSlice = createSlice({
  name: "subUnitAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSubUnitAdmins.pending, (state) => {
      state.listStatus = "pending";
      state.list = [];
      state.count = 0;
    });
    builder.addCase(getSubUnitAdmins.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.list = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getSubUnitAdmins.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteSubUnitAdmin.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteSubUnitAdmin.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteSubUnitAdmin.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(createSubUnitAdmin.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createSubUnitAdmin.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createSubUnitAdmin.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(getSubUnitAdminById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getSubUnitAdminById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getSubUnitAdminById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

    builder.addCase(updateSubUnitAdmin.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateSubUnitAdmin.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateSubUnitAdmin.rejected, (state) => {
      state.updateStatus = "failed";
    });
  },
});

export default subUnitAdminSlice.reducer;
