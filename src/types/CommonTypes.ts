//! MYSQL/REDUX
export interface CategoryTypes {
  id: number;
  nombre: string;
}

export interface ExpirationFunctionTypes {
  color?: "error" | "warning" | "inherit";
  expiresSoon: boolean;
  message?: string;
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
  fechamodificacion?: Date | null;
  fechavencimiento: Date | null;
  id: string;
  nombre: string;
  observaciones: null | string | undefined;
  preciocompra: number;
  precioventa: number;
  proveedor: number;
  stock: number;
  stockminimo: number;
  tiendaonline: number;
}

export interface PaymentMethodsTypes {
  id: string;
  nombre: string;
  observaciones: string;
}

export interface ProductSaleDetailsTypes {
  nombre: string;
  productocodigo: string;
  cantidad: number;
  preciounitario: number;
}

export interface SaleProductDetailsTypes {
  cantidad: number;
  nombre?: string;
  preciounitario: number;
  productocodigo: string;
}

export interface SalesTypes {
  fecha: string | Date;
  id: number;
  mediosdepago: number;
  mediodepago?: number;
  total: number;
  detalles?: Array<SaleDetailTypes>;
}

export interface SaleDetailTypes {
  id: number;
  ventacodigo: number;
  productocodigo: string;
  cantidad: number;
  preciounitario: number;
}

//! FILTROS LISTA DE PRODUCTOS
export interface ProductFiltersStateTypes {
  lowStock: boolean;
  name?: string | undefined;
  price: { min?: number; max?: number };
  selectedCategoryIds: string[];
  selectedSupplierIds: string[];
}
