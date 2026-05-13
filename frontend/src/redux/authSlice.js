import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('access_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.access;
      state.isAuthenticated = true;
      localStorage.setItem('access_token', action.payload.access);
      localStorage.setItem('refresh_token', action.payload.refresh);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
