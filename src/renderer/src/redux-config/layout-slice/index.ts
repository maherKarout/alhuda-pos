import { createSlice } from "@reduxjs/toolkit";

const initialState: { isOpen: Array<string>; opened: boolean } = {
  isOpen: [],
  opened: true,
};
const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    openMenu: (state, action) => {
      state.isOpen = [action.payload.id];
    },
    setMenu: (state, action) => {
      state.opened = action.payload.opened;
    },
  },
});
export const { setMenu } = layoutSlice.actions;
export default layoutSlice.reducer;
