// Importes propios

import { ExpirationFunctionTypes, ProductTypes } from "@/types/CommonTypes";

const FOURTEEN_DAYS_IN_MS = 14 * 24 * 60 * 60 * 1000;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Formatea un objeto Date a un string con formato DD de MMMM de AAAA (ej: "07 de may., 2024").
 * @param date Parametro de tipo Date expresado en formato string a formatear.
 * @returns Un string con la fecha formateada o "Fecha inválida" si la entrada no es una Date válida.
 */
export const getDate = (date: string) => {
  const dateObject = new Date(date);
  return dateObject.toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/**
 * Calcula un string descriptivo de hace cuánto tiempo ocurrió una fecha de modificación.
 * @param date Parametro de tipo Date expresado en formato string de la última modificación.
 * @returns Un string como "Hace menos de una semana", "Hace X días" o mensajes de error/estado.
 */
export const getLastModification = (date: string) => {
  const dateObject = new Date(date);
  if (
    !dateObject ||
    !(dateObject instanceof Date) ||
    isNaN(dateObject.getTime())
  ) {
    return "Fecha inválida";
  }
  const modificationTimestamp = dateObject.getTime();
  const now = Date.now();

  const diffMilliseconds = now - modificationTimestamp;

  const days = Number((diffMilliseconds / ONE_DAY_IN_MS).toFixed(0));
  if (days < 28) {
    return "Hace menos de un mes";
  }
  return `Hace ${days} dias`;
};

export const getExpirationDate = (
  product: ProductTypes
): ExpirationFunctionTypes => {
  const dateObject = new Date(String(product.fechavencimiento));
  if (
    !dateObject ||
    !(dateObject instanceof Date) ||
    isNaN(dateObject.getTime())
  )
    return { expiresSoon: false };

  const expirationTime = dateObject.getTime();
  const now = Date.now();
  const diffMilliseconds = expirationTime - now;
  if (diffMilliseconds >= FOURTEEN_DAYS_IN_MS) {
    return { expiresSoon: false };
  }

  const daysRemaining = diffMilliseconds / ONE_DAY_IN_MS;
  const color = daysRemaining < 8 ? "error" : "warning";
  let message: string;
  if (daysRemaining <= 0) {
    message = "El producto ya expiro";
  } else {
    const roundedDaysForMessage = Math.round(daysRemaining);

    if (roundedDaysForMessage > 0) {
      message = `Expira en ${roundedDaysForMessage} día${
        roundedDaysForMessage !== 1 ? "s" : ""
      }`;
    } else {
      message = "Expira hoy";
    }
  }

  return {
    color,
    expiresSoon: true,
    message,
  };
};

export const cleanObjectNullValues = (
  object: object | Record<string | number, unknown>
) => {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value)
  );
};
