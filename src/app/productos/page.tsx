"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { ProductList } from "@/components/products/ProductList";
import { useProductsPage } from "@/hooks/pages/useProductsPage";
import { ChipProductList } from "@/components/products/ChipProductList/ChipProductList";

export default function ProductsPage() {
  const {
    activeFilters,
    applyFilters,
    handleCategoryFilterChange,
    handleMinStockFilterChange,
    handlePageChange,
    handleSupplierFilterChange,
    loading,
    nameInput,
    page,
    productList,
    reloadData,
    resetAllFilters,
    setNameInput,
  } = useProductsPage();

  return (
    <>
      {loading ? (
        <Box margin={"auto"} width={"fit-content"}>
          <CircularProgress disableShrink sx={{ margin: "40vh auto" }} />
        </Box>
      ) : (
        <>
          <ChipProductList
            activeFilters={activeFilters}
            applyFilters={applyFilters}
            nameInput={nameInput}
            reloadData={reloadData}
            resetAllFilters={resetAllFilters}
            setNameInput={setNameInput}
          />
          <ProductList
            products={productList}
            nameInput={nameInput}
            page={page}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}
