import {
  addSale,
  deleteSale,
  getPaymentMethods,
  getSales,
} from "@/redux/slices/salesSlice";
import { getProducts } from "@/redux/slices/productsSlice";
import { ProductSaleDetailsTypes, ProductTypes } from "@/types/CommonTypes";
import { status } from "@/utils/Utils";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { useEffect, useState } from "react";

export const useSalesPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [productsList, setProductsList] = useState<ProductSaleDetailsTypes[]>(
    []
  );
  const [total, setTotal] = useState(0);
  const { statusCategories, statusProducts, statusSuppliers, products } =
    useAppSelector((state) => state.productos);
  const { statusPaymentMethods, paymentMethods, sales, statusSales } =
    useAppSelector((state) => state.ventas);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<
    number | undefined
  >(undefined);
  const dispatch = useAppDispatch();

  useEffect(() => reloadData(), []);

  useEffect(() => {
    if (
      statusCategories === status.pending ||
      statusPaymentMethods === status.pending ||
      statusProducts === status.pending ||
      statusSales === status.pending ||
      statusSuppliers === status.pending
    )
      setLoading(true);
    else setLoading(false);
  }, [
    statusCategories,
    statusPaymentMethods,
    statusProducts,
    statusSales,
    statusSuppliers,
  ]);

  useEffect(() => {
    if (productsList.length) {
      let sum = 0;
      productsList.forEach((p) => {
        sum += p.cantidad * p.preciounitario;
      });
      setTotal(sum);
    } else setTotal(0);
  }, [productsList]);

  useEffect(() => {
    if (open === false) {
      resetSale();
    }
  }, [open]);

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

  const handleSaleDelete = (id: number) => {
    try {
      dispatch(deleteSale(id));
      dispatch(getSales());
    } catch {}
  };

  const handleSaleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (productsList.length == 0 || typeof paymentMethodSelected !== "number") {
      toast.error("ERROR: no se ha agregado productos o metodo de pago");
      return;
    }
    try {
      dispatch(
        addSale({
          mediosdepago: paymentMethodSelected,
          productList: productsList,
          total: total,
        })
      );
      reloadData();
    } catch {}
  };

  const handlePaymentChange = (id: number) => {
    setPaymentMethodSelected(id);
  };

  const reloadData = () => {
    dispatch(getProducts());
    dispatch(getPaymentMethods());
    dispatch(getSales());
  };

  const resetSale = () => {
    setTotal(0);
    setProductsList([]);
    setPaymentMethodSelected(undefined);
  };

  return {
    handleAddProduct,
    handlePaymentChange,
    handleProductQuantityChange,
    handleSaleDelete,
    handleSaleSubmit,
    loading,
    open,
    paymentMethods,
    paymentMethodSelected,
    products,
    productsList,
    resetSale,
    sales,
    setOpen,
    statusPaymentMethods,
    statusSales,
    total,
  };
};
