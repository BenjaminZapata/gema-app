import dayjs from "dayjs";
import { z } from "zod";

export const status = {
  failed: "failed",
  idle: "idle",
  pending: "pending",
  succeded: "succeded",
};

export const localURL = "http://localhost:3000";

// Zod validation schemas
export const categorySchema = z
  .string()
  .min(3, "Nombre: ingrese mas de 3 caracteres");

export const productSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(3),
  categoria: z.string().min(1),
  preciocompra: z.coerce.number().min(0),
  precioventa: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  stockminimo: z.coerce.number().min(0),
  tiendaonline: z
    .enum(["true", "false"])
    .transform((value) => value === "true"),
  fechavencimiento: z.preprocess(
    (arg) => {
      // Si el argumento es un string vacío (común desde formularios), null, o undefined
      if (arg === "" || arg === null || arg === undefined) {
        return null; // Queremos que el valor final sea null
      }

      // Si el valor ya es un objeto Dayjs (si manejaras el estado con Dayjs directamente)
      if (dayjs.isDayjs(arg)) {
        return arg.isValid() ? arg.toDate() : null; // Convertir a Date o null
      }

      // Si es un objeto Date nativo
      if (arg instanceof Date) {
        // Re-validar con Dayjs por si es una fecha inválida como 'Invalid Date'
        const d = dayjs(arg);
        return d.isValid() ? d.toDate() : null;
      }

      // Si es un string (del DatePicker o un timestamp numérico)
      // El DatePicker de MUI suele devolver un objeto Dayjs o null a su onChange,
      // pero getFormData podría leer el valor del TextField subyacente como string.
      if (typeof arg === "string" || typeof arg === "number") {
        const date = dayjs(arg); // dayjs puede parsear strings y timestamps
        return date.isValid() ? date.toDate() : null; // Convertir a Date o null
      }

      // Fallback para tipos inesperados
      return null;
    },
    z.date().nullable() // Ahora espera un objeto Date válido o null
  ),
  proveedor: z.string().min(1),
  observaciones: z.string().min(3).optional().or(z.literal("")),
});

export const supplierSchema = z.object({
  direccion: z.string().min(3),
  nombre: z.string().min(3),
  telefono: z.string().min(3),
  pagina: z.string().min(1),
});

//^ Utils para forms

interface InputTypes {
  nombre: string;
  label: string;
  required: boolean;
  type: InputTypeTypes;
}

type InputTypeTypes = "number" | "select" | "text" | "checkbox" | "date";

export const addProductsInputs: Array<InputTypes> = [
  {
    nombre: "id",
    label: "Codigo",
    required: true,
    type: "text",
  },
  {
    nombre: "nombre",
    label: "Nombre",
    required: true,
    type: "text",
  },
  {
    nombre: "categoria",
    label: "Categoria",
    required: true,
    type: "select",
  },
  {
    nombre: "proveedor",
    label: "Proveedor",
    required: true,
    type: "select",
  },
  {
    nombre: "preciocompra",
    label: "Costo",
    required: true,
    type: "number",
  },
  {
    nombre: "precioventa",
    label: "Precio de venta",
    required: true,
    type: "number",
  },
  {
    nombre: "stock",
    label: "Stock",
    required: true,
    type: "number",
  },
  {
    nombre: "stockminimo",
    label: "Stock minimo",
    required: true,
    type: "number",
  },
  {
    nombre: "tiendaonline",
    label: "¿Disponible en la tienda online?",
    required: true,
    type: "select",
  },
  {
    nombre: "fechavencimiento",
    label: "Vencimiento",
    required: false,
    type: "date",
  },
  {
    nombre: "observaciones",
    label: "Observaciones",
    required: false,
    type: "text",
  },
];

export const addSupplierInputs: Array<InputTypes> = [
  {
    nombre: "nombre",
    label: "Nombre",
    required: true,
    type: "text",
  },
  {
    nombre: "telefono",
    label: "Telefono",
    required: true,
    type: "text",
  },
  {
    nombre: "pagina",
    label: "Página",
    required: true,
    type: "text",
  },
  {
    nombre: "direccion",
    label: "Dirección",
    required: true,
    type: "text",
  },
];
