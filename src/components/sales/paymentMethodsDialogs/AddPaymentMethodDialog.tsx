import { useAppDispatch } from "@/hooks/reduxHooks";
import {
  addPaymentMethod,
  getPaymentMethods,
} from "@/redux/slices/paymentMethodsSlice";
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

export const AddPaymentMethodDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [paymentMethodName, setPaymentMethodName] = useState<string>("");
  const dispatch = useAppDispatch();

  const handleDialogClose = () => {
    setOpen(false);
    setPaymentMethodName("");
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        sx={(theme) => ({
          border: `1px solid ${theme.palette.common.black}`,
          borderBottomRightRadius: theme.spacing(0),
          borderTopRightRadius: theme.spacing(0),
          height: theme.spacing(5),
        })}
        onClick={() => setOpen(true)}
      >
        Agregar metodo de pago
      </Button>
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
              const validation = paymentMethodSchema.parse(formJson.category);
              const sendData = async () => {
                await dispatch(addPaymentMethod(validation));
                await dispatch(getPaymentMethods());
              };
              sendData();
              handleDialogClose();
            } catch (err) {
              toast.error(err.issues[0].message);
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
            id="category"
            name="category"
            label="Nombre"
            type="text"
            fullWidth
            variant="standard"
            value={paymentMethodName}
            onChange={(e) => {
              setPaymentMethodName(e.target.value);
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
