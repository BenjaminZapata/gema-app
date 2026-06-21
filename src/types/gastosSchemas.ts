import { z } from "zod";

export const TipoGastoEnum = z.enum([
  "Servicios",
  "Sueldos",
  "Envíos",
  "Pedidos",
  "Alquiler",
  "Alquiler_impresoras",
  "Cuotas",
  "Seguros",
  "Monotributo",
  "Otros",
  "Expensas",
]);

export const gastoSchema = z.object({
  nombre: z.string().min(1),
  tipo: TipoGastoEnum,
  fecha: z.coerce.date(),
  observaciones: z.string().optional(),
  total: z.coerce.number().int(),
});

export const gastoUpdateSchema = gastoSchema.partial();

export type GastoInput = z.infer<typeof gastoSchema>;
export type GastoUpdateInput = z.infer<typeof gastoUpdateSchema>;
