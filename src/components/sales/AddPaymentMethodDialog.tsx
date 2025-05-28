import { Box, Button, ButtonProps, styled } from "@mui/material";
import React from "react";

const ManagePaymentMethodsButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: `1px solid ${theme.palette.common.black}`,
  borderLeft: "none",
  borderRadius: theme.spacing(0),
  borderBottomRightRadius: theme.spacing(1),
  borderTopRightRadius: theme.spacing(1),
  height: theme.spacing(5),
  minWidth: theme.spacing(0),
  padding: theme.spacing(1),
  width: theme.spacing(2.5),
}));

export const AddPaymentMethodDialog = () => {
  return (
    <Box>
      <Button
        variant="contained"
        color="success"
        sx={(theme) => ({
          border: `1px solid ${theme.palette.common.black}`,
          borderBottomRightRadius: theme.spacing(0),
          borderTopRightRadius: theme.spacing(0),
          height: theme.spacing(5),
        })}
      >
        Agregar metodo de pago
      </Button>
      <ManagePaymentMethodsButton color="success" variant="contained" />
    </Box>
  );
};
