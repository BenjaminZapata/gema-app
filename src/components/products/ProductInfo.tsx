import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import { ProductRowButton } from "./ProductRowButton";
import { Info } from "@mui/icons-material";
import { SupplierTypes } from "@/types/CommonTypes";

interface ProductInfoTypes {
  suppliers: Array<SupplierTypes>;
  preciocompra: number;
  observaciones: string | null | undefined;
  proveedor: number;
}

export const ProductInfo = ({
  suppliers,
  preciocompra,
  observaciones,
  proveedor,
}: ProductInfoTypes) => {
  return (
    <Tooltip
      disableInteractive
      enterDelay={250}
      title={
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <Typography variant="subtitle2">Costo: ${preciocompra}</Typography>
          <Typography variant="subtitle2">
            Producto de {suppliers.find((sup) => sup.id == proveedor)?.nombre}
          </Typography>
          {observaciones ? (
            <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>
              &#34;{observaciones}&#34;
            </Typography>
          ) : null}
        </Box>
      }
    >
      <ProductRowButton variant="contained" color="warning">
        <Info />
      </ProductRowButton>
    </Tooltip>
  );
};
