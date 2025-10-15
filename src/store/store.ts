// store/store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appApi } from "./api";
import authReducer from "./authSlice";
import loanReducer from "./loanSlice";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["user", "isAuthenticated"],
};

const loanPersistConfig = {
  key: "loan",
  storage: AsyncStorage,
  whitelist: ["userData", "selectedProduct", "loanAmount", "loanPeriod"],
};

const rootReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
  auth: persistReducer(authPersistConfig, authReducer),
  loan: persistReducer(loanPersistConfig, loanReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(appApi.middleware),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;