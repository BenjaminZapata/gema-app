import { ProductSaleDetailsTypes, ProductTypes } from "@/types/CommonTypes";
import { Add, Remove } from "@mui/icons-material";
import { Box, TableCell, TableRow, TextField, Typography } from "@mui/material";
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
  const [isEditingQuantity, setIsEditingQuantity] = React.useState(false);
  const [editQuantity, setEditQuantity] = React.useState(addedProduct.cantidad);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditingQuantity && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingQuantity]);

  React.useEffect(() => {
    setEditQuantity(addedProduct.cantidad);
  }, [addedProduct.cantidad]);

  const commitQuantity = () => {
    const quantity = Math.min(Math.max(1, editQuantity), stock);
    setEditQuantity(quantity);
    setIsEditingQuantity(false);
    if (quantity !== addedProduct.cantidad) {
      handleProductQuantityChange(id, quantity);
    }
  };

  const handleQuantityKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      commitQuantity();
    }
    if (event.key === "Escape") {
      setEditQuantity(addedProduct.cantidad);
      setIsEditingQuantity(false);
    }
  };

  return (
    <TableRow data-name={'addedProduct'} key={`${addedProduct.productocodigo}-added`} hover>
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
              marginTop: isEditingQuantity ? theme.spacing(1.5) : theme.spacing(0.5),
              "&:hover": {
                color: addedProduct.cantidad == 1 && theme.palette.error.main,
              },
            })}
          />
          {isEditingQuantity ? (
            <TextField
              inputRef={inputRef}
              value={editQuantity}
              onChange={(e) =>
                setEditQuantity(Number(e.target.value.replace(/[^0-9]/g, "")))
              }
              onBlur={commitQuantity}
              onKeyDown={handleQuantityKeyDown}
              size="small"
              inputProps={{
                min: 1,
                max: stock,
                style: { textAlign: "center", width: 30 },
              }}
            />
          ) : (
            <Typography
              sx={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => {
                setEditQuantity(Math.min(addedProduct.cantidad, stock));
                setIsEditingQuantity(true);
              }}
            >
              {addedProduct.cantidad}
            </Typography>
          )}
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
              marginTop: isEditingQuantity ? theme.spacing(1.5) : theme.spacing(0.5),
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
