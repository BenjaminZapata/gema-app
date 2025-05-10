"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { ProductList } from "@/components/products/ProductList";
import { useProductsPage } from "@/hooks/pages/useProductsPage";
import { ChipProductList } from "@/components/products/ChipProductList/ChipProductList";

export default function ProductsPage() {
  const {
    filterInputValue,
    handlePageChange,
    loading,
    page,
    productList,
    reloadData,
    setFilterInputValue,
    setProductList,
  } = useProductsPage();

  return (
    <>
      {loading ? (
        <Box margin={"auto"} width={"fit-content"}>
          <CircularProgress sx={{ margin: "40vh auto" }} />
        </Box>
      ) : (
        <>
          <ChipProductList
            inputValue={filterInputValue}
            productList={productList}
            reloadData={reloadData}
            setInputValue={setFilterInputValue}
            setProductList={setProductList}
          />
          <ProductList
            products={productList}
            filterByNameValue={filterInputValue}
            page={page}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}
