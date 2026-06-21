"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Theme, Tooltip } from "@mui/material";
import { ChipProductListButton } from "@/components/products/ChipProductList/ChipProductListButton";
import { FilterList } from "@mui/icons-material";
import { SelectChangeEvent } from "@mui/material/Select";
import { toast } from "sonner";

type Filters = { metodoPago?: string; months?: number };

export const FiltersDialog = ({ applyFilters }: { applyFilters: (f: Filters) => void }) => {
  const [open, setOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: number; nombre: string }>>([]);
  const [metodoPago, setMetodoPago] = useState<string>("");
  const [months, setMonths] = useState<number>(0);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const res = await fetch("/api/paymentmethods");
        if (!res.ok) throw new Error("No se pudieron cargar métodos");
        const data = await res.json();
        setPaymentMethods(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [open]);

  const handleApply = () => {
    applyFilters({ metodoPago: metodoPago || undefined, months: months || 0 });
    setOpen(false);
    toast.success("Filtros aplicados");
  };

  const handleClear = () => {
    setMetodoPago("");
    setMonths(0);
  };

  return (
    <>
      <Tooltip disableInteractive title="Filtros">
        <ChipProductListButton variant="contained" color="info" onClick={() => setOpen(true)}>
          <FilterList sx={(theme: Theme) => ({ color: theme.palette.primary.contrastText })} />
        </ChipProductListButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "40vw",
            minWidth: (theme: Theme) => theme.spacing(40),
          },
        }}
      >
        <DialogTitle>Filtros de gastos</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <FormControl variant="standard" fullWidth>
            <InputLabel id="metodo-pago-filter-label">Método de pago</InputLabel>
            <Select
              labelId="metodo-pago-filter-label"
              id="metodo-pago-filter"
              value={metodoPago}
              onChange={(e: SelectChangeEvent<string>) => setMetodoPago(e.target.value)}
              label="Método de pago"
            >
              <MenuItem value="">Todos</MenuItem>
              {paymentMethods.map((m) => (
                <MenuItem key={m.id} value={m.nombre}>
                  {m.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <InputLabel id="periodo-filter-label">Periodo</InputLabel>
            <Select
              labelId="periodo-filter-label"
              id="periodo-filter"
              value={String(months)}
              onChange={(e: SelectChangeEvent<string>) => setMonths(Number(e.target.value))}
              label="Periodo"
            >
              <MenuItem value={0}>Todos</MenuItem>
              <MenuItem value={1}>Último mes</MenuItem>
              <MenuItem value={3}>Últimos 3 meses</MenuItem>
              <MenuItem value={6}>Últimos 6 meses</MenuItem>
              <MenuItem value={12}>Últimos 12 meses</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" justifyContent="space-between" mt={1}>
            <Button variant="contained" color="info" onClick={handleClear}>
              Limpiar
            </Button>
            <Box display="flex" gap={1}>
              <Button color="inherit" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button variant="contained" color="success" onClick={handleApply}>
                Aplicar
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
