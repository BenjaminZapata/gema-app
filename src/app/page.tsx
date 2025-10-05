"use client";

import { PageSpinner } from "@/components/commons/PageSpinner";
import { PieChartComponent } from "@/components/commons/PieChart";
import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSalesData } from "./ventas/SalesContext";
import { useEffect, useState } from "react";

export const HomePage = () => {
  const {
    paymentMethodChartData,
    productCategoryChartData,
    productsChartData,
  } = useSalesData();

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
      {false ? (
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
          >
            {isClient && (
              <>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={300}>
                    Ventas por método de pago
                  </Typography>
                  <PieChartComponent
                    data={paymentMethodChartData}
                    width={upLg ? 200 : 150}
                  />
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={300}>
                    Ventas por categoría
                  </Typography>
                  <PieChartComponent
                    data={productCategoryChartData}
                    width={upLg ? 200 : 150}
                  />
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight={300}>
                    Productos más vendidos
                  </Typography>
                  <PieChartComponent
                    data={productsChartData}
                    width={upLg ? 225 : 150}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};
