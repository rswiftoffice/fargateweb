import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState } from "../../core/types";
import { ServiceAdmin } from "./type";

export interface ServiceAdminState extends GenericState {
  list: ServiceAdmin[];
  count: number;
}

const initialState: ServiceAdminState = {
  list: [],
  listStatus: "idle",
  count: 0,
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const getServiceAdmins = createAsyncThunk(
  "getServiceAdmins",
  async (params: any = {}) => {
    const response = await getRequest("/serviceAdmins", params);
    return response.data;
  }
);

export const deleteServiceAdmin = createAsyncThunk(
  "deleteServiceAdmin",
  async (id: number | string) => {
    try {
      await deleteRequest(`/serviceAdmins/${id}`);
      toast.success("Service Admin deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete Service Admin. Please try again!`
      );
    }
  }
);

export const createServiceAdmin = createAsyncThunk(
  "createServiceAdmin",
  async (data: any) => {
    try {
      await postRequest("/serviceAdmins", data);
      toast.success(`Service Admin created successfully!`);
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new Service Admin. Please try again!`
      );
      throw error;
    }
  }
);

export const updateServiceAdmin = createAsyncThunk(
  "updateServiceAdmin",
  async (data: any) => {
    try {
      await putRequest(`/serviceAdmins`, data);
      toast.success(`Service Admin updated successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update Service Admin. Please try again!`
      );
      throw error;
    }
  }
);

export const getServiceAdminById = createAsyncThunk(
  "getServiceAdminById",
  async (id: number) => {
    const response = await getRequest(`/serviceAdmins/${id}`);
    return response.data;
  }
);

export const serviceAdminSlice = createSlice({
  name: "serviceAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServiceAdmins.pending, (state) => {
      state.listStatus = "pending";
      state.list = [];
      state.count = 0;
    });
    builder.addCase(getServiceAdmins.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.list = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getServiceAdmins.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteServiceAdmin.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteServiceAdmin.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteServiceAdmin.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(createServiceAdmin.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createServiceAdmin.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createServiceAdmin.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(getServiceAdminById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getServiceAdminById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getServiceAdminById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

    builder.addCase(updateServiceAdmin.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateServiceAdmin.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateServiceAdmin.rejected, (state) => {
      state.updateStatus = "failed";
    });
  },
});

export default serviceAdminSlice.reducer;
