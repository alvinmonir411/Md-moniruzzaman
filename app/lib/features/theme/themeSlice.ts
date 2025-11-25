import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface themestate {
  isDark: boolean;
}
const initialState: themestate = {
  isDark: true,
};
export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
    },
  },
});

// Export actions
export const { toggleTheme, setTheme } = themeSlice.actions;

// Export reducer
export default themeSlice.reducer;
