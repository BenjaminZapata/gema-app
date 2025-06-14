// Importes de React
import { useState } from "react";
// Importes de teceros
import { Box, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { PriorityHigh, Storefront, Warning } from "@mui/icons-material";
// Importes propios
import { DeleteSupplierDialog } from "./dialogs/DeleteProductDialog";
import { ExpirationFunctionTypes, ProductTypes } from "@/types/CommonTypes";
import { useAppSelector } from "@/hooks/reduxHooks";
import {
  getDate,
  getExpirationDate,
  getLastModification,
} from "@/utils/Functions";
import { ModifyProductDialog } from "./dialogs/ModifyProductDialog";
import { ProductInfo } from "./ProductInfo";

interface ProductRowProps {
  product: ProductTypes;
}

export const ProductRow = ({ product }: ProductRowProps) => {
  const [deleteProductOpen, setDeleteProductOpen] = useState<boolean>(false);
  const [modifyProductOpen, setModifyProductOpen] = useState<boolean>(false);
  const { categories, suppliers } = useAppSelector((state) => state.productos);
  const isExpired:  ExpirationFunctionTypes = getExpirationDate(product);

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
      <TableRow
        hover
        data-name="ProductRow"
        sx={(theme) => ({
          "& .MuiTableCell-root": {
            borderBottom: "none",
            color:
              stock == 0
                ? theme.palette.text.disabled
                : theme.palette.common.black,
          },
        })}
      >
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
              {Number(tiendaonline) == 1 ? (
                <Tooltip
                  disableInteractive
                  title={"Disponible en tienda online"}
                >
                  <Storefront fontSize="small" color="success" />
                </Tooltip>
              ) : null}
              {fechavencimiento && isExpired.expiresSoon ? (
                <Tooltip disableInteractive title={isExpired.message}>
                  <PriorityHigh fontSize="small" color={isExpired.color} />
                </Tooltip>
              ) : null}
              {stockminimo >= stock ? (
                <Tooltip
                  disableInteractive
                  title={stock == 0 ? "Sin stock" : "Stock bajo"}
                >
                  <Warning
                    color={stock == 0 ? "error" : "warning"}
                    fontSize="small"
                  />
                </Tooltip>
              ) : null}
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          {categories.find((c) => c.id === categoria)?.nombre}
        </TableCell>
        <TableCell sx={{ textAlign: "center" }}>$ {precioventa}</TableCell>
        <TableCell sx={{ textAlign: "center" }}>{stock}</TableCell>
        <TableCell>
          {fechamodificacion && (
            <Tooltip
              disableInteractive
              title={getDate(String(fechamodificacion))}
            >
              <Typography fontSize={"14px"}>
                {getLastModification(String(fechamodificacion))}
              </Typography>
            </Tooltip>
          )}
        </TableCell>
        <TableCell sx={(theme) => ({ width: theme.spacing(14) })}>
          <Box display={"flex"} justifyContent={"center"} gap={1}>
            <ModifyProductDialog
              open={modifyProductOpen}
              product={product}
              setOpen={setModifyProductOpen}
            />
            <ProductInfo
              observaciones={observaciones}
              preciocompra={preciocompra}
              proveedor={proveedor}
              suppliers={suppliers}
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
