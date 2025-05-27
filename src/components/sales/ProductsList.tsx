import { useAppSelector } from "@/hooks/reduxHooks";
import { ProductSaleDetails, ProductTypes } from "@/types/CommonTypes";
import { DebounceClass } from "@/utils/Classes";
import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProductSelect } from "./ProductSelect";

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
    const trimmedValue = inputValue.trim();
    if (trimmedValue.length > 0) {
      setLoading(true);
      debouncer.execute(inputValue);
    } else {
      debouncer.cancel();
      setFilteredList([]);
      setLoading(false);
    }

    return () => {
      debouncer.cancel();
    };
  }, [inputValue, debouncer]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue(e.target.value.toLowerCase());
  };

  const clearInput = () => {
    setInputValue("");
  };

  return (
    <Box display={"flex"} flexDirection={"column"} height={"100%"}>
      <TableContainer sx={{ height: "65%", marginX: "auto", width: "100%" }}>
        <Table>
          {productsList.length ? (
            <TableHead>
              <TableRow>
                <TableCell>Codigo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio unitario</TableCell>
              </TableRow>
            </TableHead>
          ) : null}
          <TableBody>
            {productsList.length ? (
              productsList.map((p) => (
                <TableRow key={`${p.productocodigo}-added`} hover>
                  <TableCell>{p.productocodigo}</TableCell>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>
                    <Box
                      alignContent={"center"}
                      display={"flex"}
                      gap={0.5}
                      justifyContent={"center"}
                    >
                      <Remove
                        sx={(theme) => ({
                          fontSize: theme.spacing(2),
                          cursor: "pointer",
                          marginTop: theme.spacing(0.5),
                        })}
                      />
                      <Typography>{p.cantidad}</Typography>
                      <Add
                        sx={(theme) => ({
                          fontSize: theme.spacing(2),
                          cursor: "pointer",
                          marginTop: theme.spacing(0.5),
                        })}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>$ {p.cantidad * p.preciounitario}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}>
                  No has cargado productos todavia
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography textAlign={"right"} mb={1} mr={1}>
        Total:{" "}
        <Typography component={"span"} fontWeight={700}>
          $ {total}
        </Typography>
      </Typography>
      <ProductSelect
        clearInput={clearInput}
        filteredList={filteredList}
        handleAddProduct={handleAddProduct}
        handleInputChange={handleInputChange}
        inputValue={inputValue}
        loading={loading}
      />
    </Box>
  );
};
