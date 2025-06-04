import { useAppDispatch } from "@/hooks/reduxHooks";
import { addPaymentMethod, getPaymentMethods } from "@/redux/slices/salesSlice";
import { paymentMethodSchema } from "@/utils/Utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";

interface AddPaymentMethodDialogTypes {
  open: boolean;
  setOpen: (bool: boolean) => void;
}

export const AddPaymentMethodDialog = ({
  open,
  setOpen,
}: AddPaymentMethodDialogTypes) => {
  const [paymentMethodName, setPaymentMethodName] = useState<string>("");
  const [paymentMethodObservations, setPaymentMethodObservations] =
    useState<string>("");
  const dispatch = useAppDispatch();

  const handleDialogClose = () => {
    setOpen(false);
    setPaymentMethodName("");
  };

  return (
    <>
      <Dialog
        aria-modal
        open={open}
        onClose={handleDialogClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            try {
              const validation = paymentMethodSchema.parse(formJson);
              const sendData = async () => {
                await dispatch(addPaymentMethod(validation));
                await dispatch(getPaymentMethods());
              };
              sendData();
              handleDialogClose();
            } catch (err) {
              if (err instanceof ZodError) {
                toast.error(err.issues[0].message);
              } else console.log(err);
            }
          },
          sx: (theme) => ({ width: "40vw", minWidth: theme.spacing(50) }),
        }}
      >
        <DialogTitle>Agregar un metodo de pago</DialogTitle>
        <DialogContent>
          <TextField
            required
            margin="dense"
            id="nombre"
            name="nombre"
            label="Nombre"
            type="text"
            fullWidth
            variant="standard"
            value={paymentMethodName}
            onChange={(e) => {
              setPaymentMethodName(e.target.value);
            }}
          />
          <TextField
            margin="dense"
            id="observaciones"
            name="observaciones"
            label="Observaciones"
            type="text"
            fullWidth
            variant="standard"
            value={paymentMethodObservations}
            onChange={(e) => {
              setPaymentMethodObservations(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions sx={(theme) => ({ color: theme.palette.common.black })}>
          <Button onClick={handleDialogClose} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            color="success"
            variant="contained"
            disabled={paymentMethodName.length < 3}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
