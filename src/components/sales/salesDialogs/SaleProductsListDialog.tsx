import { ProductTypes } from "@/types/CommonTypes";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { SaleProductDetail } from "../SaleProductDetail";

interface SaleProductsListDialogTypes {
  details: Array<{
    cantidad: number;
    id: number;
    preciounitario: number;
    productocodigo: string;
  }>;
  products: ProductTypes[];
  saleId: number;
}

export const SaleProductsListDialog = ({
  details,
  products,
  saleId,
}: SaleProductsListDialogTypes) => {
  const [open, setOpen] = useState(false);
  const handleDialogClose = () => setOpen(false);

  return (
    <>
      <Button size="small" onClick={() => setOpen(true)}>
        Ver todos los productos
      </Button>
      <Dialog
        aria-modal
        onClose={handleDialogClose}
        open={open}
        PaperProps={{
          sx: (theme) => ({
            minWidth: theme.spacing(50),
          }),
        }}
      >
        <DialogTitle>Productos vendidos</DialogTitle>
        <Divider />
        <DialogContent
          sx={(theme) => ({
            display: "flex",
            flexWrap: "wrap",
            paddingTop: theme.spacing(1),
            paddingInline: theme.spacing(1),
          })}
        >
          {details.map((d) => {
            const productData = products.find((p) => p.id == d.productocodigo);
            if (!productData) return;
            const { nombre } = productData;

            return (
              <Box key={`${saleId}-${d.id}-modal`} width={"50%"}>
                <SaleProductDetail detail={d} name={nombre} isModal />
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions
          sx={(theme) => ({
            color: theme.palette.common.black,
            display: "flex",
            justifyContent: "flex-end",
          })}
        >
          <Button onClick={handleDialogClose} color="error" variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
