"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { toast } from "sonner";
import { ZodError } from "zod";
import { gastoSchema, TipoGastoEnum } from "@/types/gastosSchemas";

type PaymentMethod = {
  id: number;
  nombre: string;
  observaciones?: string | null;
};

export type Gasto = {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  observaciones?: string | null;
  total: number;
};

interface AddGastoDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onGastoAdded: (gasto: Gasto) => void;
}

const getDefaultFormValues = () => ({
  nombre: "",
  tipo: TipoGastoEnum.options[0] ?? "Servicios",
  fecha: new Date().toISOString().slice(0, 10),
  observaciones: "",
  total: "0",
});

export const AddGastoDialog = ({
  open,
  setOpen,
  onGastoAdded,
}: AddGastoDialogProps) => {
  const [formData, setFormData] = useState(getDefaultFormValues());
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const loadPaymentMethods = async () => {
      try {
        const response = await fetch("/api/paymentmethods");
        if (!response.ok) {
          throw new Error("No se pudieron cargar los métodos de pago");
        }
        const data = await response.json();
        setPaymentMethods(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedPaymentMethod(data[0].nombre);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadPaymentMethods();
  }, [open]);

  const handleDialogClose = () => {
    setOpen(false);
    setFormData(getDefaultFormValues());
    setSelectedPaymentMethod("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const paymentMethodLabel = selectedPaymentMethod?.trim();
    const baseObservaciones = formData.observaciones?.trim() || "";
    const observacionesValue = paymentMethodLabel
      ? baseObservaciones
        ? `${paymentMethodLabel} - ${baseObservaciones}`
        : paymentMethodLabel
      : baseObservaciones || undefined;

    const payload = {
      nombre: formData.nombre.trim(),
      tipo: formData.tipo,
      fecha: formData.fecha,
      observaciones: observacionesValue,
      total: Number(formData.total),
    };

    try {
      gastoSchema.parse(payload);

      const response = await fetch("/api/gastos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => null);
        throw new Error(responseData?.error || "No se pudo crear el gasto");
      }

      const createdGasto: Gasto = await response.json();
      onGastoAdded(createdGasto);
      toast.success("Gasto agregado correctamente");
      handleDialogClose();
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.issues[0]?.message || "Datos de gasto inválidos");
      } else {
        toast.error(error instanceof Error ? error.message : "Error al crear el gasto");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (
    field: keyof ReturnType<typeof getDefaultFormValues>,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      aria-modal
      open={open}
      onClose={handleDialogClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: {
          width: "40vw",
          minWidth: "360px",
        },
      }}
    >
      <DialogTitle>Agregar gasto</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
        <TextField
          required
          id="nombre"
          name="nombre"
          label="Nombre"
          variant="standard"
          fullWidth
          value={formData.nombre}
          onChange={(event) => handleFieldChange("nombre", event.target.value)}
        />
        <FormControl variant="standard" fullWidth>
          <InputLabel id="tipo-gasto-label">Tipo de gasto</InputLabel>
          <Select
            labelId="tipo-gasto-label"
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={(event: SelectChangeEvent<string>) =>
              handleFieldChange("tipo", event.target.value)
            }
            label="Tipo de gasto"
          >
            {TipoGastoEnum.options.map((option) => (
              <MenuItem key={option} value={option}>
                {option.replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          required
          id="fecha"
          name="fecha"
          label="Fecha"
          type="date"
          variant="standard"
          fullWidth
          value={formData.fecha}
          onChange={(event) => handleFieldChange("fecha", event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          required
          id="total"
          name="total"
          label="Total"
          type="number"
          inputProps={{ min: 0, step: 1 }}
          variant="standard"
          fullWidth
          value={formData.total}
          onChange={(event) => handleFieldChange("total", event.target.value)}
        />
        <FormControl variant="standard" fullWidth>
          <InputLabel id="metodo-pago-label">Método de pago</InputLabel>
          <Select
            labelId="metodo-pago-label"
            id="metodoPago"
            name="metodoPago"
            value={selectedPaymentMethod}
            onChange={(event: SelectChangeEvent<string>) =>
              setSelectedPaymentMethod(event.target.value)
            }
            label="Método de pago"
          >
            {paymentMethods.length === 0 ? (
              <MenuItem value="" disabled>
                No hay métodos disponibles
              </MenuItem>
            ) : (
              paymentMethods.map((method) => (
                <MenuItem key={method.id} value={method.nombre}>
                {/* Solo dejo la primera letra en mayúscula */}
                  {method.nombre.charAt(0).toUpperCase() + method.nombre.slice(1).toLowerCase()}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <TextField
          id="observaciones"
          name="observaciones"
          label="Observaciones"
          variant="standard"
          fullWidth
          multiline
          minRows={3}
          value={formData.observaciones}
          onChange={(event) => handleFieldChange("observaciones", event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ color: "black" }}>
        <Button onClick={handleDialogClose} color="inherit">
          Cancelar
        </Button>
        <Button type="submit" color="success" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
