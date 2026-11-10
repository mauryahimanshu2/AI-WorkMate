import { configureStore } from '@reduxjs/toolkit';

import aiContentReducer from '../features/aiContent/aiContentSlice';

export const store = configureStore({
  reducer: {
    aiContent: aiContentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

