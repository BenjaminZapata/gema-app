"use client";

import React from "react";
import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChipSalesList } from "@/components/sales/ChipSalesList";
import { PageSpinner } from "@/components/commons/PageSpinner";
import { PieChartComponent } from "@/components/commons/PieChart";
import { SalesDetailsList } from "@/components/sales/SalesDetailsList";
import { useSalesPage } from "@/hooks/pages/useSalesPage";

export const SalesPage = () => {
  const {
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
    statusSales,
    total,
  } = useSalesPage();

  const theme = useTheme();
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <>
      {loading ? (
        <PageSpinner />
      ) : (
        <Box display={"flex"} justifyContent={"space-between"} mt={2}>
          <Box width={{ sm: "55%", lg: "65%" }} height={"90svh"}>
            <ChipSalesList
              handleAddProduct={handleAddProduct}
              handleProductQuantityChange={handleProductQuantityChange}
              handleSaleSubmit={handleSaleSubmit}
              open={open}
              paymentMethods={paymentMethods}
              productsList={productsList}
              setOpen={setOpen}
              total={total}
              resetSale={resetSale}
              paymentMethodSelected={paymentMethodSelected}
              handlePaymentChange={handlePaymentChange}
            />
            <SalesDetailsList
              paymentMethods={paymentMethods}
              products={products}
              sales={sales}
              statusSales={statusSales}
              handleSaleDelete={handleSaleDelete}
            />
          </Box>
          <Box width={{ sm: "40%", lg: "30%" }} height={"90svh"}>
            {isClient ? (
              <Box
                display={"flex"}
                justifyContent={"flex-start"}
                flexDirection={"column"}
                gap={2}
              >
                <Typography variant="h4">Resumen</Typography>
                <Divider sx={{ width: "90%" }} />
                <Typography variant="h6" fontWeight={300}>
                  Ventas por metodo de pago
                </Typography>
                <PieChartComponent
                  data={
                    paymentMethodChartData.length > 8
                      ? paymentMethodChartData.slice(0, 8)
                      : paymentMethodChartData
                  }
                  width={upLg ? 200 : 100}
                />
                <Typography variant="h6" fontWeight={300}>
                  Ventas por categoria de producto
                </Typography>
                <PieChartComponent
                  data={
                    productCategoryChartData.length > 8
                      ? productCategoryChartData.slice(0, 8)
                      : productCategoryChartData
                  }
                  width={upLg ? 200 : 100}
                />
                <Typography variant="h6" fontWeight={300}>
                  Ventas por producto (más vendidos)
                </Typography>
                <PieChartComponent
                  data={
                    productsChartData.length > 8
                      ? productsChartData.slice(0, 8)
                      : productsChartData
                  }
                  width={upLg ? 225 : 100}
                />
              </Box>
            ) : null}
          </Box>
        </Box>
      )}
    </>
  );
};
