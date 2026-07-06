import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
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
    setCredentials(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("erp_token", action.payload.token);
        window.localStorage.setItem("erp_user", JSON.stringify(action.payload.user));
      }
    },
    logout(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("erp_token");
        window.localStorage.removeItem("erp_user");
      }
    },
  },
});

export const { hydrate, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
