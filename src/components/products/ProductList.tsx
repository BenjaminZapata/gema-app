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
  filterByNameValue,
  handlePageChange,
  page,
  products,
}: {
  filterByNameValue: string;
  handlePageChange: (event: unknown, data: number) => void;
  page: number;
  products: Array<ProductTypes>;
}) => {
  const columnNames = [
    "ID",
    "Nombre",
    "Categoria",
    "Precio",
    "Stock",
    "Ultima modificación",
    "Acciones",
  ];

  return (
    <Box data-name="ProductsList" mt={3}>
      <Box minHeight={487}>
        <TableContainer sx={{ margin: "auto", width: "90%" }}>
          <Table>
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
                    <Typography m={3} fontWeight={300} textAlign={'center'}>
                      {filterByNameValue.length
                        ? ` No existen productos que contengan "${filterByNameValue}" en su nombre`
                        : "¡Parece que no has agregado ningun producto todavia!"}
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
