// Importes de terceros
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
// Importes propios
import { PaymentMethodsTypes } from "@/types/CommonTypes";
import { localURL, status } from "@/utils/Utils";
import { StatusTypes } from "@/utils/Commons";

interface paymentMethodsSliceTypes {
  paymentMethods: Array<PaymentMethodsTypes>;
  error: null;
  statusPaymentMethods: StatusTypes;
}

const initialState: paymentMethodsSliceTypes = {
  paymentMethods: [],
  error: null,
  statusPaymentMethods: "idle",
};

//* categorías
export const addPaymentMethod = createAsyncThunk(
  "products/addPaymentMethod",
  async (data: { nombre: string, observaciones?: string}) => {
    try {
      const res = await axios.post(`${localURL}/api/paymentmethods`, {
        nombre: data.nombre,
        observaciones: data.observaciones
      });
      toast.success("Se ha creado el metodo de pago");
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo eliminar el metodo de pago");
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  "products/deletePaymentMethod",
  async (id: string) => {
    try {
      const res = await axios.delete(`${localURL}/api/paymentmethods/${id}`);
      toast.success("Se ha eliminado el metodo de pago");
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo eliminar el metodo de pago");
    }
  }
);

export const getPaymentMethods = createAsyncThunk(
  "products/getPaymentMethods",
  async () => {
    try {
      const res = await axios.get(`${localURL}/api/paymentmethods`);
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo obtener los metodos de pago");
    }
  }
);

const paymentMethodsSlice = createSlice({
  name: "paymentMethods",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    // addPaymentMethod
    builder.addCase(addPaymentMethod.fulfilled, () => {
      getPaymentMethods();
    });
    // deletePaymentMethod
    builder.addCase(deletePaymentMethod.fulfilled, () => {
      getPaymentMethods();
    });
    // getPaymentMethods
    builder.addCase(getPaymentMethods.pending, (state) => {
      state.statusPaymentMethods = status.pending;
    });
    builder.addCase(getPaymentMethods.fulfilled, (state, { payload }) => {
      state.statusPaymentMethods = status.succeded;
      state.paymentMethods = payload;
    });
  },
});

export default paymentMethodsSlice.reducer;
