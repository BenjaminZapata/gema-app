// Importes de React
import { useState } from "react";
// Importes de terceros
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { toast } from "sonner";
// Importes propios
import {
  addSupplier,
  getSuppliers,
} from "../../../../redux/slices/productsSlice";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { getFormData } from "@/utils/Functions";
import { addSupplierInputs, supplierSchema } from "@/utils/Utils";
import { SupplierTypes } from "@/types/CommonTypes";
import { CustomInput } from "@/components/commons/CustomInput";

export const AddSupplierDialog = ({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: (data: boolean) => void;
}) => {
  const [error, setError] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        aria-modal
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onChange: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const data = await getFormData(event);
            try {
              supplierSchema.parse(data);
              setError(false);
            } catch {
              setError(true);
            }
          },
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const data: SupplierTypes = getFormData(event);
            try {
              await dispatch(addSupplier(data));
              await dispatch(getSuppliers());
            } catch (err) {
              toast.error(err.issues[0].message);
            }
            handleClose();
          },
          sx: (theme) => ({ width: "40vw", minWidth: theme.spacing(50) }),
        }}
      >
        <DialogTitle>Agregar un proveedor</DialogTitle>
        <DialogContent>
          {addSupplierInputs.map((data) => (
            <CustomInput
              data={data}
              key={data.nombre}
              sx={() => ({ width: "100%" })}
            />
          ))}
        </DialogContent>
        <DialogActions sx={(theme) => ({ color: theme.palette.common.black })}>
          <Button onClick={handleClose} color="inherit">
            Cancelar
          </Button>
          <Button
            color="success"
            disabled={error}
            type="submit"
            variant="contained"
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
