import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setCartItems, setCartLoading } = cartSlice.actions;
export default cartSlice.reducer;
