import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import gifReducer from '../slices/gif/gifSlice';
import appReducer from '../slices/app/appSlice';

export const store = configureStore({
  reducer: {
    gif: gifReducer,
    app: appReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
