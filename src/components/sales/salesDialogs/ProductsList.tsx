import { useAppSelector } from "@/hooks/reduxHooks";
import {
  PaymentMethodsTypes,
  ProductSaleDetailsTypes,
  ProductTypes,
} from "@/types/CommonTypes";
import { DebounceClass } from "@/utils/Classes";
import {
  Box,
  MenuItem,
  Select,
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
import { AddedProductRow } from "./AddedProductRow";
import { ProductSelect } from "./ProductSelect";

interface ProductsListTypes {
  handleAddProduct: (product: ProductTypes) => void;
  handlePaymentChange: (id: number) => void;
  handleProductQuantityChange: (id: string, newQuantity: number) => void;
  paymentMethods: Array<PaymentMethodsTypes>;
  paymentMethodSelected: undefined | number;
  productsList: ProductSaleDetailsTypes[];
  total: number;
}

export const ProductsList = ({
  handleAddProduct,
  handlePaymentChange,
  handleProductQuantityChange,
  paymentMethods,
  paymentMethodSelected,
  productsList,
  total,
}: ProductsListTypes) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredList, setFilteredList] = useState<ProductTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { products } = useAppSelector((state) => state.productos);

  const productFiltering = useCallback(
    (value: string) => {
      if (value.length >= 3) {
        const filteredProducts = products
          .filter(
            (p) =>
              (p.nombre.toLowerCase().includes(value.trim()) ||
                p.id.includes(value.trim())) &&
              p.stock != 0
          )
          .filter(
            (p) =>
              !productsList.some((cartProd) => cartProd.productocodigo == p.id)
          );
        setFilteredList(filteredProducts);
      } else setFilteredList([]);
      setLoading(false);
    },
    [products, productsList, setFilteredList, setLoading]
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
              productsList.map((p) => {
                const selectedProduct = products.find(
                  (prod) => prod.id == p.productocodigo
                );
                return (
                  <AddedProductRow
                    key={`${p.nombre}-ProductsList`}
                    addedProduct={p}
                    handleProductQuantityChange={handleProductQuantityChange}
                    productData={selectedProduct}
                  />
                );
              })
            ) : (
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}>
                  <Typography
                    variant="subtitle1"
                    sx={(theme) => ({ marginTop: theme.spacing(2) })}
                  >
                    No has cargado productos todavia
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mb={1} mr={1} display={"flex"} justifyContent={"space-between"}>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <Typography fontSize={14}>Metodo de pago: </Typography>
          <Select
            variant="outlined"
            size="small"
            value={paymentMethodSelected ?? ""}
            onChange={(e) => handlePaymentChange(Number(e.target.value))}
            sx={(theme) => ({
              fontSize: "10px",
              width: "130px",
              "& .MuiSelect-select": { padding: theme.spacing(1) },
            })}
          >
            {paymentMethods?.map((pm) => (
              <MenuItem
                key={pm.nombre}
                value={pm.id}
                sx={(theme) => ({
                  fontSize: theme.spacing(1.5),
                  paddingY: theme.spacing(0.5),
                  paddingX: theme.spacing(1),
                })}
              >
                {pm.nombre}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Typography width={"max-content"}>
          Total:{" "}
          <Typography component={"span"} fontWeight={700}>
            $ {total}
          </Typography>
        </Typography>
      </Box>
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
