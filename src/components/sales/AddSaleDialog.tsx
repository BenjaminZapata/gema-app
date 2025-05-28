import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import React from "react";
import { ProductsList } from "./ProductsList";
import { ProductSaleDetailsTypes, ProductTypes } from "@/types/CommonTypes";

interface AddSaleDialogTypes {
  handleAddProduct: (product: ProductTypes) => void;
  handleProductQuantityChange: (id: string, newQuantity: number) => void;
  handleSaleSubmit: () => void;
  open: boolean;
  productsList: ProductSaleDetailsTypes[];
  resetSale: () => void;
  setOpen: (value: boolean) => void;
  total: number;
}

export const AddSaleDialog = ({
  handleAddProduct,
  handleProductQuantityChange,
  handleSaleSubmit,
  open,
  productsList,
  resetSale,
  setOpen,
  total,
}: AddSaleDialogTypes) => {
  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => setOpen(true)}
        sx={(theme) => ({ border: `1px solid ${theme.palette.common.black}` })}
      >
        Agregar venta
      </Button>
      <Dialog
        aria-modal
        onClose={handleDialogClose}
        open={open}
        PaperProps={{
          component: "form",
          sx: (theme) => ({
            height: "80svh",
            width: "100vw",
            minWidth: theme.spacing(50),
          }),
        }}
      >
        <DialogTitle>Agregar una venta</DialogTitle>
        <Divider />
        <DialogContent
          sx={(theme) => ({
            paddingTop: theme.spacing(1),
            paddingInline: theme.spacing(1),
          })}
        >
          <ProductsList
            handleAddProduct={handleAddProduct}
            handleProductQuantityChange={handleProductQuantityChange}
            productsList={productsList}
            total={total}
          />
        </DialogContent>
        <DialogActions
          sx={(theme) => ({
            color: theme.palette.common.black,
            display: "flex",
            justifyContent: "space-between",
          })}
        >
          <Button
            color="info"
            variant="contained"
            onClick={resetSale}
            disabled={productsList.length == 0}
          >
            Limpiar
          </Button>
          <Box>
            <Button onClick={handleDialogClose} color="inherit">
              Cancelar
            </Button>
            <Button
              color="success"
              disabled={productsList.length == 0}
              onClick={handleSaleSubmit}
              type="submit"
              variant="contained"
            >
              Agregar
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};
