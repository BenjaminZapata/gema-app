// Importes de terceros
import { ZodIssue } from "zod";

export interface CategoryType {
  id: number;
  nombre: string;
}

export interface ExpirationFunctionType {
  color?: "error" | "warning" | "inherit";
  expiresSoon: boolean;
  message?: string;
}

export interface InputProps {
  nombre: string;
  label: string;
  required: boolean;
  type:
    | "text"
    | "number"
    | "select"
    | "checkbox"
    | "date"
    | "multiselect_categories"
    | "multiselect_suppliers"
    | "switch";
}

export interface SaleProductDetailsTypes {
  cantidad: number;
  nombre?: string;
  preciounitario: number;
  productocodigo: string;
}


export type StatusTypes = "failed" | "idle" | "loading" | "succeded" | string;

export interface ZodError extends Error {
  issues: ZodIssue[];
}
