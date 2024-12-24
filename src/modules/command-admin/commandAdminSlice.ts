import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { deleteRequest, getRequest, postRequest, putRequest } from "../../api";
import { GenericState } from "../../core/types";
import { FetchListRequestParams } from "../../core/types/api";
import { CommandAdmin } from "./type";

export interface CommandAdminState extends GenericState {
  commandAdmins: CommandAdmin[];
  count: number;
}

const initialState: CommandAdminState = {
  commandAdmins: [],
  listStatus: "idle",
  count: 0,
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const fetchCommandAdmins = createAsyncThunk(
  "fetchCommandAdmins",
  async (params: FetchListRequestParams) => {
    const response = await getRequest("/commandAdmins", params);
    return response.data;
  }
);

export const addCommandAdmin = createAsyncThunk(
  "addCommandAdmin",
  async (body: any) => {
    try {
      await postRequest("/commandAdmins", body);
      toast.success("Command Admin added successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to add new Command Admin. Please try again!`
      );
      throw error;
    }
  }
);

export const getCommandAdminById = createAsyncThunk(
  "getCommandAdminById",
  async (id: number | string) => {
    const response = await getRequest(`/commandAdmins/${id}`);
    return response.data;
  }
);

export const updateCommandAdmin = createAsyncThunk(
  "updateCommandAdmin",
  async (data: any) => {
    try {
      await putRequest(`/commandAdmins`, {
        ...data,
      });
      toast.success("Command Admin updated successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to update Command Admin. Please try again!`
      );
    }
  }
);

export const deleteCommandAdmin = createAsyncThunk(
  "deleteCommandAdmin",
  async (id: any) => {
    try {
      await deleteRequest(`/commandAdmins/${id}`);
      toast.success("Command Admin deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete Command Admin. Please try again!`
      );
    }
  }
);

export const commandAdminSlice = createSlice({
  name: "commandAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCommandAdmins.pending, (state) => {
      state.listStatus = "pending";
      state.commandAdmins = [];
      state.count = 0;
    });
    builder.addCase(fetchCommandAdmins.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.commandAdmins = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(fetchCommandAdmins.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(addCommandAdmin.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(addCommandAdmin.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(addCommandAdmin.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(getCommandAdminById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getCommandAdminById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getCommandAdminById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

    builder.addCase(updateCommandAdmin.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateCommandAdmin.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateCommandAdmin.rejected, (state) => {
      state.updateStatus = "failed";
    });

    builder.addCase(deleteCommandAdmin.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteCommandAdmin.fulfilled, (state) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteCommandAdmin.rejected, (state) => {
      state.deleteStatus = "failed";
    });
  },
});

export default commandAdminSlice.reducer;
