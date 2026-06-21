import { z } from "zod";
import dayjs from "dayjs";

export const categorySchema = z
  .string()
  .min(3, "Nombre: ingrese mas de 3 caracteres");

export const paymentMethodSchema = z.object({
  nombre: z.string().min(3, "Nombre: ingrese mas de 3 caracteres"),
  observaciones: z
    .string()
    .min(3, "Observaciones: ingrese mas de 3 caracteres")
    .optional()
    .default(""),
});

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
  id: z
    .string()
    .min(1, "El código es requerido")
    .regex(/^[0-9]+$/, {
      message: "El código debe contener solo dígitos",
    }),
  ...baseProductSchemaFields,
});
export type CreateProductFormData = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: z
    .string()
    .min(1, "El código es requerido")
    .regex(/^[0-9]+$/, {
      message: "El código debe contener solo dígitos",
    }),
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
    withExpiration: z
      .preprocess((val) => {
        if (typeof val === "boolean") return val;
        if (val === "true") return true;
        if (val === "false") return false;
        return false;
      }, z.boolean().optional().default(false))
      .describe("Filtrar por productos que tienen fecha de vencimiento"),
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
    lastUpdated: z
      .enum(["none", "mas-antiguos", "mas-recientes"], {
        errorMap: () => ({
          message: "Seleccione un orden de actualización válido",
        }),
      })
      .default("none")
      .describe("Ordenar por fecha de última actualización"),
  })
  .strict("Se enviaron campos no esperados en los filtros.")
  .describe("Schema para validar los filtros de productos");

