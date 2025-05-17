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
  Chip,
  Switch,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "@/hooks/reduxHooks"; // Ajusta la ruta
import { InputProps } from "@/utils/Commons";

interface CustomInputProps
  extends Omit<BoxProps, "defaultValue" | "onChange" | "value" | "name"> {
  data: InputProps;
  currentFieldValue:
    | string
    | string[]
    | number
    | boolean
    | null
    | undefined
    | Record<string, number>;
  onValueChange: (name: string, value: any) => void;
  isEditMode?: boolean;
  fieldError?: string;
}

export const CustomInput = ({
  data,
  currentFieldValue,
  onValueChange,
  isEditMode = false,
  fieldError,
  sx,
  ...boxProps
}: CustomInputProps) => {
  const { categories, suppliers } = useAppSelector((state) => state.productos);

  // 1. ADAPTAR currentFieldValue PARA LOS INPUTS DE MUI
  //    El estado `formData` del padre puede tener tipos "crudos" (boolean, number, timestamp).
  //    Los inputs de MUI a menudo esperan strings para `value` o un tipo específico (Dayjs).

  const muiInputValue = useMemo(() => {
    if (
      data.type == "multiselect_categories" ||
      data.type === "multiselect_suppliers"
    ) {
      return Array.isArray(currentFieldValue) ? currentFieldValue : [];
    }
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
    if (data.type == "checkbox" || data.type == "switch") {
      return Boolean(currentFieldValue);
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
    disabled: (data.nombre === "id" && isEditMode) || false,
  };

  // 3. RENDERIZADO DEL INPUT
  let inputElement: JSX.Element;

  switch (data.type) {
    case "multiselect_categories":
    case "multiselect_suppliers":
    case "select":
      let selectOptions: Array<{ value: string; label: string }> = [];
      let isMultiple = false;

      if (
        data.type == "multiselect_categories" ||
        data.nombre === "categoria"
      ) {
        selectOptions =
          categories?.map((cat) => ({
            value: String(cat.id),
            label: cat.nombre,
          })) || [];
        if (data.type == "multiselect_categories") isMultiple = true;
      } else if (
        data.type == "multiselect_suppliers" ||
        data.nombre === "proveedor"
      ) {
        selectOptions =
          suppliers?.map((sup) => ({
            value: String(sup.id),
            label: sup.nombre,
          })) || [];
        if (data.type == "multiselect_suppliers") isMultiple = true;
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
            {data.label}
          </InputLabel>
          <Select
            {...commonMuiProps}
            labelId={`${data.nombre}-label`}
            multiple={isMultiple}
            onChange={(e) =>
              onValueChange(data.nombre, e.target.value as string | string[])
            }
            value={muiInputValue}
            renderValue={
              isMultiple
                ? (selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((value) => {
                        const option = selectOptions.find(
                          (opt) => opt.value === value
                        );
                        return (
                          <Chip
                            key={value}
                            label={option?.label || value}
                            size="small"
                          />
                        );
                      })}
                    </Box>
                  )
                : undefined
            }
          >
            {selectOptions
              .sort(function (a, b) {
                if (a.label < b.label) return -1;
                if (b.label < a.label) return 1;
                return 0;
              })
              .map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={(theme) => ({
                    fontSize: theme.spacing(1.5),
                    paddingY: theme.spacing(0.5),
                    paddingX: theme.spacing(1),
                  })}
                >
                  {isMultiple && (
                    <Checkbox
                      checked={(muiInputValue as string[]).includes(opt.value)}
                    />
                  )}
                  {opt.label}
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
          type={data.type === "number" ? "number" : "text"}
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
            label={data.label}
            value={datePickerStateValue}
            onChange={(newValue: Dayjs | null) => {
              setDatePickerStateValue(newValue);
              onValueChange(
                data.nombre,
                newValue ? newValue.toISOString() : null
              );
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
          {datePickerStateValue !== null && !commonMuiProps.disabled && (
            <Button
              variant="outlined"
              size="medium"
              onClick={() => {
                setDatePickerStateValue(null);
                onValueChange(data.nombre, null);
              }}
              aria-label={`Limpiar ${data.label}`}
              sx={{
                ml: 1,
                flexShrink: 0,
                alignSelf: "center",
                height: "56px",
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
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems={"center"}
          mt={2.5}
        >
          <FormControlLabel
            control={
              <Checkbox
                name={data.nombre}
                checked={muiInputValue as boolean}
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

    case "switch":
      inputElement = (
        <Box display="flex" flexDirection="column" width="100%">
          <FormControlLabel
            control={
              <Switch
                name={data.nombre}
                checked={muiInputValue as boolean}
                onChange={(e) => onValueChange(data.nombre, e.target.checked)}
                disabled={commonMuiProps.disabled}
              />
            }
            label={data.label}
          />
          {fieldError && (
            <FormHelperText error sx={{ ml: "0px", mt: "-8px" }}>
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
