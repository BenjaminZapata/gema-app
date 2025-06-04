"use client";

import React from "react";
import { Box } from "@mui/material";
import { PageSpinner } from "@/components/commons/PageSpinner";
import { ChipSalesList } from "@/components/sales/ChipSalesList";
import { useSalesPage } from "@/hooks/pages/useSalesPage";

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
    setOpen,
    total,
  } = useSalesPage();

  return (
    <>
      {loading ? (
        <PageSpinner />
      ) : (
        <Box display={"flex"} gap={2} mt={2}>
          <Box
            width={"70%"}
            height={"80svh"}
            sx={{
              border: "solid 1px black",
            }}
          >
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
          </Box>
          <Box
            width={"30%"}
            height={"80svh"}
            sx={{
              border: "solid 1px black",
            }}
          ></Box>
        </Box>
      )}
    </>
  );
}
