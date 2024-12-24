import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserRoles } from "core/types/db-enum";
import { Base } from "modules/base/type";
import { Command } from "modules/command/type";
import { Service } from "modules/service/type";
import { SubUnit } from "modules/subunit/types";
import { getRequest, postRequest, setTokenToRequests } from "../../api";
import AzureAuthenticationContext from "../../configs/azure-authentication-context";

type User = {
  name: string;
  email: string;
};

export interface AuthenticatedUser {
  id: number;
  name: string;
  roles: UserRoles[];
  username: string;
  adminSubUnitId?: number;
  baseAdminId?: number;
  commandId?: number;
  email: string;
  hasBaseLevelVehiclesAccess?: boolean;
  serviceId?: number;
  subUnitId?: number;
  adminSubUnit?: SubUnit;
  service?: Service;
  command?: Command;
  base?: Base;
}

export interface LoginState {
  user?: User;
  accessToken?: string;
  loading: "idle" | "pending" | "succeeded" | "failed";
  isLogined: boolean;
  authenticatedUser: AuthenticatedUser | null;
  currentRole: UserRoles | null;
}

const initialState: LoginState = {
  user: undefined,
  loading: "idle",
  accessToken: undefined,
  isLogined: false,
  authenticatedUser: null,
  currentRole: null,
};

export const login = createAsyncThunk(
  "login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await postRequest("/auth/local/login", {
      email,
      password,
    });
    return response.data;
  }
);

export const loginViaMicrosoft = createAsyncThunk(
  "loginViaMicrosoft",
  async () => {
    // const authenticationModule: AzureAuthenticationContext =
    //   new AzureAuthenticationContext();
    // const response = await authenticationModule.login("loginPopup");
    // return response;
    const response = await getRequest("/auth/microsoft/connect");
    debugger;
    return response;
  }
);

export const getCurrentUser = createAsyncThunk("getCurrentUser", async () => {
  const response = await getRequest("/users/me");
  return response.data;
});

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLogin(state: LoginState, action: PayloadAction<boolean>) {
      state.isLogined = action.payload;
    },
    setCurrentRole(state: LoginState, action: PayloadAction<UserRoles>) {
      state.currentRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        setTokenToRequests(action.payload.access_token);
        state.loading = "succeeded";
        state.isLogined = true;
      } else {
        state.loading = "failed";
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = "failed";
    });

    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.authenticatedUser = action.payload;
      state.currentRole =
        (action?.payload?.roles && action.payload.roles[0]) ?? null;
    });
  },
});

export const { setLogin, setCurrentRole } = loginSlice.actions;

export default loginSlice.reducer;
