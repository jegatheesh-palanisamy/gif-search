import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

type ThemeType = 'light' | 'dark';;

export interface IAppSlice {
  theme: ThemeType;
}

const initialState: IAppSlice = {
  theme: 'light'
};

export const gifSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
    }
  },
});

export const { toggleTheme } = gifSlice.actions;

export const selectTheme = (state: RootState) => state.app.theme;

export default gifSlice.reducer;
