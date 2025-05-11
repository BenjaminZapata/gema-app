import { useState, useEffect } from "react";
import {
  Box,
  Button,
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Theme,
  useTheme,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast } from "sonner";
import { ZodError } from "zod";
import { ChipProductListButton } from "../ChipProductListButton";
import {
  addProductsInputs,
  CreateProductFormData,
  createProductSchema,
} from "@/utils/Utils";
import { addProduct, getProducts } from "@/redux/slices/productsSlice";
import { CustomInput } from "@/components/commons/CustomInput";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

// Helper para inicializar el formulario para un nuevo producto
const getInitialFormValues = (): Record<string, any> => {
  const defaults: Record<string, any> = {};
  addProductsInputs.forEach((input) => {
    if (input.nombre === "tiendaonline") {
      defaults[input.nombre] = "false";
    } else if (input.type === "date") {
      defaults[input.nombre] = null;
    } else {
      defaults[input.nombre] = "";
    }
  });
  return defaults;
};

export const AddProductDialog = () => {
  const [open, setOpen] = useState(false);
  const { categories, suppliers } = useAppSelector((state) => state.productos);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [formData, setFormData] =
    useState<Record<string, any>>(getInitialFormValues);
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});

  const handleClickOpen = () => {
    if (!suppliers?.length || !categories?.length) {
      toast.error("Primero debe cargar categorías y proveedores.");
      return;
    }
    setFormData(getInitialFormValues());
    setIsFormInvalid(true);
    setFieldErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Validación con Zod cada vez que formData cambie
  useEffect(() => {
    if (!open || !categories?.length || !suppliers?.length) {
      return;
    }

    try {
      createProductSchema.parse(formData);
      setIsFormInvalid(false);
      setFieldErrors({});
    } catch (err) {
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
  }, [formData, open, categories, suppliers]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActualSubmit = async () => {
    setIsSubmitting(true);
    try {
      const validatedData = createProductSchema.parse(
        formData
      ) as CreateProductFormData;

      await dispatch(addProduct(validatedData));
      await dispatch(getProducts());
      toast.success(`Producto agregado correctamente`);
      handleClose();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string | undefined> = {};
        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setFieldErrors(newErrors);
        toast.error("Por favor, corrige los errores en el formulario.");
      } else {
        console.error("Error al agregar producto:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err.message ||
          "Error al agregar el producto.";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const tooltipTitle =
    !suppliers?.length || !categories?.length
      ? capitalize(
          `${[
            !suppliers?.length ? "proveedores" : null,
            !categories?.length ? "categorías" : null,
          ]
            .filter((v) => v !== null)
            .join(" y ")} faltantes`
        )
      : "Agregar producto";


  return (
    <>
      <Tooltip disableInteractive title={tooltipTitle}>
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
              sx={(theme) => ({ color: theme.palette.primary.contrastText })}
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
        <DialogTitle>Agregar un producto</DialogTitle>
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
              isEditMode={false}
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
            Cancelar
          </Button>
          <Button
            color="success"
            disabled={isFormInvalid || isSubmitting} // Habilitar basado en el estado de validación
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
