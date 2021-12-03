import { configureStore } from '@reduxjs/toolkit';
import generalReducer from '../features/generalSlice';

export const store = configureStore({
  reducer: {
    general: generalReducer
  }
});
