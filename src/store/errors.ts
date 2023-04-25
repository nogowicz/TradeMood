import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    isError: false,
    errorMessage: '',
  },

  reducers: {
    setErrorRedux: (state, action) => {
      state.isError = action.payload.isError;
      state.errorMessage = action.payload.errorMessage;
    },
  },
});

export const setErrorRedux = errorSlice.actions.setErrorRedux;

export default errorSlice.reducer;
