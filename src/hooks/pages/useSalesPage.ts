import { ProductSaleDetailsTypes, ProductTypes } from "@/types/CommonTypes";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import {
  getCategories,
  getProducts,
  getSuppliers,
} from "@/redux/slices/productsSlice";
import { status } from "@/utils/Utils";
import { toast } from "sonner";
import { getPaymentMethods } from "@/redux/slices/paymentMethodsSlice";

export const useSalesPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [productsList, setProductsList] = useState<ProductSaleDetailsTypes[]>(
    []
  );
  const [total, setTotal] = useState(0);
  const { statusCategories, statusProducts, statusSuppliers } = useAppSelector(
    (state) => state.productos
  );
  const { statusPaymentMethods, paymentMethods } = useAppSelector(
    (state) => state.metodosdepago
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getSuppliers());
    dispatch(getProducts());
    dispatch(getPaymentMethods());
  }, [dispatch]);

  useEffect(() => {
    if (
      statusCategories === status.pending ||
      statusProducts === status.pending ||
      statusSuppliers === status.pending ||
      statusPaymentMethods === status.pending
    )
      setLoading(true);
    else setLoading(false);
  }, [statusCategories, statusProducts, statusSuppliers, statusPaymentMethods]);

  useEffect(() => {
    if (productsList.length) {
      let sum = 0;
      productsList.forEach((p) => {
        sum += p.cantidad * p.preciounitario;
      });
      setTotal(sum);
    } else setTotal(0);
  }, [productsList]);

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

  const handleProductQuantityChange = (id: string, newQuantity: number) => {
    let updatedProducts = [];
    if (newQuantity == 0) {
      updatedProducts = productsList.filter(
        (product) => product.productocodigo != id
      );
      const nombre =
        productsList.find((p) => p.productocodigo == id)?.nombre ?? "";
      toast.info(`Se borro ${nombre}`);
    } else {
      updatedProducts = productsList.map((product) =>
        product.productocodigo === id
          ? { ...product, cantidad: newQuantity }
          : product
      );
    }
    setProductsList(updatedProducts);
  };

  const handleSaleSubmit = () => {
    // dispatch({});
  };

  const resetSale = () => {
    setTotal(0);
    setProductsList([]);
  };

  return {
    handleAddProduct,
    handleProductQuantityChange,
    handleSaleSubmit,
    loading,
    open,
    paymentMethods,
    productsList,
    resetSale,
    setOpen,
    statusPaymentMethods,
    total,
  };
};
