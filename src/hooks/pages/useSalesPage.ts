import { ProductSaleDetails, ProductTypes } from "@/types/CommonTypes";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import {
  getCategories,
  getProducts,
  getSuppliers,
} from "@/redux/slices/productsSlice";
import { status } from "@/utils/Utils";
import { toast } from "sonner";

export const useSalesPage = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(true);
  const [productsList, setProductsList] = useState<ProductSaleDetails[]>([]);
  const [total, setTotal] = useState(0);
  const { statusCategories, statusProducts, statusSuppliers } = useAppSelector(
    (state) => state.productos
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getSuppliers());
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (
      statusCategories === status.pending ||
      statusProducts === status.pending ||
      statusSuppliers === status.pending
    )
      setLoading(true);
    else setLoading(false);
  }, [statusCategories, statusProducts, statusSuppliers]);

  const handleAddProduct = (product: ProductTypes) => {
    if (productsList.some((p) => p.productocodigo === product.id)) {
      toast.error("Ese producto ya esta agregado");
      return;
    }
    setProductsList((prev) => [
      ...prev,
      {
        cantidad: 1,
        nombre: product.nombre,
        preciounitario: product.precioventa,
        productocodigo: product.id,
      },
    ]);
  };

  const resetSale = () => {
    setTotal(0);
    setProductsList([]);
  };

  useEffect(() => {
    if (productsList.length) {
      let sum = 0;
      productsList.forEach((p) => {
        sum += p.cantidad * p.preciounitario;
      });
      setTotal(sum);
    } else setTotal(0);
  }, [productsList]);

  return {
    handleAddProduct,
    loading,
    open,
    productsList,
    setOpen,
    total,
    resetSale,
  };
};
