"use client";

import React from "react";
import { Box } from "@mui/material";
import { PageSpinner } from "@/components/commons/PageSpinner";
import { ChipSalesList } from "@/components/sales/ChipSalesList";
import { useSalesPage } from "@/hooks/pages/useSalesPage";
import { SalesDetailsList } from "@/components/sales/SalesDetailsList";

export default function GastosPage() {
  const {
    handleAddProduct,
    handlePaymentChange,
    handleProductQuantityChange,
    handleSaleSubmit,
    loading,
    open,
    paymentMethods,
    paymentMethodSelected,
    productsList,
    resetSale,
    sales,
    setOpen,
    statusSales,
    total,
  } = useSalesPage();

  return (
    <>
      {loading ? (
        <PageSpinner />
      ) : (
        <Box display={"flex"} gap={2} mt={2}>
          <Box width={"70%"} height={"90svh"}>
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
            <SalesDetailsList sales={sales} statusSales={statusSales} />
          </Box>
          <Box width={"30%"} height={"90svh"}></Box>
        </Box>
      )}
    </>
  );
}
