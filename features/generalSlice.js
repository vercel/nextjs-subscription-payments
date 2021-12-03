import { createSlice } from '@reduxjs/toolkit';

const generalData = {
  mediaStream: '',
  screenStream: ''
};

const initialState = generalData;

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    storeMediaStream: (state, action) => {},
    storeScreenStream: (state, action) => {}
  }
});

// Action creators are generated for each case reducer function
export const { storeScreenStream, storeMediaStream } = generalSlice.actions;

export default generalSlice.reducer;
