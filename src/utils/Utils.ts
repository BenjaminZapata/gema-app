export const status = {
  failed: "failed",
  idle: "idle",
  pending: "pending",
  succeded: "succeded",
};

export const localURL = "http://localhost:3000";

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
  // {
  //   label: "Precio mínimo",
  //   nombre: "price.min",
  //   required: false,
  //   type: "number",
  // },
  // {
  //   label: "Precio máximo",
  //   nombre: "price.max",
  //   required: false,
  //   type: "number",
  // },
  {
    label: "Con poco stock",
    nombre: "lowStock",
    required: false,
    type: "checkbox",
  },
  {
    label: "Con fecha de vencimiento",
    nombre: "withExpiration",
    required: false,
    type: "checkbox",
  },
  {
    label: "Categorías",
    nombre: "selectedCategoryIds",
    required: false,
    type: "multiselect_categories",
  },
  {
    label: "Ult. actualización",
    nombre: "lastUpdated",
    required: false,
    type: "select",
  },
];

/**
 * Comprueba si un producto coincide con los términos de búsqueda (por palabras clave).
 * Ignora acentos y permite orden aleatorio de las palabras.
 */
export const matchProductByTerms = (
  product: { nombre: string; id: string | number },
  searchValue: string
): boolean => {
  const term = searchValue
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (!term) return true;

  const searchWords = term.split(/\s+/);

  // Normalizamos los datos del producto una sola vez
  const productData = `${product.nombre} ${product.id}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Retorna true solo si TODAS las palabras de búsqueda están en el producto
  return searchWords.every((word) => productData.includes(word));
};
