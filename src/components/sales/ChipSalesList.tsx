import React from "react";
import { Box } from "@mui/material";
import { AddSaleDialog } from "./salesDialogs/AddSaleDialog";
import {
  PaymentMethodsTypes,
  ProductSaleDetailsTypes,
  ProductTypes,
} from "@/types/CommonTypes";
import { PaymentMethodsDialogs } from "./paymentMethodsDialogs/PaymentMethodsDialogs";

interface ChipSalesListTypes {
  handleAddProduct: (product: ProductTypes) => void;
  handlePaymentChange: (id: number) => void;
  handleProductQuantityChange: (id: string, newQuantity: number) => void;
  handleSaleSubmit: (e: React.FormEvent<HTMLButtonElement>) => void;
  open: boolean;
  paymentMethods: Array<PaymentMethodsTypes>;
  paymentMethodSelected: undefined | number;
  productsList: ProductSaleDetailsTypes[];
  resetSale: () => void;
  setOpen: (value: boolean) => void;
  total: number;
}

export const ChipSalesList = ({
  handleAddProduct,
  handlePaymentChange,
  handleProductQuantityChange,
  handleSaleSubmit,
  open,
  paymentMethods,
  paymentMethodSelected,
  productsList,
  setOpen,
  total,
  resetSale,
}: ChipSalesListTypes) => {
  return (
    <Box display={"flex"} gap={2} justifyContent={"flex-end"}>
      <AddSaleDialog
        handleAddProduct={handleAddProduct}
        handlePaymentChange={handlePaymentChange}
        handleProductQuantityChange={handleProductQuantityChange}
        handleSaleSubmit={handleSaleSubmit}
        open={open}
        paymentMethods={paymentMethods}
        paymentMethodSelected={paymentMethodSelected}
        productsList={productsList}
        resetSale={resetSale}
        setOpen={setOpen}
        total={total}
      />
      <PaymentMethodsDialogs paymentMethods={paymentMethods} />
    </Box>
  );
};
