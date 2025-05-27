import React from "react";
import { ProductTypes } from "@/types/CommonTypes";
import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ProductRow } from "./ProductRow";

export const ProductList = ({
  nameInput,
  handlePageChange,
  page,
  products,
}: {
  nameInput: string;
  handlePageChange: (event: unknown, data: number) => void;
  page: number;
  products: Array<ProductTypes>;
}) => {
  const columnNames = [
    "ID",
    "Nombre",
    "Categoría",
    "Precio",
    "Stock",
    "Última modificación",
    "Acciones",
  ];

  return (
    <Box data-name="ProductsList" mt={3}>
      <Box minHeight={487}>
        <TableContainer
          sx={(theme) => ({
            background: theme.palette.common.white,
            border: `solid 1px ${theme.palette.others.light}`,
            borderRadius: theme.spacing(1),
            margin: "auto",
            padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
            width: "95%",
          })}
        >
          <Table sx={{ borderCollapse: "separate", borderSpacing: "0 .2em" }}>
            <TableHead>
              <TableRow>
                {columnNames.map((column) => (
                  <TableCell key={column + "-tableHead"}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.length > 0 ? (
                products
                  .slice((page - 1) * 10, page * 10)
                  .map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ borderLeft: "none" }}>
                    <Typography m={3} fontWeight={300} textAlign={"center"}>
                      {nameInput.length
                        ? `No existen productos que contengan "${nameInput}" en su nombre`
                        : "¡Parece que no has agregado ningún producto todavía!"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {products?.length > 10 && (
        <Pagination
          color="primary"
          count={Math.ceil(products?.length / 10)}
          onChange={handlePageChange}
          page={page}
          sx={(theme) => ({
            margin: "auto",
            marginTop: theme.spacing(3),
            width: "max-content",
          })}
        />
      )}
    </Box>
  );
};
