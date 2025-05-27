import { ProductTypes } from "@/types/CommonTypes";
import { Cancel } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent } from "react";

interface ProductSelectTypes {
  clearInput: () => void;
  filteredList: ProductTypes[];
  handleAddProduct: (p: ProductTypes) => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputValue: string;
  loading: boolean;
}

export const ProductSelect = ({
  clearInput,
  filteredList,
  handleAddProduct,
  handleInputChange,
  inputValue,
  loading,
}: ProductSelectTypes) => {
  return (
    <Box height={"35%"}>
      <TextField
        size="small"
        label="Busca un producto"
        value={inputValue}
        sx={{ width: "100%" }}
        onChange={handleInputChange}
        slotProps={{
          input: {
            endAdornment: (
              <Box
                sx={{ cursor: inputValue.length ? "pointer" : "default" }}
                mt={1}
                onClick={() => inputValue.length && clearInput()}
              >
                <Cancel
                  fontSize={"small"}
                  sx={{ color: inputValue.length ? "black" : "gray" }}
                />
              </Box>
            ),
          },
        }}
      />
      <TableContainer>
        <Table
          sx={(theme) => ({
            marginTop: theme.spacing(2),
          })}
        >
          <TableBody>
            {filteredList.length ? (
              filteredList.slice(0, 5).map((p, index) => (
                <TableRow
                  hover
                  key={p.id}
                  onClick={() => {
                    handleAddProduct(p);
                    clearInput();
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell
                    sx={{
                      borderBottom:
                        filteredList.length == index + 1 || index == 4
                          ? "none"
                          : "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    <Typography variant="body2">{p.nombre}</Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      borderBottom:
                        filteredList.length == index + 1 || index == 4
                          ? "none"
                          : "1px solid rgba(224, 224, 224, 1)",
                      width: "90px",
                    }}
                  >
                    <Typography variant="body2">$ {p.precioventa}</Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}>
                  {loading ? (
                    <CircularProgress
                      size={32}
                      sx={(theme) => ({ marginTop: theme.spacing(1) })}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      width={"max-content"}
                      margin={"auto"}
                      mt={2}
                    >
                      {inputValue.length < 3 && inputValue.length > 0
                        ? "Escriba al menos tres caracteres"
                        : inputValue.length >= 3
                        ? "No se encontraron productos con ese codigo o nombre"
                        : "Escriba el codigo o nombre del producto"}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
