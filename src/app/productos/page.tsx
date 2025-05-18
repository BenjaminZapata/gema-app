"use client";

import React from "react";
import { ProductList } from "@/components/products/ProductList";
import { useProductsPage } from "@/hooks/pages/useProductsPage";
import { ChipProductList } from "@/components/products/ChipProductList/ChipProductList";
import { PageSpinner } from "@/components/commons/PageSpinner";

export default function ProductsPage() {
  const {
    activeFilters,
    applyFilters,
    handlePageChange,
    loading,
    nameInput,
    page,
    productList,
    reloadData,
    setNameInput,
  } = useProductsPage();

  return (
    <>
      {loading ? (
        <PageSpinner />
      ) : (
        <>
          <ChipProductList
            activeFilters={activeFilters}
            applyFilters={applyFilters}
            nameInput={nameInput}
            reloadData={reloadData}
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
