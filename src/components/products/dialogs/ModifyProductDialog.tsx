import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ZodError } from "zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Theme,
  useTheme,
} from "@mui/material";
import { ProductTypes } from "@/types/CommonTypes";
import {
  addProductsInputs,
  UpdateProductFormData,
  updateProductSchema,
} from "@/utils/Utils";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { getProducts, modifyProduct } from "@/redux/slices/productsSlice";
import { ProductRowButton } from "../ProductRowButton";
import { Edit } from "@mui/icons-material";
import { CustomInput } from "@/components/commons/CustomInput";

const getInitialFormValues = (product: ProductTypes): Record<string, any> => {
  const values: Record<string, any> = {};
  addProductsInputs.forEach((input) => {
    const key = input.nombre as keyof ProductTypes;
    const productValue = product[key];

    if (input.nombre === "id") {
      values[key] = productValue ?? "";
    } else if (input.nombre === "tiendaonline") {
      values[key] = String(Boolean(productValue));
    } else if (input.type === "date") {
      values[key] = productValue ? productValue : null;
    } else if (productValue === null || productValue === undefined) {
      values[key] = input.type === "number" ? "" : "";
    } else {
      values[key] = productValue;
    }
  });
  values.id = product.id;
  return values;
};

interface ModifyProductDialogProps {
  open: boolean;
  setOpen: (data: boolean) => void;
  product: ProductTypes;
}

export const ModifyProductDialog = ({
  open,
  product,
  setOpen,
}: ModifyProductDialogProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [formData, setFormData] = useState<Record<string, any>>(() =>
    getInitialFormValues(product)
  );
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});

  useEffect(() => {
    if (open && product) {
      setFormData(getInitialFormValues(product));
    }
  }, [product, open]);

  useEffect(() => {
    const dataToValidate = {
      ...formData,
      id: product.id,
    };

    try {
      updateProductSchema.parse(dataToValidate);
      setIsFormInvalid(false);
      setFieldErrors({});
    } catch (err) {
      console.log(err);
      setIsFormInvalid(true);
      if (err instanceof ZodError) {
        const newErrors: Record<string, string | undefined> = {};
        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setFieldErrors(newErrors);
      } else {
        setFieldErrors({});
      }
    }
  }, [formData, product]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActualSubmit = async () => {
    setIsSubmitting(true);

    const dataToParse = {
      ...formData,
      id: product.id,
    };

    try {
      const validatedData = updateProductSchema.parse(
        dataToParse
      ) as UpdateProductFormData;

      await dispatch(modifyProduct(validatedData));
      await dispatch(getProducts());
      toast.success(`Producto modificado correctamente`);
      handleClose();
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string | undefined> = {};
        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setFieldErrors(newErrors);
        toast.error("Por favor, corrige los errores en el formulario.");
      } else if (err instanceof Error) {
        console.error("Error al modificar producto:", err);
        toast.error(err.message || `Error al modificar el producto.`);
      } else {
        toast.error("Ocurrió un error inesperado.");
        console.error("Error desconocido:", err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!product) return null;

  return (
    <>
      <Tooltip disableInteractive title="Editar producto">
        <ProductRowButton
          variant="contained"
          color="info"
          onClick={() => setOpen(true)}
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
          onSubmit: (e) => {
            e.preventDefault();
            handleActualSubmit();
          },
        }}
        sx={{
          "& .MuiDialog-paper": {
            width: "50vw",
            minWidth: (theme: Theme) => theme.spacing(60),
          },
        }}
      >
        <DialogTitle>Modificar Producto</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: (theme: Theme) => theme.spacing(2),
            pt: (theme: Theme) => `${theme.spacing(1)} !important`,
          }}
        >
          {addProductsInputs.map((inputConfig) => (
            <CustomInput
              key={inputConfig.nombre}
              data={inputConfig}
              currentFieldValue={formData[inputConfig.nombre]}
              onValueChange={handleInputChange}
              isEditMode={true}
              fieldError={fieldErrors[inputConfig.nombre]}
              sx={{
                width: { xs: "100%", sm: `calc(50% - ${theme.spacing(1)})` },
              }}
            />
          ))}
        </DialogContent>
        <DialogActions
          sx={{
            color: (theme: Theme) => theme.palette.common.black,
            px: 3,
            pb: 2,
          }}
        >
          <Button onClick={handleClose} color="inherit">
            {" "}
            Cancelar{" "}
          </Button>
          <Button
            color="success"
            disabled={isFormInvalid || isSubmitting}
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
