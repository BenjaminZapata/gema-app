import { useAppSelector } from "@/hooks/reduxHooks";
import { ProductSaleDetails, ProductTypes } from "@/types/CommonTypes";
import { DebounceClass } from "@/utils/Classes";
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
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ProductsListTypes {
  handleAddProduct: (product: ProductTypes) => void;
  productsList: ProductSaleDetails[];
  total: number;
}

export const ProductsList = ({
  handleAddProduct,
  productsList,
  total,
}: ProductsListTypes) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredList, setFilteredList] = useState<ProductTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { products } = useAppSelector((state) => state.productos);

  const productFiltering = useCallback(
    (value: string) => {
      if (value.length >= 3)
        setFilteredList(
          products.filter(
            (p) =>
              (p.nombre.toLowerCase().includes(value.trim()) ||
                p.id.includes(value.trim())) &&
              p.stock > 0
          )
        );
      else setFilteredList([]);
      setLoading(false);
    },
    [products]
  );

  const debouncer = useMemo(() => {
    return new DebounceClass(500, productFiltering);
  }, [productFiltering]);

  useEffect(() => {
    debouncer.execute(inputValue);
    return () => {
      debouncer.cancel();
    };
  }, [inputValue, debouncer]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setLoading(true);
    setInputValue(e.target.value.toLowerCase());
  };

  const clearInput = () => {
    setInputValue("");
  };

  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>
      <TableContainer sx={{ margin: "auto", width: "90%" }}>
        <Table>
          {productsList.length ? (
            productsList.map((p) => (
              <TableRow key={`${p.productocodigo}-added`} hover>
                <TableCell>{p.productocodigo}</TableCell>
                <TableCell>{p.nombre}</TableCell>
                <TableCell>x{p.cantidad}</TableCell>
                <TableCell>${p.cantidad * p.preciounitario}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell sx={{ borderBottom: "none" }}>
                <Typography width={"max-content"} margin={"auto"}>
                  No has cargado productos todavia
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </Table>
      </TableContainer>
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
                  <TableRow hover key={p.id}>
                    <TableCell
                      onClick={() => {
                        handleAddProduct(p);
                        clearInput();
                      }}
                      sx={{
                        borderBottom:
                          filteredList.length == index + 1 || index == 4
                            ? "none"
                            : "1px solid rgba(224, 224, 224, 1)",
                        cursor: "pointer",
                      }}
                    >
                      <Typography variant="body2">{p.nombre}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell sx={{ borderBottom: "none" }}>
                    {loading ? (
                      <CircularProgress
                        size={32}
                        sx={(theme) => ({ marginTop: theme.spacing(2) })}
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
    </Box>
  );
};
