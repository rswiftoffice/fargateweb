import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState, RequestStatus } from "../../core/types";
import { Vehicle } from "./type";

const entity = "Vehicle";

export const getVehicles = createAsyncThunk(
  "getVehicles",
  async (params: any) => {
    const response = await getRequest("/admin/vehicles", params);
    return response.data;
  }
);

export const deleteVehicle = createAsyncThunk(
  "deleteVehicle",
  async (id: number | string) => {
    try {
      await deleteRequest(`/admin/vehicles/${id}`);
      toast.success(`${entity} deleted successfully`);
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete ${entity}. Please try again!`
      );
    }
  }
);

export const createVehicle = createAsyncThunk(
  "createVehicle",
  async (data: any) => {
    try {
      await postRequest("/admin/vehicles", data);
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

export const updateVehicle = createAsyncThunk(
  "updateVehicle",
  async (service: any) => {
    try {
      await putRequest(`/admin/vehicles`, service);
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

export const getVehicleById = createAsyncThunk(
  "getVehicleById",
  async (id: number) => {
    const response = await getRequest(`/admin/vehicles/${id}`);
    return response.data;
  }
);

export const makeVehicalAvailable = createAsyncThunk(
  "updateVehicle",
  async (service: any) => {
    try {
      let data = await putRequest(`/admin/vehicles/makeAvailable`, service);
      toast.success(`${entity} updated successfully!`);
      return  data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update ${entity}. Please try again!`
      );
      throw error;
    }
  }
);


export interface VehicleState extends GenericState {
  list: Vehicle[];
  count: number;
  transferStatus: RequestStatus;
}

const initialState: VehicleState = {
  list: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  makeVehicalAvailable: 'idle',
  transferStatus: "idle",
};

export const vehicleSlice = createSlice({
  name: "vehiclePlatformSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getVehicles.pending, (state) => {
      state.listStatus = "pending";
    });
    builder.addCase(getVehicles.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.list = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getVehicles.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteVehicle.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteVehicle.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteVehicle.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(createVehicle.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createVehicle.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createVehicle.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(updateVehicle.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateVehicle.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateVehicle.rejected, (state) => {
      state.updateStatus = "failed";
    });

    builder.addCase(getVehicleById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getVehicleById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getVehicleById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

  },
});

export default vehicleSlice.reducer;
