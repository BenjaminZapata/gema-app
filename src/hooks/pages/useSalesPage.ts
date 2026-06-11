import {
  addSale,
  deleteSale,
  getPaymentMethods,
  getSales,
} from "@/redux/slices/salesSlice";
import { getCategories, getProducts } from "@/redux/slices/productsSlice";
import {
  PieChartDataTypes,
  ProductSaleDetailsTypes,
  ProductTypes,
  SalesTypes,
} from "@/types/CommonTypes";
import { status } from "@/utils/Utils";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { useEffect, useMemo, useState } from "react";
import { useSalesData } from "@/app/ventas/SalesContext";

/**
 * Hook personalizado para manejar la lógica de la página de ventas.
 * Gestiona el estado local, la interacción con Redux para obtener y manipular datos de ventas,
 * productos, categorías y métodos de pago, y procesa datos para visualizaciones.
 * @returns Un objeto con el estado y las funciones necesarias para la página de ventas.
 */
export const useSalesPage = () => {
  // Estado para saber si el componente ya se ha montado en el cliente. Útil para evitar errores de hidratación.
  const [isClient, setIsClient] = useState(false);

  // Efecto para establecer isClient a true una vez que el componente se monta en el cliente.
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    paymentMethodChartData: paymentMethodData,
    productCategoryChartData: productCategoryData,
    productsChartData: productsData,
  } = useSalesData();

  // Estado para controlar la visibilidad del indicador de carga.
  const [loading, setLoading] = useState<boolean>(false);
  // Estado para controlar la visibilidad del modal de "Añadir Venta".
  const [open, setOpen] = useState<boolean>(false);
  // Estado para almacenar la lista de productos que se están agregando a la venta actual.
  const [productsList, setProductsList] = useState<ProductSaleDetailsTypes[]>(
    []
  );
  // Estado para el total monetario de la venta actual.
  const [total, setTotal] = useState(0);
  // Estado para la cantidad de meses que se deben mostrar en el gráfico de barras.
  const [monthsToShow, setMonthsToShow] = useState(3);
  // Estado para almacenar los datos procesados para el gráfico de torta de métodos de pago.
  const [paymentMethodChartData, setPaymentMethodChartData] =
    useState<Array<PieChartDataTypes>>(paymentMethodData);
  // Estado para almacenar los datos procesados para el gráfico de torta de ventas por categoría de producto.
  const [productCategoryChartData, setProductCategoryChartData] =
    useState<Array<PieChartDataTypes>>(productCategoryData);
  // Estado para almacenar los datos procesados para el gráfico de torta de ventas por producto (más vendidos).
  const [productsChartData, setProductsChartData] =
    useState<Array<PieChartDataTypes>>(productsData);

  // Selección de datos del estado de Redux para productos, categorías y proveedores.
  const { products, statusCategories, statusProducts, statusSuppliers } =
    useAppSelector((state) => state.productos);
  // Selección de datos del estado de Redux para ventas y métodos de pago.
  const { statusPaymentMethods, paymentMethods, sales, statusSales } =
    useAppSelector((state) => state.ventas);
  // Estado para el método de pago seleccionado en la venta actual.
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<
    number | undefined
  >(undefined);
  // Hook para despachar acciones de Redux.
  const dispatch = useAppDispatch();

  // Efecto para cargar los datos iniciales (métodos de pago, categorías y productos) cuando el componente se monta.
  useEffect(() => {
    dispatch(getPaymentMethods());
    dispatch(getCategories());
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efecto para gestionar el estado de carga global basado en el estado de las diferentes llamadas a la API.
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

  const normalizeDate = (value: string | Date) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getSalesForToday = () => {
    const today = normalizeDate(new Date());
    return sales.filter(
      (sale) => normalizeDate(sale.fecha).getTime() === today.getTime()
    );
  };

  const sumSalesTotal = (salesToSum: SalesTypes[]) =>
    salesToSum.reduce((sum, sale) => sum + sale.total, 0);

  const buildPaymentMethodTotals = (salesToGroup: SalesTypes[]) => {
    const totals = new Map<number, number>();
    salesToGroup.forEach((sale) => {
      totals.set(
        sale.mediosdepago,
        (totals.get(sale.mediosdepago) ?? 0) + sale.total
      );
    });
    return totals;
  };

  // Efecto para recalcular el total de la venta cada vez que la lista de productos cambia.
  useEffect(() => {
    if (productsList.length) {
      let sum = 0;
      productsList.forEach((p) => {
        sum += p.cantidad * p.preciounitario;
      });
      setTotal(sum);
    } else setTotal(0);
  }, [productsList]);

  // Efecto para limpiar el estado de la venta actual cuando el modal se cierra.
  useEffect(() => {
    if (open === false) {
      resetSale();
    }
  }, [open]);

  // Efecto para actualizar los datos de los gráficos cuando los datos del contexto cambian.
  useEffect(() => {
    if (paymentMethodData.length > 0)
      setPaymentMethodChartData(paymentMethodData);
    if (productCategoryData.length > 0)
      setProductCategoryChartData(productCategoryData);
    if (productsData.length > 0) setProductsChartData(productsData);
  }, [paymentMethodData, productCategoryData, productsData]);

  /**
   * Añade un producto a la lista de la venta actual.
   * Evita agregar duplicados y muestra una notificación de error si el producto ya está en la lista.
   * @param {ProductTypes} product - El producto a añadir.
   */
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

  /**
   * Cambia la cantidad de un producto en la lista de la venta actual.
   * Si la nueva cantidad es 0, el producto se elimina de la lista.
   * @param {string} id - El código del producto a modificar.
   * @param {number} newQuantity - La nueva cantidad del producto.
   */
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

  /**
   * Maneja la eliminación de una venta.
   * @param {number} id - El ID de la venta a eliminar.
   */
  const handleSaleDelete = (id: number) => {
    try {
      dispatch(deleteSale(id));
      dispatch(getSales());
    } catch {}
  };

  /**
   * Maneja el envío del formulario de una nueva venta.
   * Valida que haya productos y un método de pago seleccionado antes de despachar la acción.
   * @param {React.FormEvent<HTMLButtonElement>} e - El evento del formulario.
   */
  const handleSaleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (productsList.length == 0 || typeof paymentMethodSelected !== "number") {
      toast.error("ERROR: no se ha agregado productos o metodo de pago");
      return;
    }
    try {
      await dispatch(
        addSale({
          mediosdepago: paymentMethodSelected,
          productList: productsList,
          total: total,
        })
      );
      setOpen(false);
      reloadData();
    } catch {}
  };

  /**
   * Actualiza el método de pago seleccionado.
   * @param {number} id - El ID del método de pago seleccionado.
   */
  const handlePaymentChange = (id: number) => {
    setPaymentMethodSelected(id);
  };

  /**
   * Recarga los datos de productos y ventas desde el servidor.
   */
  const reloadData = () => {
    dispatch(getProducts());
    dispatch(getSales());
  };

  /**
   * Resetea el estado de la venta actual, limpiando el total, la lista de productos
   * y el método de pago seleccionado.
   */
  const resetSale = () => {
    setTotal(0);
    setProductsList([]);
    setPaymentMethodSelected(undefined);
  };

  /**
   * Calcula el total de ventas del día actual.
   * @returns {number} El total de ventas del día actual.
   */
  const getDayTotal = (): number => sumSalesTotal(getSalesForToday());

  /**
   * Calcula el total de ventas del día actual discriminado por método de pago.
   * @returns {Array} Array de objetos con id, nombre y total de cada método de pago usado hoy.
   */
  const getDayTotalByPaymentMethod = (): Array<{ id: number | string; nombre: string; total: number }> => {
    const totals = buildPaymentMethodTotals(getSalesForToday());
    return paymentMethods
      .filter((method) => totals.has(Number(method.id)))
      .map((method) => ({
        id: method.id,
        nombre: method.nombre,
        total: totals.get(Number(method.id)) ?? 0,
      }));
  };

  const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

  const getMonthLabels = (count: number) => {
    const today = new Date();
    return Array.from({ length: count }, (_, index) => {
      const offset = count - 1 - index;
      const monthDate = new Date(today.getFullYear(), today.getMonth() - offset, 1);
      return {
        key: getMonthKey(monthDate),
        label: monthDate.toLocaleString("es-ES", {
          month: "long",
          year: "numeric",
        }),
      };
    });
  };

  const {
    barChartData,
    barChartSeries,
    barChartMonthTotals,
  } = useMemo(() => {
    const months = getMonthLabels(monthsToShow);
    const validKeys = new Set(months.map((month) => month.key));
    const monthTotals: Record<string, number> = {};
    const monthPaymentMethodTotals: Record<string, Record<string, number>> = {};

    sales.forEach((sale) => {
      const saleKey = getMonthKey(new Date(sale.fecha));
      if (!validKeys.has(saleKey)) return;

      monthTotals[saleKey] = (monthTotals[saleKey] ?? 0) + sale.total;
      const paymentId = String(sale.mediosdepago);
      monthPaymentMethodTotals[saleKey] =
        monthPaymentMethodTotals[saleKey] ?? {};
      monthPaymentMethodTotals[saleKey][paymentId] =
        (monthPaymentMethodTotals[saleKey][paymentId] ?? 0) + sale.total;
    });

    const data = months.map(({ key, label }) => ({
      month: label,
      ...paymentMethods.reduce<Record<string, unknown>>((row, method) => {
        row[`pm_${method.id}`] =
          monthPaymentMethodTotals[key]?.[String(method.id)] ?? 0;
        return row;
      }, {}),
    }));

    const series = paymentMethods.map((method) => ({
      dataKey: `pm_${method.id}`,
      label: method.nombre,
      stack: "payments",
      valueFormatter: (value: number | string | null) =>
        typeof value === "number" ? `$${value.toFixed(2)}` : "",
    }));

    const totalsByLabel = months.reduce<Record<string, number>>(
      (acc, { key, label }) => {
        acc[label] = monthTotals[key] ?? 0;
        return acc;
      },
      {}
    );

    return {
      barChartData: data,
      barChartSeries: series,
      barChartMonthTotals: totalsByLabel,
    };
  }, [sales, paymentMethods, monthsToShow]);

  return {
    getDayTotal,
    getDayTotalByPaymentMethod,
    barChartData,
    barChartSeries,
    barChartMonthTotals,
    monthsToShow,
    setMonthsToShow,
    handleAddProduct,
    handlePaymentChange,
    handleProductQuantityChange,
    handleSaleDelete,
    handleSaleSubmit,
    isClient,
    loading,
    open,
    paymentMethodChartData,
    paymentMethods,
    paymentMethodSelected,
    productCategoryChartData,
    products,
    productsChartData,
    productsList,
    resetSale,
    sales,
    setOpen,
    statusPaymentMethods,
    statusSales,
    total,
  };
};
