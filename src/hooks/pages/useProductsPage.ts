// Importes de React
import { useCallback, useEffect, useState } from "react";
// Importes de terceros
import { toast } from "sonner";
// Importes propios
import {
  getCategories,
  getProducts,
  getSuppliers,
} from "../../redux/slices/productsSlice";
import { ProductFiltersStateTypes, ProductTypes } from "@/types/CommonTypes";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { status } from "@/utils/Utils";

const initialFiltersState: ProductFiltersStateTypes = {
  lowStock: false,
  name: "",
  price: { min: undefined, max: undefined },
  selectedCategoryIds: [],
  selectedSupplierIds: [],
};

export const useProductsPage = () => {
  //! Dispatch actions - Llamadas a API
  const dispatch = useAppDispatch();
  const {
    products: productsDataFromStore,
    statusCategories,
    statusProducts,
    statusSuppliers,
  } = useAppSelector((state) => state.productos);
  const [loading, setLoading] = useState(true);

  // useEffect - Loading spinner ProductsPage
  useEffect(() => {
    if (
      statusCategories === status.pending ||
      statusProducts === status.pending ||
      statusSuppliers === status.pending
    )
      setLoading(true);
    else setLoading(false);
  }, [statusCategories, statusProducts, statusSuppliers]);

  // useEffect - Carga de categorias, proveedores y productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getCategories());
        await dispatch(getSuppliers());
        await dispatch(getProducts());
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Ocurrió un error desconocido");
        }
      }
    };
    fetchData();
  }, [dispatch]);

  // useEffect - Carga de productos en state cada vez que esta se actualiza (dispatch)
  useEffect(() => {
    setProductList(productsDataFromStore);
  }, [productsDataFromStore]);

  // Función - Recarga de información (proveedores, productos y categorias)
  const reloadData = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(getProducts());
      await dispatch(getCategories());
      await dispatch(getSuppliers());
      setLoading(false);
      toast.success("Se refresco la información");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Ocurrió un error desconocido");
      }
    }
  }, [dispatch]);

  //! Lista de productos y filtros
  const [productList, setProductList] = useState<Array<ProductTypes>>([]);
  const [page, setPage] = useState<number>(1);
  const [activeFilters, setActiveFilters] =
    useState<ProductFiltersStateTypes>(initialFiltersState);

  const [nameInput, setNameInput] = useState<string>("");
  useEffect(() => {
    const handler = setTimeout(() => {
      setActiveFilters((prev) => ({ ...prev, name: nameInput }));
    }, 300);
    return () => clearTimeout(handler);
  }, [nameInput]);

  //? Función - Actualiza el numero de pagina en el componente de paginación
  const handlePageChange = useCallback((event: unknown, value: number) => {
    setPage(value);
  }, []);

  //? Función - Filtro por categorias
  const handleCategoryFilterChange = useCallback((categoryIds: string[]) => {
    setActiveFilters((prev) => ({ ...prev, selectedCategoryIds: categoryIds }));
  }, []);

  //? Función - Filtro por proveedores
  const handleSupplierFilterChange = useCallback((supplierIds: string[]) => {
    setActiveFilters((prev) => ({ ...prev, selectedSupplierIds: supplierIds }));
  }, []);

  //? Función - Filtro por stock minimo
  const handleMinStockFilterChange = useCallback((stockFilter: boolean) => {
    setActiveFilters((prev) => ({ ...prev, lowStock: stockFilter }));
  }, []);

  //? Función - Reset de filtros
  const applyFilters = useCallback(
    (filtersFromDialog: ProductFiltersStateTypes) =>
      setActiveFilters(filtersFromDialog),
    []
  );

  //? useEffect - Filtro de productos
  useEffect(() => {
    if (!productsDataFromStore) {
      setProductList([]);
      return;
    }

    let filtered = [...productsDataFromStore];
    //* Por nombre
    if (activeFilters.name?.trim()) {
      const lowercasedInput = activeFilters.name.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(lowercasedInput) ||
          String(p.id).includes(lowercasedInput)
      );
    }

    //* Por categoria
    if (activeFilters.selectedCategoryIds.length > 0) {
      filtered = filtered.filter(
        (p) =>
          p.categoria &&
          activeFilters.selectedCategoryIds.includes(p.categoria.toString())
      );
    }

    //* Por stock
    if (activeFilters.lowStock == true) {
      filtered = filtered.filter((p) => p.stock <= p.stockminimo);
    }

    //* Por precio
    const priceFilter = activeFilters.price;
    if (priceFilter) {
      if (typeof priceFilter.min === "number") {
        const minPrice = priceFilter.min;
        filtered = filtered.filter((p) => p.precioventa >= minPrice);
      }
      if (typeof priceFilter.max === "number") {
        const maxPrice = priceFilter.max;
        filtered = filtered.filter((p) => p.precioventa <= maxPrice);
      }
    }

    setProductList(filtered);
  }, [activeFilters, productsDataFromStore]);

  return {
    activeFilters,
    applyFilters,
    handleCategoryFilterChange,
    handleMinStockFilterChange,
    handlePageChange,
    handleSupplierFilterChange,
    loading,
    nameInput,
    page,
    productList,
    reloadData,
    setNameInput,
  };
};
