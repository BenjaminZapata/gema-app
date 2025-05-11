// Importes de terceros
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
// Importes propios
import {
  CategoryTypes,
  ProductTypes,
  SupplierTypes,
} from "@/types/CommonTypes";
import { localURL, status } from "@/utils/Utils";
import { StatusTypes } from "@/utils/Commons";
import { cleanObjectNullValues } from "@/utils/Functions";

interface productsSliceType {
  categories: Array<CategoryTypes>;
  error: null;
  products: Array<ProductTypes>;
  suppliers: Array<SupplierTypes>;
  statusCategories: StatusTypes;
  statusProducts: StatusTypes;
  statusSuppliers: StatusTypes;
}

const initialState: productsSliceType = {
  categories: [],
  error: null,
  products: [],
  suppliers: [],
  statusCategories: "idle",
  statusProducts: "idle",
  statusSuppliers: "idle",
};

//* Categorias
export const addCategory = createAsyncThunk(
  "products/addCategories",
  async (nombre: string) => {
    try {
      const res = await axios.post(`${localURL}/api/categories`, {
        nombre: nombre,
      });
      toast.success("Se ha creado la categoria");
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo eliminar la categoria");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "products/deleteCategories",
  async (id: number) => {
    try {
      const res = await axios.delete(`${localURL}/api/categories?id=${id}`);
      toast.success("Se ha eliminado la categoria");
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo eliminar la categoria");
    }
  }
);

export const getCategories = createAsyncThunk(
  "products/getCategories",
  async () => {
    try {
      const res = await axios.get(`${localURL}/api/categories`);
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo obtener las categorias");
    }
  }
);

//* Productos

export const addProduct = createAsyncThunk(
  "products/addProducts",
  async (data: ProductTypes) => {
    try {
      const res = await axios.post(
        `${localURL}/api/products`,
        cleanObjectNullValues(data)
      );
      toast.success("Se ha agregado el producto");
      return res;
    } catch {
      toast.error("ERROR: No se pudo añadir el producto");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProducts",
  async (id: number) => {
    try {
      const res = await axios.delete(`${localURL}/api/products?id=${id}`);
      toast.success("Se ha eliminado el producto");
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo eliminar el producto");
    }
  }
);

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    try {
      const res = await axios.get(`${localURL}/api/products`);
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo obtener los productos");
    }
  }
);

export const modifyProduct = createAsyncThunk(
  "products/modifyProducts",
  async (data: ProductTypes, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${localURL}/api/products/${data.id}`, data);
      return res.data;
    } catch (error) {
      toast.error("ERROR: No se pudo modificar el producto");
      return rejectWithValue(error.response?.data || "Error desconocido");
    }
  }
);

//* Proveedores

export const addSupplier = createAsyncThunk(
  "products/addSupplier",
  async (data: SupplierTypes) => {
    try {
      const res = await axios.post(
        `${localURL}/api/suppliers`,
        cleanObjectNullValues(data)
      );
      toast.success("Se ha agregado al proveedor");
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo añadir el proveedor");
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "products/deleteSuppliers",
  async (id: number) => {
    try {
      const res = await axios.delete(`${localURL}/api/suppliers?id=${id}`);
      toast.success("Se ha eliminado el proveedor");
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo eliminar el proveedor");
    }
  }
);

export const getSuppliers = createAsyncThunk(
  "products/getSuppliers",
  async () => {
    try {
      const res = await axios.get(`${localURL}/api/suppliers`);
      return res.data;
    } catch {
      toast.error("ERROR: No se pudo obtener los proveedores");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    // addCategory
    builder.addCase(addCategory.fulfilled, () => {
      getCategories();
    });
    // deleteCategory
    builder.addCase(deleteCategory.fulfilled, () => {
      getCategories();
    });
    // getCategories
    builder.addCase(getCategories.pending, (state) => {
      state.statusCategories = status.pending;
    });
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.statusCategories = status.succeded;
      state.categories = payload;
    });
    // getProducts
    builder.addCase(getProducts.pending, (state) => {
      state.statusProducts = status.pending;
    });
    builder.addCase(getProducts.fulfilled, (state, { payload }) => {
      state.statusProducts = status.succeded;
      state.products = payload;
    });
    // addSuppliers
    builder.addCase(addSupplier.pending, (state) => {
      state.statusSuppliers = status.pending;
    });
    builder.addCase(addSupplier.fulfilled, (state) => {
      state.statusSuppliers = status.succeded;
    });
    // getSuppliers
    builder.addCase(getSuppliers.pending, (state) => {
      state.statusSuppliers = status.pending;
    });
    builder.addCase(getSuppliers.fulfilled, (state, { payload }) => {
      state.statusSuppliers = status.succeded;
      state.suppliers = payload;
    });
    // deleteSupplier
    builder.addCase(deleteSupplier.pending, (state) => {
      state.statusSuppliers = status.pending;
    });
    builder.addCase(deleteSupplier.fulfilled, (state) => {
      state.statusSuppliers = status.succeded;
    });
  },
});

export default productsSlice.reducer;
