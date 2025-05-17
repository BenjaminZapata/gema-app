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

const baseProductSchemaFields = {
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  categoria: z.coerce
    .number({ invalid_type_error: "Categoría es requerida" })
    .int("Categoría inválida")
    .positive("Categoría inválida"),
  proveedor: z.coerce
    .number({ invalid_type_error: "Proveedor es requerido" })
    .int("Proveedor inválido")
    .positive("Proveedor inválido"),
  preciocompra: z.coerce
    .number({ invalid_type_error: "Costo es requerido" })
    .nonnegative("Costo no puede ser negativo"),
  precioventa: z.coerce
    .number({ invalid_type_error: "Precio de venta es requerido" })
    .nonnegative("Precio de venta no puede ser negativo"),
  stock: z.coerce
    .number({ invalid_type_error: "Stock es requerido" })
    .int("Stock debe ser entero")
    .nonnegative("Stock no puede ser negativo"),
  stockminimo: z.coerce
    .number({ invalid_type_error: "Stock mínimo es requerido" })
    .int("Stock mínimo debe ser entero")
    .nonnegative("Stock mínimo no puede ser negativo"),
  tiendaonline: z
    .enum(["true", "false"], {
      errorMap: () => ({ message: "Seleccione una opción para tienda online" }),
    })
    .transform((value) => value === "true"),
  fechavencimiento: z.preprocess((arg) => {
    if (arg === "" || arg === null || arg === undefined) return null;
    if (
      dayjs.isDayjs(arg) ||
      arg instanceof Date ||
      typeof arg === "number" ||
      typeof arg === "string"
    ) {
      const date = dayjs(arg as string | number | Date | dayjs.Dayjs);
      return date.isValid() ? date.toDate() : null;
    }
    return null;
  }, z.date().nullable()),
  observaciones: z
    .string()
    .min(3, "Observaciones debe tener al menos 3 caracteres")
    .optional()
    .or(z.literal("")),
};

export const createProductSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "Código es requerido" })
    .int("El código debe ser un número entero") // o string si tu ID puede ser alfanumérico
    .positive("El código debe ser positivo"),
  ...baseProductSchemaFields,
});
export type CreateProductFormData = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: z.coerce.number().int().positive(),
  ...baseProductSchemaFields,
});
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;

export const supplierSchema = z.object({
  direccion: z.string().min(3),
  nombre: z.string().min(3),
  telefono: z.string().min(3),
  pagina: z.string().min(1),
});

export const filtersSchema = z
  .object({
    name: z.string().optional(),
    lowStock: z
      .preprocess((val) => {
        if (typeof val === "boolean") return val;
        if (val === "true") return true;
        if (val === "false") return false;
        return false;
      }, z.boolean().optional().default(false))
      .describe("Filtrar por productos con stock bajo"),
    price: z
      .object({
        min: z.coerce.number().min(0).optional(),
        max: z.coerce.number().min(0).optional(),
      })
      .optional()
      .default({ min: undefined, max: undefined })
      .refine(
        (data) => {
          if (data.min !== undefined && data.max !== undefined) {
            return data.min <= data.max;
          }
          return true;
        },
        {
          message: "El precio mínimo no puede ser mayor que el precio máximo",
          path: ["min"],
        }
      )
      .describe("Rango de precios para filtrar"),
    selectedCategoryIds: z
      .array(z.string())
      .default([])
      .describe("IDs de las categorías seleccionadas para filtrar"),
    selectedSupplierIds: z
      .array(z.string())
      .default([])
      .describe("IDs de los proveederos seleccionados para filtrar"),
  })
  .strict("Se enviaron campos no esperados en los filtros.")
  .describe("Schema para validar los filtros de productos");

//^ Utils para forms

interface InputTypes {
  nombre: string;
  label: string;
  required: boolean;
  type: InputTypeTypes;
}

type InputTypeTypes =
  | "number"
  | "select"
  | "text"
  | "checkbox"
  | "date"
  | "multiselect_categories"
  | "multiselect_suppliers"
  | "switch";

export const addProductsInputs: Array<InputTypes> = [
  {
    nombre: "id",
    label: "Código",
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
    label: "Categoría",
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

export const filterDialogInputs: Array<InputTypes> = [
  {
    label: "Precio mínimo",
    nombre: "price.min",
    required: false,
    type: "number",
  },
  {
    label: "Precio máximo",
    nombre: "price.max",
    required: false,
    type: "number",
  },
  {
    label: "Con poco stock",
    nombre: "lowStock",
    required: false,
    type: "checkbox",
  },
  {
    label: "categorías",
    nombre: "selectedCategoryIds",
    required: false,
    type: "multiselect_categories",
  },
];
