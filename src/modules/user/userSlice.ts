import { User } from "./type";
import { GenericState } from "../../core/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest, deleteRequest, postRequest, putRequest } from "../../api";
import toast from "react-hot-toast";
import { UserRoles } from "../../core/types/db-enum";

export interface UserState extends GenericState {
  users: User[];
  count: number;
}

const initialState: UserState = {
  users: [],
  listStatus: "idle",
  count: 0,
  createStatus: "idle",
  getDetailStatus: "idle",
  updateStatus: "idle",
  deleteStatus: "idle",
};

export const fetchUsers = createAsyncThunk(
  "fetchUsers",
  async (params: any) => {
    const response = await getRequest("/users", params);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (id: number | string) => {
    try {
      await deleteRequest(`/users/${id}`);
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(
        error.response.data.message ||
          `Unable to delete User. Please try again!`
      );
    }
  }
);

export const createUser = createAsyncThunk("createUser", async (user: any) => {
  try {
    await postRequest("/users", user);
    toast.success(`User created successfully!`);
  } catch (error: any) {
    toast.error(
      error.response.data.message || `Unable to add new User. Please try again!`
    );
    throw error;
  }
});

export const updateUser = createAsyncThunk("updateUser", async (user: any) => {
  try {
    await putRequest(`/users/${user.id}`, user);
    toast.success(`User updated successfully!`);
  } catch (error: any) {
    toast.error(
      error.response.data.message || `Unable to update User. Please try again!`
    );
    throw error;
  }
});

export const getUserById = createAsyncThunk(
  "getUserById",
  async (id: number) => {
    const response = await getRequest(`/users/${id}`);
    console.log(response, "===response");
    return response.data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.listStatus = "pending";
      state.count = state.count;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.listStatus = "succeeded";
      state.users = action.payload.records;
      state.count = action.payload.count;
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.listStatus = "failed";
    });

    builder.addCase(deleteUser.pending, (state) => {
      state.deleteStatus = "pending";
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.deleteStatus = "succeeded";
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.deleteStatus = "failed";
    });

    builder.addCase(createUser.pending, (state) => {
      state.createStatus = "pending";
    });
    builder.addCase(createUser.fulfilled, (state) => {
      state.createStatus = "succeeded";
    });
    builder.addCase(createUser.rejected, (state) => {
      state.createStatus = "failed";
    });

    builder.addCase(getUserById.pending, (state) => {
      state.getDetailStatus = "pending";
    });
    builder.addCase(getUserById.fulfilled, (state) => {
      state.getDetailStatus = "succeeded";
    });
    builder.addCase(getUserById.rejected, (state) => {
      state.getDetailStatus = "failed";
    });

    builder.addCase(updateUser.pending, (state) => {
      state.updateStatus = "pending";
    });
    builder.addCase(updateUser.fulfilled, (state) => {
      state.updateStatus = "succeeded";
    });
    builder.addCase(updateUser.rejected, (state) => {
      state.updateStatus = "failed";
    });
  },
});

export default userSlice.reducer;
