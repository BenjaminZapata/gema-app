// Importes de terceros
import { ZodIssue } from 'zod';

export interface CategoryType {
  id: number;
  nombre: string;
}

export interface ExpirationFunctionType {
  color?: 'error' | 'warning' | 'inherit';
  expiresSoon: boolean;
  message?: string;
}

export interface InputProps {
  nombre: string;
  label: string;
  required: boolean;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date';
}

export type StatusTypes = 'failed' | 'idle' | 'loading' | 'succeded' | string;

export interface ZodError extends Error {
  issues: ZodIssue[];
}
