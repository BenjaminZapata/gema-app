"use client";

import { PageSpinner } from "@/components/commons/PageSpinner";
import { ChipSalesList } from "@/components/sales/ChipSalesList";
import { useSalesPage } from "@/hooks/pages/useSalesPage";
import React from "react";

export default function GastosPage() {
  const {
    handleAddProduct,
    loading,
    open,
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
        <>
          <ChipSalesList
            handleAddProduct={handleAddProduct}
            open={open}
            productsList={productsList}
            setOpen={setOpen}
            total={total}
            resetSale={resetSale}
          />
        </>
      )}
    </>
  );
}
