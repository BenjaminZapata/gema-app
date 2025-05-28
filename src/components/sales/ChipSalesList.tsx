import { Box } from "@mui/material";
import React from "react";
import { AddSaleDialog } from "./AddSaleDialog";
import { ProductSaleDetailsTypes, ProductTypes } from "@/types/CommonTypes";
import { AddPaymentMethodDialog } from "./AddPaymentMethodDialog";

interface ChipSalesListTypes {
  handleAddProduct: (product: ProductTypes) => void;
  handleProductQuantityChange: (id: string, newQuantity: number) => void;
  handleSaleSubmit: () => void;
  open: boolean;
  productsList: ProductSaleDetailsTypes[];
  setOpen: (value: boolean) => void;
  total: number;
  resetSale: () => void;
}

export const ChipSalesList = ({
  handleAddProduct,
  handleProductQuantityChange,
  handleSaleSubmit,
  open,
  productsList,
  setOpen,
  total,
  resetSale,
}: ChipSalesListTypes) => {
  return (
    <Box display={"flex"} mt={2} mx={"auto"} gap={2}>
      <AddSaleDialog
        handleAddProduct={handleAddProduct}
        handleProductQuantityChange={handleProductQuantityChange}
        handleSaleSubmit={handleSaleSubmit}
        productsList={productsList}
        total={total}
        open={open}
        setOpen={setOpen}
        resetSale={resetSale}
      />
      <AddPaymentMethodDialog />
    </Box>
  );
};
