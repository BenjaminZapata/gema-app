// Importes de React
import { useCallback, useEffect, useState } from "react";
// Importes de terceros
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
} from "@mui/material";
import { toast } from "sonner";
// Importes propios
import {
  addSupplier,
  getSuppliers,
} from "../../../../redux/slices/productsSlice";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { addSupplierInputs, supplierSchema } from "@/utils/Utils";
import { CustomInput } from "@/components/commons/CustomInput";
import { z, ZodError } from "zod";

type SupplierFormData = z.infer<typeof supplierSchema>;

export const AddSupplierDialog = ({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: (data: boolean) => void;
}) => {
  const getInitialValues = useCallback((): SupplierFormData => {
    try {
      return supplierSchema.parse({});
    } catch (e) {
      const initialData: Record<string, string> = {};
      addSupplierInputs.forEach((input) => {
        initialData[input.nombre] = "";
      });
      return initialData as SupplierFormData;
    }
  }, []);

  const [formData, setFormData] = useState<SupplierFormData>(
    getInitialValues()
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open) {
      const initialValues = getInitialValues();
      setFormData(initialValues);
      setFieldErrors({});
      setIsFormInvalid(true);
      validateForm(initialValues);
    }
  }, [open, getInitialValues]);

  const handleClose = () => {
    setOpen(false);
    if (!isSubmitting) {
      setFormData(getInitialValues());
      setFieldErrors({});
      setIsFormInvalid(true);
    }
  };

  const validateForm = useCallback((dataToValidate: SupplierFormData) => {
    try {
      supplierSchema.parse(dataToValidate);
      setFieldErrors({});
      setIsFormInvalid(false);
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const newErrors: Record<string, string | undefined> = {};
        err.errors.forEach((e) => {
          const pathKey = e.path.join(".");
          if (pathKey) {
            newErrors[pathKey] = e.message;
          } else {
            newErrors._form = e.message;
          }
        });
        setFieldErrors(newErrors);
      } else {
        setFieldErrors({ _form: "Ocurrió un error de validación inesperado." });
      }
      setIsFormInvalid(true);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    validateForm(formData);
  }, [formData, open, validateForm]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm(formData)) {
      toast.error("Errores en el formulario");
      return;
    }
    setIsSubmitting(true);
    try {
      const validatedData = supplierSchema.parse(formData);
      await dispatch(addSupplier(validatedData)).unwrap();
      await dispatch(getSuppliers());
    } catch (error) {
      if (error instanceof ZodError) {
        validateForm(formData);
        toast.error("Error de validación al enviar. Revisa los campos.");
      } else {
        toast.error("Error al agregar el proveedor.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        aria-modal
        open={open}
        onClose={isSubmitting ? () => {} : handleClose}
        PaperProps={{
          sx: (theme) => ({ width: "40vw", minWidth: theme.spacing(50) }),
        }}
      >
        <DialogTitle>Agregar un proveedor</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: (theme: Theme) => theme.spacing(2),
            pt: (theme: Theme) => `${theme.spacing(1)} !important`,
          }}
        >
          {addSupplierInputs.map((inputConfig) => {
            const fieldName = inputConfig.nombre as keyof SupplierFormData;
            return (
              <CustomInput
                currentFieldValue={formData[fieldName]}
                data={inputConfig}
                fieldError={fieldErrors[inputConfig.nombre]}
                key={inputConfig.nombre}
                onValueChange={handleInputChange}
                sx={(theme) => ({
                  width: { xs: "100%", sm: `calc(50% - ${theme.spacing(1)})` },
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
            disabled={isFormInvalid || isSubmitting}
            type="submit"
            variant="contained"
            onClick={handleSubmit}
          >
            {isSubmitting ? <CircularProgress size={"small"} /> : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
