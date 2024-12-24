import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState } from "../../core/types";
import { LicenseClass } from "./types";
import toast from "react-hot-toast";

export const getLicenseClasses = createAsyncThunk(
  "getLicenseClasses",
  async () => {
    const response = await getRequest("/license-classes");
    return response.data;
  }
);

export const getLicenseClassesWithPagination = createAsyncThunk(
  "getLicenseClassesWithPagination",
  async (params: any) => {
    const response = await getRequest("/license-classes", params);
    return response.data;
  }
);

export const deleteLicenseClass = createAsyncThunk(
  "deleteLicenseClass",
  async(id: number | string) => {
    try {
      await deleteRequest(`/license-classes/${id}`);
      toast.success(`Cliense class deleted successfully`);
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete cliense class. Please try again!`
      );
    }
  }
)

export const createLicenseClass = createAsyncThunk(
  "createLicenseClass",
  async (data: any) => {
    try {
      await postRequest("/license-classes", data);
      toast.success(`License class created successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new license class. Please try again!`
      );
      throw error;
    }
  }
);

export const updateLicenseClass = createAsyncThunk(
  "updateLicenseClass",
  async (data: any) => {
    try {
      await putRequest(`/license-classes`, data);
      toast.success(`License Class updated successfully!`);
      return data;
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update license class. Please try again!`
      );
      throw error;
    }
  }
);

export const getLicenseById = createAsyncThunk(
  "getLicenseById",
  async (id: number) => {
    const response = await getRequest(`/license-classes/${id}`);
    return response.data;
  }
);

export interface LicenseClassState extends GenericState {
  licenseClasses: LicenseClass[];
  count: number;
  licenseClassesWithPagination: LicenseClass[];
  getStatus: string;
}

const initialState: LicenseClassState = {
  licenseClasses: [],
  count: 0,
  licenseClassesWithPagination: [],
  listStatus: "idle",
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
  getStatus: "idle",
};

export const licenseClassSlice = createSlice({
  name: "licenseClass",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLicenseClasses.pending, (state) => {
      state.listStatus = "pending";
    });
    builder.addCase(getLicenseClasses.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.licenseClasses = action.payload.records;
    });
    builder.addCase(getLicenseClasses.rejected, (state) => {
      state.listStatus = "failed";
    });

    // getLicenseClassesWithPagination
    builder.addCase(getLicenseClassesWithPagination.pending, (state) => {
      state.getStatus = "pending";
    });
    builder.addCase(getLicenseClassesWithPagination.fulfilled, (state, action) => {
      state.getStatus = "succeeded";
      state.licenseClassesWithPagination = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getLicenseClassesWithPagination.rejected, (state) => {
      state.getStatus = "failed";
    });

    // add License Class
    builder.addCase(createLicenseClass.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createLicenseClass.fulfilled, (state, action) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createLicenseClass.rejected, (state) => {
      state.createStatus = "failed";
    });

    // update License Class
    builder.addCase(updateLicenseClass.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateLicenseClass.fulfilled, (state, action) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateLicenseClass.rejected, (state) => {
      state.updateStatus = "failed";
    });

    // get detail licese class
    builder.addCase(getLicenseById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getLicenseById.fulfilled, (state, action) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getLicenseById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

    // delete license class
    builder.addCase(deleteLicenseClass.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteLicenseClass.fulfilled, (state, action) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteLicenseClass.rejected, (state) => {
      state.deleteStatus = "failed";
    });
  },
});

export default licenseClassSlice.reducer;
