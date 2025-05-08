// Importes de React
import { useEffect, useState } from "react";
// Importes de terceros
import { toast } from "sonner";
// Importes propios
import {
  getCategories,
  getProducts,
  getSuppliers,
} from "../../redux/slices/productsSlice";
import { ProductTypes } from "@/types/CommonTypes";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { status } from "@/utils/Utils";

export const useProductsPage = () => {
  const [filterInputValue, setFilterInputValue] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [productList, setProductList] = useState<Array<ProductTypes>>([]);

  const dispatch = useAppDispatch();
  const {
    products: productsData,
    statusCategories,
    statusProducts,
    statusSuppliers,
  } = useAppSelector((state) => state.productos);

  // useEffect - Loading state para Skeleton en ProductsPage
  useEffect(() => {
    if (
      statusCategories === status.pending ||
      statusProducts === status.pending ||
      statusSuppliers === status.pending
    )
      setLoading(true);
    else setLoading(false);
  }, [statusCategories, statusProducts, statusSuppliers]);

  // useEffect - Carga de productos en state cada vez que esta se actualiza (dispatch)
  useEffect(() => {
    setProductList(productsData);
  }, [productsData]);

  // useEffect - Loading state para Skeleton en ProductsPage
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getCategories());
        await dispatch(getProducts());
        await dispatch(getSuppliers());
      } catch (err) {
        toast.error(err.issues[0].message);
      }
    };
    fetchData();
  }, [dispatch]);

  // Función - Recarga de información (proveedores, productos y categorias)
  const reloadData = async () => {
    setLoading(true);
    try {
      await dispatch(getProducts());
      await dispatch(getCategories());
      await dispatch(getSuppliers());
      setLoading(false);
      toast.success("Se refresco la información");
    } catch (err) {
      toast.error(err.issues[0].message);
    }
  };

  // Función - Actualiza el numero de pagina en el componente de paginación
  const handlePageChange = (event: unknown, value: number) => {
    setPage(value);
  };

  return {
    filterInputValue,
    handlePageChange,
    loading,
    page,
    productList,
    reloadData,
    setFilterInputValue,
    setProductList,
  };
};
