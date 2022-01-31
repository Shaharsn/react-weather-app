import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import weatherReducer from "./slices/weatherSlice";

const persistWeatherConfig = {
  key: "Weather",
  storage,
};

const persistedWeatherReducer = persistReducer(
  persistWeatherConfig,
  weatherReducer
);

export const store = configureStore({
  reducer: {
    weather: persistedWeatherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux/toolkit
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
