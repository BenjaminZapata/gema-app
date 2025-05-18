import { Box } from "@mui/material";
import React from "react";
import { AddSaleDialog } from "./AddSaleDialog";
import { ProductSaleDetails, ProductTypes } from "@/types/CommonTypes";

interface ChipSalesListTypes {
  handleAddProduct: (product: ProductTypes) => void;
  open: boolean;
  productsList: ProductSaleDetails[];
  setOpen: (value: boolean) => void;
  total: number;
  resetSale: () => void;
}

export const ChipSalesList = ({
  handleAddProduct,
  open,
  productsList,
  setOpen,
  total,
  resetSale,
}: ChipSalesListTypes) => {
  return (
    <Box display={"flex"} mt={2} mx={"auto"}>
      <AddSaleDialog
        handleAddProduct={handleAddProduct}
        productsList={productsList}
        total={total}
        open={open}
        setOpen={setOpen}
        resetSale={resetSale}
      />
    </Box>
  );
};
