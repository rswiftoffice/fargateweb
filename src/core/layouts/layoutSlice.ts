import { createSlice } from "@reduxjs/toolkit";

interface LayoutState {
  pageTitle: string;
}

const initialState: LayoutState = {
  pageTitle: "",
};

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setPageTitle(state, action) {
      state.pageTitle = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { setPageTitle } = layoutSlice.actions;

export default layoutSlice.reducer;
