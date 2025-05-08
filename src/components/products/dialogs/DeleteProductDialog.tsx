// Importes de terceros
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from "@mui/material";
// Importes propios
import { ProductRowButton } from "../ProductRowButton";
import { Delete } from "@mui/icons-material";
import { ProductTypes } from "@/types/CommonTypes";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { deleteProduct, getProducts } from "@/redux/slices/productsSlice";

export const DeleteSupplierDialog = ({
  open = false,
  product,
  setOpen,
}: {
  open: boolean;
  product: ProductTypes;
  setOpen: (data: boolean) => void;
}) => {
  const dispatch = useAppDispatch();

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip disableInteractive title="Eliminar producto">
        <ProductRowButton
          variant="contained"
          color="error"
          onClick={() => setOpen(true)}
        >
          <Delete />
        </ProductRowButton>
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
                await dispatch(deleteProduct(Number(product.id)));
                await dispatch(getProducts());
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
        <DialogTitle>Eliminar un producto</DialogTitle>
        <DialogContent>
          <Typography>
            Estas a punto de eliminar{" "}
            <Typography component={"span"} fontWeight={700}>
              {product.nombre}
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions sx={(theme) => ({ color: theme.palette.common.black })}>
          <Button onClick={handleDialogClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
