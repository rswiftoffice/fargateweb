import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { postRequest, getRequest, deleteRequest, putRequest } from "../../api";
import { Command } from "./type";

export interface CommandState {
  commands: Command[];
  count: number;
  loading: "idle" | "pending" | "succeeded" | "failed";
  addCommandLoading: "idle" | "pending" | "succeeded" | "failed";
  deleteCommandLoading: "idle" | "pending" | "succeeded" | "failed";
  updateCommandLoading: "idle" | "pending" | "succeeded" | "failed";
  transferCommandLoading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: CommandState = {
  loading: "idle",
  addCommandLoading: "idle",
  deleteCommandLoading: "idle",
  updateCommandLoading: "idle",
  transferCommandLoading: "idle",
  count: 0,
  commands: [],
};

export const getCommand = createAsyncThunk(
  "getCommand",
  async (params: any = {}) => {
    const response = await getRequest("/commands", params);
    return response.data;
  }
);

export const getCommandById = createAsyncThunk(
  "getCommandById",
  async (id: string) => {
    const response = await getRequest(`/commands/${id}`);
    return response.data;
  }
);

type AddCommandType = {
  name: string;
  description: string;
  serviceId: number;
};
export const addCommand = createAsyncThunk(
  "addCommand",
  async (data: AddCommandType, thunkAPI) => {
    try {
      const { dispatch } = thunkAPI;
      const response: AxiosResponse<
        {
          id: number;
          name: string;
          description: string;
          createdAt: string;
          updatedAt: string;
          serviceId: number;
        },
        any
      > = await postRequest("/commands", data);
      if (response.status === 201) {
        toast.success("Command created successfully!");
        dispatch(getCommand({}));
      } else {
        toast.error("Unable to add new command. Please try again!");
      }
    } catch (error) {
      toast.error("Unable to add new command. Please try again!");
      console.log(error);
    }
  }
);

export const deleteCommand = createAsyncThunk(
  "deleteCommand",
  async (id: number, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const response = await deleteRequest(`/commands/${id}`);
    if (response.status === 200) {
      dispatch(getCommand({}));
    }
  }
);

export const updateCommand = createAsyncThunk(
  "updateCommand",
  async (
    newCommand: { id: number; name: string; description: string },
    thunkAPI
  ) => {
    try {
      const { dispatch } = thunkAPI;
      const response = await putRequest(`/commands/${newCommand.id}`, {
        name: newCommand.name,
        description: newCommand.description,
      });
      if (response.status === 200) {
        toast.success("Command updated successfully!");
        dispatch(getCommand({}));
      } else toast.error("Unable to update command. Please try again!");
    } catch (error) {
      console.error("error: ", error);
      toast.error("Unable to update command. Please try again!");
    }
  }
);

export const transferCommand = createAsyncThunk(
  "transferCommand",
  async (
    data: { currentCommandId: number; newCommandId: number },
    thunkAPI
  ) => {
    try {
      const { dispatch } = thunkAPI;
      const response = await postRequest(`/commands/transfer`, { ...data });
      if (response.status === 201) {
        toast.success("Command updated successfully!");
        dispatch(getCommand({}));
      } else toast.error("Unable to update command. Please try again!");
    } catch (error) {
      console.error("error: ", error);
      toast.error("Unable to update command. Please try again!");
    }
  }
);

export const commandSlice = createSlice({
  name: "command",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCommand.pending, (state) => {
      state.loading = "pending";
      state.commands = [];
      state.count = 0;
    });
    builder.addCase(getCommand.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.commands = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(getCommand.rejected, (state, action) => {
      state.loading = "failed";
    });
    builder.addCase(addCommand.pending, (state) => {
      state.addCommandLoading = "pending";
    });
    builder.addCase(addCommand.fulfilled, (state, action) => {
      state.addCommandLoading = "succeeded";
    });
    builder.addCase(addCommand.rejected, (state, action) => {
      state.addCommandLoading = "failed";
    });

    builder.addCase(updateCommand.pending, (state) => {
      state.updateCommandLoading = "pending";
    });
    builder.addCase(updateCommand.fulfilled, (state, action) => {
      state.updateCommandLoading = "succeeded";
    });
    builder.addCase(updateCommand.rejected, (state, action) => {
      state.updateCommandLoading = "failed";
    });

    builder.addCase(deleteCommand.pending, (state) => {
      state.deleteCommandLoading = "pending";
    });
    builder.addCase(deleteCommand.fulfilled, (state, action: any) => {
      state.deleteCommandLoading = "succeeded";
    });
    builder.addCase(deleteCommand.rejected, (state, action) => {
      state.deleteCommandLoading = "failed";
    });

    builder.addCase(transferCommand.pending, (state) => {
      state.transferCommandLoading = "pending";
    });
    builder.addCase(transferCommand.fulfilled, (state, action) => {
      state.transferCommandLoading = "succeeded";
    });
    builder.addCase(transferCommand.rejected, (state, action) => {
      state.transferCommandLoading = "failed";
    });
  },
});

export default commandSlice.reducer;
