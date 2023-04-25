import { configureStore } from '@reduxjs/toolkit';

import errors from './errors';

export const store = configureStore({
  reducer: {
    errors: errors,
  },
});
