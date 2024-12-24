import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState } from "../../core/types";
import { VehiclePlatform } from "./types";

const entity = "Vehicle";

export const getVehiclePlatforms = createAsyncThunk(
  "getVehiclePlatforms",
  async (params: any) => {
    const response = await getRequest("vehicle-platforms", params);
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

export const deleteVehiclePlatform = createAsyncThunk(
  "deleteVehiclePlatform",
  async (id: number | string) => {
    try {
      await deleteRequest(`/vehicle-platforms/${id}`);
      toast.success(`Vehicles platform deleted successfully`);
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete vehicle platform. Please try again!`
      );
    }
  }
);

export const getVehiclePlatformById = createAsyncThunk(
  "getVehiclePlatformById",
  async (id: number) => {
    const response = await getRequest(`/vehicle-platforms/${id}`);
    return response.data;
  }
);



export const createVehiclesPlatform = createAsyncThunk(
  "createVehiclesPlatform",
  async (data: any) => {
    try {
      await postRequest("/vehicle-platforms", data);
      toast.success(`Vehicles platform created successfully!`);
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

export const updateVehiclesPlatform = createAsyncThunk(
  "updateVehiclesPlatform",
  async (data: any) => {
    try {
      await putRequest(`/vehicle-platforms`, data);
      toast.success(`Vehicles platform updated successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update vehicles platform. Please try again!`
      );
      throw error;
    }
  }
);



export interface VehiclePlatformState extends GenericState {
  list: VehiclePlatform[];
  count: number;
  // Vehicle platform
  addPlatformStatus: string;
  deletePlatformStatus: string;
  detailPlatformStatus: string;
  updatePlatformStatus: string;
}

const initialState: VehiclePlatformState = {
  list: [],
  count: 0,
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  // Vehicle platform
  addPlatformStatus: 'idle',
  deletePlatformStatus: 'idle',
  detailPlatformStatus: 'idle',
  updatePlatformStatus: 'idle',
};

export const vehiclePlatformSlice = createSlice({
  name: "vehiclePlatformSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getVehiclePlatforms.pending, (state) => {
      state.listStatus = "pending";
    });
    builder.addCase(getVehiclePlatforms.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.list = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getVehiclePlatforms.rejected, (state) => {
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

    // createVehiclesPlatform
    builder.addCase(createVehiclesPlatform.pending, (state) => {
      state.addPlatformStatus = "pending";
    });
    builder.addCase(createVehiclesPlatform.fulfilled, (state) => {
      state.addPlatformStatus = "succeeded";
    });
    builder.addCase(createVehiclesPlatform.rejected, (state) => {
      state.addPlatformStatus = "failed";
    });

    // delete Vehicles platform
    builder.addCase(deleteVehiclePlatform.pending, (state) => {
      state.deletePlatformStatus = "pending";
    });
    builder.addCase(deleteVehiclePlatform.fulfilled, (state) => {
      state.deletePlatformStatus = "succeeded";
    });
    builder.addCase(deleteVehiclePlatform.rejected, (state) => {
      state.deletePlatformStatus = "failed";
    });
    
    // update VehiclesPlatform
    builder.addCase(updateVehiclesPlatform.pending, (state) => {
      state.updatePlatformStatus = "pending";
    });
    builder.addCase(updateVehiclesPlatform.fulfilled, (state) => {
      state.updatePlatformStatus = "succeeded";
    });
    builder.addCase(updateVehiclesPlatform.rejected, (state) => {
      state.updatePlatformStatus = "failed";
    });
  },
});

export default vehiclePlatformSlice.reducer;
