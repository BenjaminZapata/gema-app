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
import { ProductSaleDetails, ProductTypes } from "@/types/CommonTypes";

interface AddSaleDialogTypes {
  handleAddProduct: (product: ProductTypes) => void;
  productsList: ProductSaleDetails[];
  total: number;
  open: boolean;
  setOpen: (value: boolean) => void;
  resetSale: () => void;
}

export const AddSaleDialog = ({
  handleAddProduct,
  productsList,
  total,
  open,
  setOpen,
  resetSale,
}: AddSaleDialogTypes) => {
  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="success" onClick={() => setOpen(true)}>
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
