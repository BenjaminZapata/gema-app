// Importes de terceros
import { ZodIssue } from "zod";

export type StatusTypes = "failed" | "idle" | "loading" | "succeded" | string;

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

export interface ZodError extends Error {
  issues: ZodIssue[];
}

export const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
