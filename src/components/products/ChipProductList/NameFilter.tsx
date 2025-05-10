import { useEffect } from "react";
import { Box, TextField, Tooltip } from "@mui/material";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { ProductTypes } from "@/types/CommonTypes";
import { ProductRowButton } from "../ProductRowButton";
import { Cancel } from "@mui/icons-material";

interface NameFilterProps {
  inputValue: string;
  productList: Array<ProductTypes>;
  setInputValue: (data: string) => void;
  setProductsList: (data: Array<ProductTypes>) => void;
}

export const NameFilter = ({
  inputValue,
  productList,
  setInputValue,
  setProductsList,
}: NameFilterProps) => {
  const { products } = useAppSelector((state) => state.productos);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue)
        setProductsList(
          productList.filter((p) => p.nombre.includes(inputValue))
        );
      else if (!inputValue && products?.length > 0) setProductsList(products);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Box display={"flex"} alignItems={"center"} gap={1}>
      <TextField
        size="small"
        label="Filtro por nombre"
        variant="standard"
        type="text"
        onChange={onChange}
        value={inputValue}
      />
      <Box
        mt={2}
        onClick={() => (inputValue ? setInputValue("") : null)}
        sx={{ cursor: inputValue ? "pointer" : "default" }}
      >
        <Cancel />
      </Box>
    </Box>
  );
};
