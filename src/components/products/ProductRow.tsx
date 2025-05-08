// Importes de React
import { useState } from "react";
// Importes de teceros
import { Box, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { PriorityHigh, Storefront } from "@mui/icons-material";
// Importes propios
import { DeleteSupplierDialog } from "./dialogs/DeleteProductDialog";
import { ExpirationFunctionType } from "@/utils/CommonTypes";
import { ModifySupplierDialog } from "./dialogs/ModifyProductDialog";
import { ProductTypes } from "@/types/CommonTypes";
import { useAppSelector } from "@/hooks/reduxHooks";
import {
  getDate,
  getExpirationDate,
  getLastModification,
} from "@/utils/Functions";

interface ProductRowProps {
  product: ProductTypes;
}

export const ProductRow = ({ product }: ProductRowProps) => {
  const [deleteProductOpen, setDeleteProductOpen] = useState<boolean>(false);
  const [modifyProductOpen, setModifyProductOpen] = useState<boolean>(false);
  const { categories } = useAppSelector((state) => state.productos);
  const isExpired: ExpirationFunctionType = getExpirationDate(product);

  const {
    categoria,
    fechamodificacion,
    fechavencimiento,
    id,
    nombre,
    observaciones,
    preciocompra,
    precioventa,
    proveedor,
    stock,
    stockminimo,
    tiendaonline,
  } = product;

  return (
    <>
      <TableRow data-name="ProductRow">
        <TableCell sx={{ borderLeft: "none" }}>{id}</TableCell>
        <TableCell>
          <Box alignItems={"center"} display={"flex"} gap={1}>
            {" "}
            <Box
              width={"max-content"}
              sx={{ textWrap: "wrap", maxWidth: "320px" }}
            >
              {nombre}
            </Box>
            <Box alignItems={"center"} display={"flex"} gap={0.5}>
              {Number(tiendaonline) == 1 && (
                <Tooltip
                  disableInteractive
                  title={"Disponible en tienda online"}
                >
                  <Storefront fontSize="small" />
                </Tooltip>
              )}
              {fechavencimiento && isExpired.expiresSoon && (
                <Tooltip disableInteractive title={isExpired.message}>
                  <PriorityHigh color={isExpired.color} />
                </Tooltip>
              )}
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          {categories.find((c) => c.id === categoria)?.nombre}
        </TableCell>
        <TableCell>{precioventa}</TableCell>
        <TableCell>{stock}</TableCell>
        <TableCell>
          <Tooltip disableInteractive title={getDate(fechamodificacion)}>
            <Typography>{getLastModification(fechamodificacion)}</Typography>
          </Tooltip>
        </TableCell>
        <TableCell sx={(theme) => ({ width: theme.spacing(14) })}>
          <Box display={"flex"} justifyContent={"center"} gap={1}>
            <ModifySupplierDialog
              open={modifyProductOpen}
              product={product}
              setOpen={setModifyProductOpen}
            />
            <DeleteSupplierDialog
              open={deleteProductOpen}
              product={product}
              setOpen={setDeleteProductOpen}
            />
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};
