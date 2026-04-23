import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  tempSignupPassword: string | null;
  selectedRole: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  tempSignupPassword: null,
  selectedRole: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTempCredentials: (state, action: PayloadAction<{ password: string }>) => {
      state.tempSignupPassword = action.payload.password;
    },
    setSelectedRole: (state, action: PayloadAction<string | null>) => {
      state.selectedRole = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.tempSignupPassword = null; // Clear for security
    },
    logout: (state) => initialState,
  },
});

export const { setTempCredentials, setSelectedRole, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;