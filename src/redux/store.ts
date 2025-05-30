// Importes de terceros
import { configureStore } from "@reduxjs/toolkit";
// Importes propios
import productsSlice from "./slices/productsSlice";
import paymentMethodsSlice from "./slices/paymentMethodsSlice";

const store = configureStore({
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    productos: productsSlice,
    metodosdepago: paymentMethodsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
