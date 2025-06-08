import { Box, Typography } from "@mui/material";
import React from "react";

interface SaleProductDetailTypes {
  name: string;
  detail: {
    cantidad: number;
    preciounitario: number;
  };
  isModal?: boolean;
}

export const SaleProductDetail = ({
  name,
  detail,
  isModal = false,
}: SaleProductDetailTypes) => {
  const { cantidad, preciounitario } = detail;

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        justifyContent: "space-between",
        gap: theme.spacing(1),
        padding: isModal
          ? `${theme.spacing(0.5)} ${theme.spacing(1)}`
          : theme.spacing(0),
        "&:hover": {
          color: theme.palette.error.dark,
        },
      })}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          gap: theme.spacing(1),
        })}
      >
        <Typography fontSize={"13px"}>{name}</Typography>
        <Typography fontSize={"13px"}>x{cantidad}</Typography>
      </Box>
      <Typography fontSize={"13px"} sx={{ minWidth: "60px" }}>
        ${preciounitario} c/u
      </Typography>
    </Box>
  );
};
