import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState, RequestStatus } from "../../core/types";
import { Service } from "./type";

export interface ServiceState extends GenericState {
  list: Service[];
  count: number;
  transferStatus: RequestStatus;
}

const initialState: ServiceState = {
  list: [],
  listStatus: "idle",
  count: 0,
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  transferStatus: "idle",
};

export const getServices = createAsyncThunk(
  "getServices",
  async (params: any = {}) => {
    const response = await getRequest("/services", params);
    return response.data;
  }
);

export const deleteService = createAsyncThunk(
  "deleteService",
  async (id: number | string) => {
    try {
      await deleteRequest(`/services/${id}`);
      toast.success("Service deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete Service. Please try again!`
      );
    }
  }
);

export const createService = createAsyncThunk(
  "createService",
  async (data: any) => {
    try {
      await postRequest("/services", data);
      toast.success(`Service created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new Service. Please try again!`
      );
      throw error;
    }
  }
);

export const updateService = createAsyncThunk(
  "updateService",
  async (service: Service) => {
    try {
      await putRequest(`/services`, service);
      toast.success(`Service updated successfully!`);
      return service;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update Service. Please try again!`
      );
      throw error;
    }
  }
);

export const getServiceById = createAsyncThunk(
  "getServiceById",
  async (id: number) => {
    const response = await getRequest(`/services/${id}`);
    return response.data;
  }
);

export const transferService = createAsyncThunk(
  "transferService",
  async (data: any) => {
    try {
      await putRequest("/services/transfer", data);
      toast.success(`Service has been transferred and deleted!`);
    } catch (error: any) {
      toast.error(error.response.data.message || `Failed to transfer service!`);
    }
  }
);

export const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServices.pending, (state) => {
      state.listStatus = "pending";
      state.list = [];
      state.count = 0;
    });
    builder.addCase(getServices.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.list = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getServices.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteService.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteService.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteService.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(transferService.pending, (state) => {
      state.transferStatus = "pending";
    });
    builder.addCase(transferService.fulfilled, (state) => {
      state.transferStatus = "succeeded";
    });
    builder.addCase(transferService.rejected, (state) => {
      state.transferStatus = "failed";
    });

    builder.addCase(createService.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createService.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createService.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(getServiceById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getServiceById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getServiceById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

    builder.addCase(updateService.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateService.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateService.rejected, (state) => {
      state.updateStatus = "failed";
    });
  },
});

export default serviceSlice.reducer;
