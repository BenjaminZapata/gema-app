// Importes de React
import { useState } from "react";
// Importes de terceros
import {
  Box,
  Button,
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast } from "sonner";
// Importes propios
import { ChipProductListButton } from "../ChipProductListButton";
import { getFormData } from "@/utils/Functions";
import { addProductsInputs, productSchema } from "@/utils/Utils";
import { addProduct, getProducts } from "@/redux/slices/productsSlice";
import { CustomInput } from "@/components/commons/CustomInput";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

export const AddProductDialog = () => {
  const [error, setError] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const { categories, suppliers } = useAppSelector((state) => state.productos);
  const dispatch = useAppDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (open && (!suppliers?.length || !categories?.length)) {
    toast.error("No hay categorias y/o proveedores cargados");
    setOpen(false);
  }

  return (
    <>
      <Tooltip
        disableInteractive
        title={
          !suppliers?.length || !categories?.length
            ? capitalize(
                `${[
                  !suppliers?.length ? "proveedor" : null,
                  !categories?.length ? "categoria" : null,
                ]
                  .filter((v) => v !== null)
                  .join(", ")} faltante`
              )
            : "Agregar producto"
        }
      >
        <Box component={"span"}>
          {" "}
          <ChipProductListButton
            variant="contained"
            color="success"
            disabled={!suppliers?.length || !categories?.length}
            onClick={handleClickOpen}
            sx={(theme) => ({
              background: theme.palette.success.main,
              borderBottomRightRadius: theme.spacing(0),
              borderTopRightRadius: theme.spacing(0),
            })}
          >
            <Add
              sx={(theme) => ({
                color: theme.palette.primary.contrastText,
              })}
            />
          </ChipProductListButton>
        </Box>
      </Tooltip>
      <Dialog
        aria-modal
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onChange: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const data = await getFormData(event);
            console.log(data);
            try {
              productSchema.parse(data);
              console.log(productSchema.parse(data));
              setError(false);
            } catch {
              setError(true);
            }
          },
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const data = await getFormData(event);
            try {
              await dispatch(addProduct(data));
              await dispatch(getProducts());
            } catch (err) {
              toast.error(err.issues[0].message);
            }
            handleClose();
          },
          sx: (theme) => ({ width: "40vw", minWidth: theme.spacing(50) }),
        }}
      >
        <DialogTitle>Agregar un producto</DialogTitle>
        <DialogContent
          sx={(theme) => ({
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: theme.spacing(1),
          })}
        >
          {addProductsInputs.map((inputConfig) => {
            return (
              <CustomInput
                key={inputConfig.nombre}
                data={inputConfig}
                sx={(theme) => ({
                  width: { xs: "100%", md: `calc(50% - ${theme.spacing(1)})` },
                  mb: 2,
                })}
              />
            );
          })}
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
