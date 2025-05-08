import { JSX, useMemo, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

// Asumiendo que estas definiciones existen y son importadas correctamente
import { InputProps as AddProductInputConfig } from "../../utils/CommonTypes"; // Renombrado para claridad
import { useAppSelector } from "../../hooks/reduxHooks";

interface CustomInputProps extends Omit<BoxProps, "defaultValue"> {
  data: AddProductInputConfig; // Contiene: { nombre, label, required, type }
  productFieldValue?: string | number | boolean | null | undefined; // Valor crudo del campo del producto
  isEditMode?: boolean;
}

export const CustomInput = ({
  data,
  productFieldValue = null,
  sx, // Para estilos desde el padre
  isEditMode = false,
  ...boxProps // Otras BoxProps como alignItems, display, gap, mb, width
}: CustomInputProps) => {
  const { categories, suppliers } = useAppSelector((state) => state.productos);

  // 1. VALORES INICIALES Y ESTADOS DERIVADOS
  //    Estos se usan para pre-llenar los campos del formulario.

  // Para Selects (especialmente tiendaonline) y TextFields/NumberFields (como defaultValue)
  const initialStringValueForInputs = useMemo(() => {
    if (data.nombre === "tiendaonline") {
      // productFieldValue para tiendaonline es boolean (true/false)
      // El Select necesita el string "true" o "false"
      return typeof productFieldValue === "boolean"
        ? String(productFieldValue)
        : "false"; // Default a "false" string si no es un booleano claro
    }
    // Para otros campos (text, number), convertir el valor a string para defaultValue
    if (productFieldValue === null || productFieldValue === undefined) {
      return ""; // Default a string vacío para TextField
    }
    return String(productFieldValue);
  }, [data.nombre, productFieldValue]);

  // Para DatePicker: productFieldValue para fechavencimiento es un timestamp (number)
  const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(() => {
    if (data.type === "date") {
      if (typeof productFieldValue === "number" && productFieldValue !== 0) {
        const d = dayjs(productFieldValue);
        return d.isValid() ? d : null;
      }
      if (typeof productFieldValue === "string" && productFieldValue) {
        const d = dayjs(productFieldValue);
        return d.isValid() ? d : null;
      }
    }
    return null;
  });

  // 2. PROPIEDADES COMUNES PARA INPUTS DE MUI
  const commonMuiProps = {
    name: data.nombre,
    required: data.required,
    fullWidth: true,
    disabled: data.nombre === "id" && isEditMode,
  };

  // 3. RENDERIZADO CONDICIONAL DEL INPUT BASADO EN data.type
  let inputElement: JSX.Element;

  switch (data.type) {
    case "select":
      let selectOptions: Array<{ value: string; label: string }> = [];
      if (data.nombre === "categoria" && categories) {
        selectOptions = categories.map((cat) => ({
          value: String(cat.id), // Los IDs de categoría son números
          label: cat.nombre,
        }));
      } else if (data.nombre === "proveedor" && suppliers) {
        selectOptions = suppliers.map((sup) => ({
          value: String(sup.id), // Los IDs de proveedor son números
          label: sup.nombre,
        }));
      } else if (data.nombre === "tiendaonline") {
        selectOptions = [
          { value: "false", label: "No" }, // El valor es string "false"
          { value: "true", label: "Si" }, // El valor es string "true"
        ];
      }

      inputElement = (
        <Box display="flex" flexDirection="column" width="100%">
          <InputLabel id={`${data.nombre}-label`}>{data.label}</InputLabel>
          <Select
            {...commonMuiProps}
            labelId={`${data.nombre}-label`}
            // Para un select no controlado, defaultValue es clave.
            // initialStringValueForInputs ya está formateado como string ("true", "false", o IDs numéricos como string)
            defaultValue={initialStringValueForInputs}
            // Si quisieras controlarlo, usarías 'value' y un 'onChange' que actualice estado en el padre.
            // value={initialStringValueForInputs}
          >
            {selectOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      );
      break;

    case "text":
    case "number":
      inputElement = (
        <TextField
          {...commonMuiProps}
          id={data.nombre} // Útil para <label htmlFor="..."> si no se usa InputLabel de MUI
          label={data.label}
          type={data.type} // "text" o "number"
          defaultValue={initialStringValueForInputs} // Para inputs no controlados
          variant="standard" // O "outlined", "filled" según tu diseño
          // InputProps para el campo ID (si es de tipo text o number)
          InputProps={
            data.nombre === "id" && isEditMode ? { readOnly: true } : {}
          }
        />
      );
      break;

    case "date":
      inputElement = (
        <Box display="flex" alignItems="center" width="100%" gap={1}>
          <DatePicker
            label={data.label}
            value={datePickerValue}
            onChange={(newValue) => setDatePickerValue(newValue)} // Esto ya maneja el null al limpiar
            disabled={commonMuiProps.disabled}
            slotProps={{
              textField: {
                name: data.nombre,
                required: data.required,
                fullWidth: true, // El DatePicker ocupará el espacio disponible
                id: data.nombre,
              },
            }}
            sx={{ flexGrow: 1 }} // Para que el DatePicker tome el espacio principal
          />
          {/* Botón de reinicio explícito (opcional si la "x" del DatePicker es suficiente) */}
          {datePickerValue !== null && ( // Mostrar solo si hay una fecha seleccionada
            <Button
              variant="outlined"
              size="small"
              onClick={() => setDatePickerValue(null)} // Llama directamente al setter del estado
              sx={{ ml: 1, flexShrink: 0 }} // Margen y evitar que se encoja
            >
              Limpiar {/* O un Icono */}
            </Button>
          )}
        </Box>
      );
      break;

    default:
      inputElement = <Box>Tipo de input no soportado: {data.type}</Box>;
  }

  return (
    <Box
      alignItems="center" // Alinea el label y el input si están en la misma línea (ej. checkbox)
      data-name={`CustomInput-${data.nombre}`}
      display="flex" // Flex para el contenedor principal del input
      // Las props de layout como width, mb, gap se pasan via sx o ...boxProps
      // Ejemplo de uso en el padre: sx={{ width: { xs: '100%', md: `calc(50% - ${theme.spacing(1)})` }, mb: 2 }}
      sx={sx}
      {...boxProps}
    >
      {inputElement}
    </Box>
  );
};
