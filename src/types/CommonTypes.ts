export interface CategoryTypes {
  id: number;
  nombre: string;
}

export interface SupplierTypes {
  direccion: string;
  id: number;
  nombre: string;
  pagina: string;
  telefono: string;
}

export interface ProductTypes {
  categoria: number;
  fechamodificacion: number;
  fechavencimiento: number;
  id: number;
  nombre: string;
  observaciones: null | string;
  preciocompra: number;
  precioventa: number;
  proveedor: number;
  stock: number;
  stockminimo: number;
  tiendaonline: number;
}