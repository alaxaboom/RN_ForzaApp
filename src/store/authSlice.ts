// store/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthState } from "../types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setAuthState: (
      state,
      action: PayloadAction<{ user: User | null; isAuthenticated: boolean }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  logout,
  updateUser,
  setAuthState,
} = authSlice.actions;

export default authSlice.reducer;