import { configureStore } from '@reduxjs/toolkit';
import gymOwnerAuthReducer from "./gymOwnerAuth/gymOwnerAuthSlice"
import memberAuthReducer from "./memberAuth/memberAuthSlice"
export const store = configureStore({
  reducer: {
    gymOwnerAuth: gymOwnerAuthReducer,
    memberAuth:memberAuthReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['gymOwnerAuth/setCredentials'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
