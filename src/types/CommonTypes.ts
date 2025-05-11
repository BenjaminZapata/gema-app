//! MYSQL/REDUX
export interface CategoryTypes {
  id: number;
  nombre: string;
}

export interface SupplierTypes {
  direccion: string;
  id?: number;
  nombre: string;
  pagina: string;
  telefono: string;
}

export interface ProductTypes {
  categoria: number;
  fechamodificacion?: number;
  fechavencimiento: Date | null;
  id: number;
  nombre: string;
  observaciones: null | string | undefined;
  preciocompra: number;
  precioventa: number;
  proveedor: number;
  stock: number;
  stockminimo: number;
  tiendaonline: number;
}

//! FILTROS LISTA DE PRODUCTOS
export interface ProductFiltersStateTypes {
  lowStock: boolean;
  name?: string | undefined;
  price: { min?: number; max?: number };
  selectedCategoryIds: string[];
  selectedSupplierIds: string[];
}
