import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useAppDispatch } from "../../../../hooks/reduxHooks";
import {
  addCategory,
  getCategories,
} from "../../../../redux/slices/productsSlice";
import { useState } from "react";
import { categorySchema } from "../../../../utils/Utils";

export const AddCategoryDialog = ({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: (data: boolean) => void;
}) => {
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useAppDispatch();

  const handleDialogClose = () => {
    setOpen(false);
    setCategoryName("");
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
              const validation = categorySchema.parse(formJson.category);
              const sendData = async () => {
                await dispatch(addCategory(validation));
                await dispatch(getCategories());
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
        <DialogTitle>Agregar una categoria</DialogTitle>
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
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
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
            disabled={categoryName.length < 3}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
