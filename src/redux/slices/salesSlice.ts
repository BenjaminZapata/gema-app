// Importes de terceros
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
// Importes propios
import {
  PaymentMethodsTypes,
  SaleProductDetailsTypes,
  SalesTypes,
} from "@/types/CommonTypes";
import { localURL, status } from "@/utils/Utils";
import { StatusTypes } from "@/utils/Commons";

interface salesSliceTypes {
  error: null | string;
  paymentMethods: Array<PaymentMethodsTypes>;
  sales: SalesTypes[];
  statusPaymentMethods: StatusTypes;
  statusSales: StatusTypes;
}

const initialState: salesSliceTypes = {
  error: null,
  paymentMethods: [],
  sales: [],
  statusPaymentMethods: "idle",
  statusSales: "idle",
};

//* metodos de pago
export const addPaymentMethod = createAsyncThunk(
  "sales/addPaymentMethod",
  async (data: { nombre: string; observaciones?: string }) => {
    try {
      const res = await axios.post(`${localURL}/api/paymentmethods`, {
        nombre: data.nombre,
        observaciones: data.observaciones,
      });
      toast.success("Se ha creado el metodo de pago");
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo eliminar el metodo de pago");
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  "sales/deletePaymentMethod",
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
  "sales/getPaymentMethods",
  async () => {
    try {
      const res = await axios.get(`${localURL}/api/paymentmethods`);
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo obtener los metodos de pago");
    }
  }
);

//* ventas
export const getSales = createAsyncThunk("sales/getSales", async () => {
  try {
    const res = await axios.get(`${localURL}/api/sales`);
    return res.data;
  } catch {
    toast.error("ERROR: No se pudo obtener las ventas");
  }
});

export const addSale = createAsyncThunk(
  "sales/addSale",
  async (data: {
    mediosdepago: number;
    productList: SaleProductDetailsTypes[];
    total: number;
  }) => {
    try {
      const { productList, mediosdepago, total } = data;
      productList.forEach((prod) => delete prod.nombre);
      const apiObject = {
        detalles: productList,
        fecha: new Date(),
        mediosdepago: mediosdepago,
        total: total,
      };
      const res = await axios.post(`${localURL}/api/sales`, apiObject);
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo añadir la venta");
    }
  }
);

const salesSlice = createSlice({
  name: "salesSlice",
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
    // addSale
    builder.addCase(addSale.fulfilled, (state, { payload }) => {
      getSales();
      toast.success("Venta agregada con exito");
    });
    builder.addCase(addSale.rejected, () => {
      getSales();
      toast.error("Hubo un error al añadir la venta");
    });
    // getSales
    builder.addCase(getSales.pending, (state) => {
      state.statusSales = status.pending;
    });
    builder.addCase(getSales.fulfilled, (state, { payload }) => {
      state.statusSales = status.succeded;
      state.sales = payload;
      toast.success("Ventas obtenidas con exito");
    });
    builder.addCase(getSales.rejected, (state, { payload }) => {
      state.statusSales = status.failed;
      toast.error("Hubo un error al obtener las ventas");
    });
  },
});

export default salesSlice.reducer;
