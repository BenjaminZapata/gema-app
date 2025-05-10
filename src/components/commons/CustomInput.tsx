import { useMemo, useState, useEffect, JSX } from "react";
import {
  Box,
  BoxProps,
  Checkbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "@/hooks/reduxHooks"; // Ajusta la ruta
import { InputProps } from "@/utils/CommonTypes";

interface CustomInputProps
  extends Omit<BoxProps, "defaultValue" | "onChange" | "value" | "name"> {
  data: InputProps;
  currentFieldValue: string | number | boolean | null | undefined;
  onValueChange: (name: string, value: any) => void;
  isEditMode: boolean; // True si el formulario es para editar, false para agregar
  fieldError?: string;
}

export const CustomInput = ({
  data,
  currentFieldValue,
  onValueChange,
  isEditMode,
  fieldError,
  sx,
  ...boxProps
}: CustomInputProps) => {
  const { categories, suppliers } = useAppSelector((state) => state.productos);

  // 1. ADAPTAR currentFieldValue PARA LOS INPUTS DE MUI
  //    El estado `formData` del padre puede tener tipos "crudos" (boolean, number, timestamp).
  //    Los inputs de MUI a menudo esperan strings para `value` o un tipo específico (Dayjs).

  const muiInputValue = useMemo(() => {
    if (data.nombre === "tiendaonline") {
      if (typeof currentFieldValue === "boolean") {
        return String(currentFieldValue);
      }
      if (currentFieldValue === "true" || currentFieldValue === "false") {
        return currentFieldValue;
      }
      return "false";
    }
    if (data.type === "date") {
      return null;
    }
    if (currentFieldValue === null || currentFieldValue === undefined) {
      return "";
    }
    return String(currentFieldValue);
  }, [data.nombre, data.type, currentFieldValue]);

  // Estado interno solo para DatePicker porque su prop 'value' espera Dayjs | null
  const [datePickerStateValue, setDatePickerStateValue] =
    useState<Dayjs | null>(null);

  useEffect(() => {
    // Sincronizar el estado interno del DatePicker si currentFieldValue (del padre) cambia
    if (data.type === "date") {
      if (
        currentFieldValue &&
        (dayjs.isDayjs(currentFieldValue) ||
          currentFieldValue instanceof Date ||
          typeof currentFieldValue === "number" ||
          typeof currentFieldValue === "string")
      ) {
        // `currentFieldValue` puede ser timestamp (number), string, Date, o Dayjs (si onValueChange envió Dayjs)
        const d = dayjs(
          currentFieldValue as string | number | Date | dayjs.Dayjs
        );
        setDatePickerStateValue(d.isValid() ? d : null);
      } else {
        setDatePickerStateValue(null);
      }
    }
  }, [currentFieldValue, data.type]);

  // 2. PROPIEDADES COMUNES PARA LOS INPUTS
  const commonMuiProps = {
    name: data.nombre,
    required: data.required,
    fullWidth: true,
    error: !!fieldError,
    disabled: data.nombre === "id" && isEditMode,
  };

  // 3. RENDERIZADO DEL INPUT
  let inputElement: JSX.Element;

  switch (data.type) {
    case "select":
      let selectOptions: Array<{ value: string; label: string }> = [];
      if (data.nombre === "categoria" && categories) {
        selectOptions = categories.map((cat) => ({
          value: String(cat.id),
          label: cat.nombre,
        }));
      } else if (data.nombre === "proveedor" && suppliers) {
        selectOptions = suppliers.map((sup) => ({
          value: String(sup.id),
          label: sup.nombre,
        }));
      } else if (data.nombre === "tiendaonline") {
        selectOptions = [
          { value: "false", label: "No" },
          { value: "true", label: "Si" },
        ];
      }

      inputElement = (
        <Box display="flex" flexDirection="column" width="100%">
          <InputLabel
            id={`${data.nombre}-label`}
            shrink={!!muiInputValue || data.type === "select"}
          >
            {" "}
            {/* Shrink para Select */}
            {data.label}
          </InputLabel>
          <Select
            {...commonMuiProps}
            labelId={`${data.nombre}-label`}
            value={muiInputValue}
            onChange={(e) => onValueChange(data.nombre, e.target.value)}
          >
            {selectOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {" "}
                {opt.label}{" "}
              </MenuItem>
            ))}
          </Select>
          {fieldError && <FormHelperText error>{fieldError}</FormHelperText>}
        </Box>
      );
      break;

    case "text":
    case "number":
      inputElement = (
        <TextField
          {...commonMuiProps}
          id={data.nombre}
          label={data.label}
          type={data.type}
          value={muiInputValue}
          onChange={(e) => onValueChange(data.nombre, e.target.value)}
          variant="standard"
          helperText={fieldError}
          InputProps={{
            readOnly: data.nombre === "id" && isEditMode,
          }}
          InputLabelProps={{
            shrink: !!muiInputValue || data.type === "number",
          }}
        />
      );
      break;

    case "date":
      inputElement = (
        <Box display="flex" alignItems="flex-start" width="100%" gap={1}>
          <DatePicker
            label={data.label} // El DatePicker maneja su propio label flotante
            value={datePickerStateValue}
            onChange={(newValue: Dayjs | null) => {
              setDatePickerStateValue(newValue);
              onValueChange(data.nombre, newValue);
            }}
            disabled={commonMuiProps.disabled}
            slotProps={{
              textField: {
                name: data.nombre,
                required: data.required,
                fullWidth: true,
                id: data.nombre,
                error: !!fieldError,
                helperText: fieldError,
              },
            }}
            sx={{ flexGrow: 1, width: "auto" }} 
          />
          {/* Botón "Limpiar" explícito */}
          {datePickerStateValue !== null &&
            !commonMuiProps.disabled && ( // Mostrar solo si hay fecha y no está deshabilitado
              <Button
                variant="outlined"
                size="medium"
                onClick={() => {
                  setDatePickerStateValue(null); // Actualiza UI del DatePicker
                  onValueChange(data.nombre, null); // Notifica al padre con null
                }}
                aria-label={`Limpiar ${data.label}`}
                sx={{
                  ml: 1, // Margen a la izquierda
                  flexShrink: 0, // Evita que el botón se encoja
                  alignSelf: "center", // Centrar verticalmente con el DatePicker
                  height: "56px", // Altura típica de un TextField de MUI para alinear
                }}
              >
                Limpiar
              </Button>
            )}
        </Box>
      );
      break;

    case "checkbox":
      inputElement = (
        <Box display="flex" flexDirection="column" width="100%">
          <FormControlLabel
            control={
              <Checkbox
                name={data.nombre}
                checked={Boolean(currentFieldValue)}
                onChange={(e) => onValueChange(data.nombre, e.target.checked)}
                disabled={commonMuiProps.disabled}
              />
            }
            label={data.label}
          />
          {fieldError && (
            <FormHelperText error sx={{ ml: "14px" }}>
              {fieldError}
            </FormHelperText>
          )}
        </Box>
      );
      break;

    default:
      inputElement = <Box>Tipo no soportado: {data.type}</Box>;
  }

  return (
    <Box alignItems="flex-start" display="flex" sx={sx} {...boxProps}>
      {inputElement}
    </Box>
  );
};
