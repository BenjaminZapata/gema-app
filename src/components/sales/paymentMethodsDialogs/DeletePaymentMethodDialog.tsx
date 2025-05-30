import React, { useState } from "react";
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { Remove } from "@mui/icons-material";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  deletePaymentMethod,
  getPaymentMethods,
} from "@/redux/slices/paymentMethodsSlice";

const DeletePaymentMethodsButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: `1px solid ${theme.palette.common.black}`,
  borderRadius: theme.spacing(0),
  borderBottomRightRadius: theme.spacing(1),
  borderLeft: "none",
  borderTopRightRadius: theme.spacing(1),
  height: theme.spacing(5),
  minWidth: theme.spacing(0),
  padding: theme.spacing(1),
}));

export const DeletePaymentMethodDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const { paymentMethods } = useAppSelector((state) => state.metodosdepago);
  const dispatch = useAppDispatch();

  const handleDialogClose = () => {
    setSelectedPayment("");
    setOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPayment(event.target.value);
  };

  if (open && !paymentMethods?.length) {
    toast.error("No hay proveedores cargados");
    setOpen(false);
  }

  return (
    <>
      <Tooltip
        disableInteractive
        title={
          paymentMethods?.length == 0
            ? "No has añadido metodos de pago"
            : "Eliminar metodo de pago"
        }
      >
        <Typography component={"span"}>
          <DeletePaymentMethodsButton
            sx={(theme) => ({ background: theme.palette.error.dark })}
            variant="contained"
            disabled={paymentMethods?.length == 0}
            onClick={() => setOpen(true)}
          >
            <Remove />
          </DeletePaymentMethodsButton>
        </Typography>
      </Tooltip>
      <Dialog
        aria-modal
        onClose={handleDialogClose}
        open={open}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            try {
              const sendData = async () => {
                await dispatch(deletePaymentMethod(selectedPayment));
                await dispatch(getPaymentMethods());
              };
              sendData();
              handleDialogClose();
            } catch (err) {
              if (err instanceof Error) {
                toast.error(err.message);
              } else toast.error("ERROR: No se pudo borrar el metodo de pago");
            }
          },
        }}
      >
        <DialogTitle>Eliminar un metodo de pago</DialogTitle>
        <DialogContent>
          <InputLabel
            id="deleteSupplierSelect"
            sx={(theme) => ({ marginBottom: theme.spacing(1) })}
          >
            Metodo de pago
          </InputLabel>
          <Select
            labelId="deleteSupplierSelect"
            value={selectedPayment}
            onChange={handleChange}
            sx={{ minWidth: "60%" }}
          >
            {paymentMethods?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.nombre}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions sx={(theme) => ({ color: theme.palette.common.black })}>
          <Button onClick={handleDialogClose} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            color="error"
            variant="contained"
            disabled={selectedPayment === ""}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
