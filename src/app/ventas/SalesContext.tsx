"use client";

import { useAppSelector } from "@/hooks/reduxHooks";
import { PieChartDataTypes, ProductTypes } from "@/types/CommonTypes";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Interfaz que define la forma de los datos y funciones
 * que proveerá nuestro contexto de ventas.
 */
interface SalesContextType {
  paymentMethodChartData: Array<PieChartDataTypes>;
  productCategoryChartData: Array<PieChartDataTypes>;
  productsChartData: Array<PieChartDataTypes>;
}

/**
 * Creamos el contexto con un valor inicial de `null`.
 * Lanzaremos un error si se intenta usar fuera del proveedor.
 */
const SalesContext = createContext<SalesContextType | undefined>(undefined);

/**
 * Hook personalizado para consumir el contexto de ventas de forma segura.
 */
export const useSalesData = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error("useSalesData debe ser usado dentro de un SalesProvider");
  }
  return context;
};

/**
 * El componente proveedor que encapsulará la lógica de ventas.
 * @param children Los componentes hijos que tendrán acceso al contexto.
 */
export const SalesDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Selección de datos del estado de Redux para productos, categorías y proveedores.
  const { categories, products } = useAppSelector((state) => state.productos);
  // Selección de datos del estado de Redux para ventas y métodos de pago.
  const { paymentMethods, sales } = useAppSelector((state) => state.ventas);
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

  // Función para procesar los datos de ventas y agruparlos por producto.
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

  // Memoriza el valor del contexto para evitar renders innecesarios.
  const contextValue = useMemo(
    () => ({
      paymentMethodChartData,
      productCategoryChartData,
      productsChartData,
    }),
    [paymentMethodChartData, productCategoryChartData, productsChartData]
  );

  return (
    <SalesContext.Provider value={contextValue}>
      {children}
    </SalesContext.Provider>
  );
};
