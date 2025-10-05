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
} from "@/types/CommonTypes";
import { status } from "@/utils/Utils";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { useEffect, useState } from "react";

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
  // Estado para almacenar los datos procesados para el gráfico de torta de métodos de pago.
  const [paymentMethodChartData, setPaymentMethodChartData] = useState<
    Array<PieChartDataTypes>
  >([]);
  // Estado para almacenar los datos procesados para el gráfico de torta de ventas por categoría de producto.
  const [productCategoryChartData, setProductCategoryChartData] = useState<
    Array<PieChartDataTypes>
  >([]);
  // Estado para almacenar los datos procesados para el gráfico de torta de ventas por producto (más vendidos).
  const [productsChartData, setProductsChartData] = useState<
    Array<PieChartDataTypes>
  >([]);

  // Selección de datos del estado de Redux para productos, categorías y proveedores.
  const {
    categories,
    products,
    statusCategories,
    statusProducts,
    statusSuppliers,
  } = useAppSelector((state) => state.productos);
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

  // Efecto para procesar y actualizar los datos de los gráficos cuando las ventas o los métodos de pago cambian.
  useEffect(() => {
    if (sales.length && paymentMethods.length) {
      const data = processDataByPaymentMethod();
      setPaymentMethodChartData(data);
      if (products.length) {
        const dataByProduct = processDataByProducts();
        setProductsChartData(dataByProduct);
        const dataByCategory = processDataByProductCategory();
        setProductCategoryChartData(dataByCategory);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales, paymentMethods]);

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
   * Procesa los datos de ventas para agruparlos por método de pago.
   * @returns {Array<PieChartDataTypes>} Un array de objetos formateados para el gráfico de torta.
   */
  const processDataByPaymentMethod = () => {
    if (sales.length === 0 || paymentMethods.length === 0) return [];
    const data = paymentMethods.map((method) => {
      const salesByMethod = sales.filter(
        (sale) => sale.mediosdepago == Number(method.id)
      );
      const totalByMethod = salesByMethod.reduce(
        (acc, sale) => acc + sale.total,
        0
      );
      return {
        id: Number(method.id),
        label: method.nombre,
        value: totalByMethod,
      };
    });
    return data;
  };

  /**
   * Procesa los datos de ventas para agruparlos por categoría de producto.
   * @returns {Array<PieChartDataTypes>} Un array de objetos formateados para el gráfico de torta,
   * o un array vacío si no hay productos o categorías.
   */
  const processDataByProductCategory = () => {
    if (products.length === 0 || categories.length === 0 || sales.length === 0)
      return [];
    const categoriesArray = Array.from(
      new Set(products.map((product) => product.categoria))
    );
    const data = categoriesArray.map((category) => {
      const productsInCategory = products.filter(
        (product) => product.categoria === category
      );
      const salesInCategory = sales.filter((sale) =>
        sale.detalles?.some((detail) =>
          productsInCategory.some(
            (product) => product.id === detail.productocodigo
          )
        )
      );
      const totalByCategory = salesInCategory.reduce(
        (acc, sale) => acc + sale.total,
        0
      );
      return {
        id: category,
        label:
          categories.find((cat) => cat.id === category)?.nombre ||
          String(category),
        value: totalByCategory,
      };
    });
    return data;
  };

  // funcion para generar data de grafico por producto mas vendido
  const processDataByProducts = () => {
    if (products.length === 0 || sales.length === 0) return [];
    const productIds = Array.from(
      new Set(products.map((product) => product.id))
    );
    const data = productIds.map((productId) => {
      const salesWithProduct = sales.filter((sale) =>
        sale.detalles?.some((detail) => detail.productocodigo === productId)
      );
      const totalUnitsSold = salesWithProduct.reduce((acc, sale) => {
        const productDetails = sale.detalles?.filter(
          (detail) => detail.productocodigo === productId
        );
        const productUnits = productDetails?.reduce(
          (sum, detail) => sum + detail.cantidad,
          0
        );
        return acc + (productUnits || 0);
      }, 0);

      const totalByProduct = salesWithProduct.reduce((acc, sale) => {
        const productDetails = sale.detalles?.filter(
          (detail) => detail.productocodigo === productId
        );
        const productTotal = productDetails?.reduce(
          (sum, detail) => sum + detail.cantidad * detail.preciounitario,
          0
        );
        return acc + (productTotal || 0);
      }, 0);

      const productName = products.find(
        (product: ProductTypes) => product.id === productId
      )?.nombre;

      return {
        id: Number(productId),
        label: productName
          ? `${
              productName && productName.length > 30
                ? productName?.substring(0, 27) + "..."
                : productName
            } (${totalUnitsSold})`
          : String(productId),
        value: totalByProduct,
      };
    });
    return data;
  };

  return {
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
