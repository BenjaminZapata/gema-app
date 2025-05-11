import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Theme,
  Tooltip,
} from "@mui/material";
import { ChipProductListButton } from "../ChipProductListButton";
import { FilterList } from "@mui/icons-material";
import { filterDialogInputs, filtersSchema } from "@/utils/Utils";
import { ProductFiltersStateTypes } from "@/types/CommonTypes";
import { z, ZodError } from "zod";
import { CustomInput } from "@/components/commons/CustomInput";
import { toast } from "sonner";

type FiltersFormData = z.infer<typeof filtersSchema>;

export const FiltersDialog = ({
  activeFilters,
  applyFilters,
  resetAllFilters,
}: {
  activeFilters: ProductFiltersStateTypes;
  applyFilters: (filtersFromDialog: ProductFiltersStateTypes) => void;
  resetAllFilters: () => void;
}) => {
  //? Función - Obtener valores de los filtros
  const getInitialFormValues = useCallback((): FiltersFormData => {
    //* Creamos el objeto inicial con valores default
    const defaultsValues = filtersSchema.parse({});

    return {
      ...defaultsValues,
      ...activeFilters,
      price: {
        ...defaultsValues.price,
        ...(activeFilters.price || { min: undefined, max: undefined }),
      },
    };
  }, [activeFilters]);

  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] =
    useState<ProductFiltersStateTypes>(activeFilters);
  const [isFormInvalid, setIsFormInvalid] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string | undefined>
  >({});

  useEffect(() => {
    if (open) {
      const initialValues = getInitialFormValues();
      setFormData(initialValues);
      validateForm(initialValues);
    }
  }, [open, getInitialFormValues]);

  //? Función - Cierre del modal
  const handleDialogClose = () => {
    setFieldErrors({});
    setOpen(false);
    setIsFormInvalid(true);
  };

  //? Función - Validación de datos
  const validateForm = (dataToValidate: FiltersFormData) => {
    try {
      filtersSchema.parse(dataToValidate);
      setIsFormInvalid(false);
      return true;
    } catch (err) {
      setIsFormInvalid(true);
      if (err instanceof ZodError) {
        const newErrors: Record<string, string | undefined> = {};
        err.errors.forEach((e) => {
          const pathKey = e.path.join(".");
          if (pathKey) {
            newErrors[pathKey] = e.message;
          }
        });
      } else {
        setFieldErrors({});
      }
    }
    return false;
  };

  const handleInputChange = (name: string, value: any) => {
    if (name.startsWith("price.")) {
      const priceField = name.split(".")[1] as "min" | "max";
      setFormData((prev) => {
        const newPrice = {
          ...(prev.price || {}),
          [priceField]: value === "" ? undefined : value,
        };
        const newState = { ...prev, price: newPrice };
        return newState;
      });
    } else if (name == "selectedCategoryIds") {
      setFormData((prev) => ({ ...prev, [name]: value as string[] }));
    } else if (name == "lowStock") {
      setFormData((prev) => ({ ...prev, [name]: value as boolean }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (!open) return;
    validateForm(formData);
  }, [formData, open]);

  const handleApplyFiltersAction = () => {
    if (!validateForm(formData)) {
      toast.error("Error en la selección de filtros");
      return;
    }
    setIsApplying(true);
    try {
      const validatedFilters = filtersSchema.parse(formData);
      applyFilters(validatedFilters);
      toast.success("Filtros aplicados");
      handleDialogClose();
    } catch {
      toast.error("Error al procesar los filtros");
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearForm = () => {
    const initialValues = filtersSchema.parse({});
    setFormData(initialValues);
  };

  return (
    <>
      <Tooltip disableInteractive title="Cambiar filtros">
        <ChipProductListButton
          variant="contained"
          color="info"
          onClick={() => setOpen(true)}
        >
          <FilterList
            sx={(theme) => ({
              color: theme.palette.primary.contrastText,
            })}
          />
        </ChipProductListButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        sx={{
          "& .MuiDialog-paper": {
            width: "50vw",
            minWidth: (theme: Theme) => theme.spacing(60),
          },
        }}
      >
        <DialogTitle>Filtrar productos</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: (theme: Theme) => theme.spacing(2),
            pt: (theme: Theme) => `${theme.spacing(1)} !important`,
          }}
        >
          {filterDialogInputs.map((inputConfig) => {
            const getFieldValue = (
              name: string
            ):
              | string
              | string[]
              | number
              | boolean
              | undefined
              | Record<string, number> => {
              if (name.startsWith("price.")) {
                const parts = name.split("");
                const priceObj = formData.price;
                return priceObj?.[parts[1] as "min" | "max"];
              }
              return formData[name as keyof FiltersFormData];
            };
            return (
              <CustomInput
                key={inputConfig.nombre}
                data={inputConfig}
                currentFieldValue={getFieldValue(inputConfig.nombre)}
                onValueChange={handleInputChange}
                fieldError={fieldErrors[inputConfig.nombre]}
                sx={(theme) => ({
                  width: { xs: "100%", sm: `calc(50% - ${theme.spacing(1)})` },
                })}
              />
            );
          })}
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            width={"100%"}
            mt={2}
          >
            <Button variant="contained" onClick={handleClearForm} color="info">
              Limpiar filtros
            </Button>
            <Box display={"flex"} gap={1}>
              <Button
                variant="contained"
                onClick={handleDialogClose}
                color="inherit"
              >
                Cancelar{" "}
              </Button>
              <Button
                variant="contained"
                color="success"
                disabled={isFormInvalid || isApplying}
                onClick={handleApplyFiltersAction}
              >
                {isApplying ? <CircularProgress size={"small"} /> : "Aplicar"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
