"use client";

import { PageSpinner } from "@/components/commons/PageSpinner";
import { PieChartComponent } from "@/components/commons/PieChart";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSalesData } from "./ventas/SalesContext";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/reduxHooks";
import {
  getCategories,
  getProducts,
  getSuppliers,
} from "@/redux/slices/productsSlice";
import { getPaymentMethods, getSales } from "@/redux/slices/salesSlice";
import { toast } from "sonner";
import { PieChartDataTypes } from "@/types/CommonTypes";

export default function HomePage() {
  const {
    paymentMethodChartData: paymentMethodData,
    productCategoryChartData: productCategoryData,
    productsChartData: productsData,
  } = useSalesData();

  //! Dispatch actions - Llamadas a API
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  // Efecto para hacer las llamadas a la API solo una vez al montar el componente.
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getCategories());
        await dispatch(getSuppliers());
        await dispatch(getProducts());
        await dispatch(getSales());
        await dispatch(getPaymentMethods());

        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Ocurrió un error desconocido");
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Estado para almacenar los datos procesados para el gráfico de torta de métodos de pago.
  const [paymentMethodChartData, setPaymentMethodChartData] =
    useState<Array<PieChartDataTypes>>(paymentMethodData);
  // Estado para almacenar los datos procesados para el gráfico de torta de ventas por categoría de producto.
  const [productCategoryChartData, setProductCategoryChartData] =
    useState<Array<PieChartDataTypes>>(productCategoryData);
  // Estado para almacenar los datos procesados para el gráfico de torta de ventas por producto (más vendidos).
  const [productsChartData, setProductsChartData] =
    useState<Array<PieChartDataTypes>>(productsData);

  // Efecto para actualizar los datos de los gráficos cuando los datos del contexto cambian.
  useEffect(() => {
    if (paymentMethodData.length > 0)
      setPaymentMethodChartData(paymentMethodData);
    if (productCategoryData.length > 0)
      setProductCategoryChartData(productCategoryData);
    if (productsData.length > 0) setProductsChartData(productsData);
  }, [paymentMethodData, productCategoryData, productsData]);

  // Estado para saber si el componente ya se ha montado en el cliente. Útil para evitar errores de hidratación.
  const [isClient, setIsClient] = useState(false);

  // Efecto para establecer isClient a true una vez que el componente se monta en el cliente.
  useEffect(() => {
    setIsClient(true);
  }, []);

  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <>
      {loading ? (
        <PageSpinner />
      ) : (
        <Box p={3}>
          <Typography variant="h4" gutterBottom>
            Dashboard General
          </Typography>
          <Box
            display={"flex"}
            flexWrap={"wrap"}
            gap={4}
            justifyContent={"center"}
            alignItems={"flex-start"}
            width={"100%"}
          >
            {isClient && (
              <Box
                sx={(theme) => ({
                  display: "flex",
                  justifyContent: "center",
                  gap: 4,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[1],
                  borderRadius: 2,
                  p: 2,
                  width: "100%",
                })}
              >
                <Box textAlign="left" width={"30%"}>
                  <Typography variant="h6" mb={2} fontWeight={300}>
                    Ventas por método de pago
                  </Typography>
                  <PieChartComponent
                    data={paymentMethodChartData}
                    width={upLg ? 200 : 150}
                  />
                </Box>
                <Box textAlign="left" width={"30%"}>
                  <Typography variant="h6" mb={2} fontWeight={300}>
                    Ventas por categoría
                  </Typography>
                  <PieChartComponent
                    data={productCategoryChartData}
                    width={upLg ? 200 : 150}
                  />
                </Box>
                <Box textAlign="left" width={"30%"}>
                  <Typography variant="h6" mb={2} fontWeight={300}>
                    Productos más vendidos
                  </Typography>
                  <PieChartComponent
                    data={productsChartData}
                    width={upLg ? 200 : 150}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
