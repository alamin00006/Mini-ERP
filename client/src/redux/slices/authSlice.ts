import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  permissions: string[];
  hydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  permissions: [],
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate(state) {
      if (typeof window === "undefined") {
        state.hydrated = true;
        return;
      }
      const token = window.localStorage.getItem("erp_token");
      const userRaw = window.localStorage.getItem("erp_user");
      if (token && userRaw) {
        try {
          state.user = JSON.parse(userRaw) as User;
          state.token = token;
        } catch {
          state.user = null;
          state.token = null;
        }
      }
      state.hydrated = true;
    },
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: User; permissions: string[] }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("erp_token", action.payload.token);
        window.localStorage.setItem("erp_user", JSON.stringify(action.payload.user));
        window.localStorage.setItem("erp_permissions", JSON.stringify(action.payload.permissions));
      }
    },
    setPermissions(state, action: PayloadAction<string[]>) {
      state.permissions = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("erp_permissions", JSON.stringify(action.payload));
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.permissions = [];
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("erp_token");
        window.localStorage.removeItem("erp_user");
        window.localStorage.removeItem("erp_permissions");
      }
    },
  },
});

export const { hydrate, setCredentials, setPermissions, logout } = authSlice.actions;
export default authSlice.reducer;
