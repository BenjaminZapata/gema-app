// Importes de React
import { useState } from "react";
// Importes de terceros
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
// Importes propios
import { ProductRowButton } from "../ProductRowButton";
import { Edit } from "@mui/icons-material";
import { ProductTypes } from "@/types/CommonTypes";
import { getFormData } from "@/utils/Functions";
import { addProductsInputs, productSchema } from "@/utils/Utils";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { getProducts, modifyProduct } from "@/redux/slices/productsSlice";
import { CustomInput } from "@/components/commons/CustomInput";

export const ModifySupplierDialog = ({
  open = false,
  product,
  setOpen,
}: {
  open: boolean;
  product: ProductTypes;
  setOpen: (data: boolean) => void;
}) => {
  const [error, setError] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip disableInteractive title="Editar producto">
        <ProductRowButton
          variant="contained"
          color="info"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Edit />
        </ProductRowButton>
      </Tooltip>

      <Dialog
        aria-modal
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onChange: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const data: ProductTypes = await getFormData(event);
            try {
              const dataToValidate = {
                ...data,
                id: product.id,
              };
              productSchema.parse(dataToValidate);
              setError(false);
            } catch (err) {
              console.log(err);
              setError(true);
            }
          },
          onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const data: ProductTypes = await getFormData(event);
            try {
              const dataToValidate = {
                ...data,
                id: product.id,
              };
              productSchema.parse(dataToValidate);
              await dispatch(modifyProduct(dataToValidate));
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
            const rawValueFromProduct = product[inputConfig.nombre];

            return (
              <CustomInput
                key={inputConfig.nombre}
                data={inputConfig}
                isEditMode={inputConfig.nombre === "id"}
                productFieldValue={rawValueFromProduct}
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
            Modificar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
