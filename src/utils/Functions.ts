// Importes propios

import { ProductTypes, SupplierTypes } from "@/types/CommonTypes";
import { ExpirationFunctionType } from "./CommonTypes";

export const getDate = (date: number) => {
  const formatedDate = new Date(date).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formatedDate;
};

export const getLastModification = (date: number) => {
  const days = Number(((Date.now() - Number(date)) / 86400000).toFixed(0));
  if (days < 7) {
    return "Hace menos de una semana";
  }
  return `Hace ${days} dias`;
};

export const getExpirationDate = (
  product: ProductTypes
): ExpirationFunctionType => {
  if (!product.fechavencimiento) return { expiresSoon: false };
  const dateDifference = product.fechavencimiento - Date.now() < 1209600000;
  if (!dateDifference) {
    return { expiresSoon: false };
  }
  const days = (product.fechavencimiento - Date.now()) / 86400000;
  return {
    color: days < 0 ? "inherit" : days <= 14 ? "error" : "warning",
    expiresSoon: true,
    message:
      days > 0
        ? `Expira ${
            Number(days.toFixed(0)) > 0 ? `en ${days.toFixed(0)} dias` : "hoy"
          }`
        : "El producto ya expiro",
  };
};

export const getFormData = (event: React.FormEvent<HTMLFormElement>) => {
  const formData = new FormData(event.currentTarget);
  const data: Record<string, unknown> | ProductTypes | SupplierTypes = {};

  for (const [key, value] of formData.entries()) {
    if (!key) continue; // Ignora campos sin nombre

    if (value === "on") {
      // Checkbox: si aparece como "on", está tildado (true)
      data[key] = true;
    } else if (!data.hasOwnProperty(key)) {
      // Si ya se seteo (por otro input deshabilitado), lo salteamos
      data[key] = value;
    }
  }
  return data;
};

export const cleanObjectNullValues = (
  object: object | Record<string | number, unknown>
) => {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value)
  );
};
