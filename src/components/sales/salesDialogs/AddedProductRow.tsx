import { ProductSaleDetailsTypes, ProductTypes } from "@/types/CommonTypes";
import { Add, Remove } from "@mui/icons-material";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import React from "react";

interface AddedProductRowTypes {
  addedProduct: ProductSaleDetailsTypes;
  handleProductQuantityChange: (id: string, newQuantity: number) => void;
  productData: ProductTypes | undefined;
}

export const AddedProductRow = ({
  addedProduct,
  handleProductQuantityChange,
  productData,
}: AddedProductRowTypes) => {
  if (!productData) return;

  const { stock, id } = productData;

  return (
    <TableRow key={`${addedProduct.productocodigo}-added`} hover>
      <TableCell>{addedProduct.productocodigo}</TableCell>
      <TableCell>{addedProduct.nombre}</TableCell>
      <TableCell>
        <Box
          alignContent={"center"}
          display={"flex"}
          gap={0.5}
          justifyContent={"center"}
        >
          <Remove
            onClick={() =>
              handleProductQuantityChange(id, addedProduct.cantidad - 1)
            }
            sx={(theme) => ({
              fontSize: theme.spacing(2),
              cursor: "pointer",
              marginTop: theme.spacing(0.5),
              "&:hover": {
                color: addedProduct.cantidad == 1 && theme.palette.error.main,
              },
            })}
          />
          <Typography>{addedProduct.cantidad}</Typography>
          <Add
            onClick={() => {
              if (stock == addedProduct.cantidad) return;
              handleProductQuantityChange(id, addedProduct.cantidad + 1);
            }}
            sx={(theme) => ({
              fontSize: theme.spacing(2),
              color:
                stock != addedProduct.cantidad
                  ? theme.palette.common.black
                  : theme.palette.others.light,
              cursor: stock != addedProduct.cantidad ? "pointer" : "default",
              marginTop: theme.spacing(0.5),
            })}
          />
        </Box>
      </TableCell>
      <TableCell>
        $ {addedProduct.cantidad * addedProduct.preciounitario}
      </TableCell>
    </TableRow>
  );
};
