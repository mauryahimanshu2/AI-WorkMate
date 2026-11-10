import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AIContentState {
  selectedContentType: string | null;
}

const initialState: AIContentState = {
  selectedContentType: null,
};

const aiContentSlice = createSlice({
  name: 'aiContent',
  initialState,
  reducers: {
    setSelectedContentType: (state, action: PayloadAction<string | null>) => {
      state.selectedContentType = action.payload;
    },
    reset: () => initialState,
  },
});

export const { reset, setSelectedContentType } = aiContentSlice.actions;
export default aiContentSlice.reducer;

