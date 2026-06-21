"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { AddGastoDialog, type Gasto } from "@/components/gastos/AddGastoDialog";
import { DeleteGastoDialog } from "@/components/gastos/DeleteGastoDialog";
import { FiltersDialog } from "@/components/gastos/FiltersDialog";
import { GastosBarChart } from "@/components/gastos/GastosBarChart";
import { DeleteForever } from "@mui/icons-material";

export default function GastosPage() {
  const [gastos, setGastos] = useState<Array<Gasto & { metodoPago?: string }>>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [filterMetodoPago, setFilterMetodoPago] = useState<string>("");
  const [filterMonths, setFilterMonths] = useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteGastoId, setDeleteGastoId] = useState<number | null>(null);

  useEffect(() => {
    const loadGastos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/gastos");
        if (!response.ok) throw new Error("No se pudo cargar la lista de gastos");
        const data = await response.json();
        const raw = Array.isArray(data) ? (data as Gasto[]) : [];
        const enriched = raw.map((g: Gasto) => {
          const observ = (g.observaciones ?? "") as string;
          const parts = observ.split(" - ");
          const metodoPago = parts[0] ? parts[0].trim() : undefined;
          return { ...g, metodoPago };
        });
        setGastos(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGastos();
  }, []);

  const handleAddGasto = () => setIsDialogOpen(true);

  const handleRowsPerPageChange = (event: SelectChangeEvent<string | number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(1);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => setPage(value);

  const paymentMethodOptions = useMemo(() => {
    const setPM = new Set<string>();
    gastos.forEach((g) => {
      if (g.metodoPago) setPM.add(g.metodoPago);
    });
    return Array.from(setPM);
  }, [gastos]);

  const filteredGastos = useMemo(() => {
    let list = gastos;
    if (filterMetodoPago) list = list.filter((g) => g.metodoPago === filterMetodoPago);
    if (filterMonths && filterMonths > 0) {
      const now = new Date();
      const cutoff = new Date(now.getFullYear(), now.getMonth() - filterMonths + 1, 1);
      list = list.filter((g) => {
        try {
          return new Date(g.fecha) >= cutoff;
        } catch {
          return false;
        }
      });
    }
    return list;
  }, [gastos, filterMetodoPago, filterMonths]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredGastos.length / rowsPerPage)), [filteredGastos.length, rowsPerPage]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedGastos = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredGastos.slice(start, start + rowsPerPage);
  }, [filteredGastos, page, rowsPerPage]);

  const handleGastoAdded = (gasto: Gasto) => {
    const observ = gasto.observaciones ?? "";
    const parts = observ.split(" - ");
    const metodoPago = parts[0] ? parts[0].trim() : undefined;
    setGastos((prev) => [{ ...gasto, metodoPago }, ...prev]);
    setPage(1);
  };

  const openDeleteDialog = (id: number) => {
    setDeleteGastoId(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteGastoId(null);
  };

  const confirmDeleteGasto = async () => {
    if (deleteGastoId === null) return;

    try {
      const response = await fetch(`/api/gastos/${deleteGastoId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el gasto");
      setGastos((prev) => prev.filter((g) => g.id !== deleteGastoId));
    } catch (error) {
      console.error(error);
    } finally {
      closeDeleteDialog();
    }
  };

  return (
    <>
      <Box display="flex" flexDirection={{ xs: "column", lg: "row" }} gap={2} p={2}>
        <Box width={{ xs: "100%", lg: "60%" }}>
          <Typography variant="h4" gutterBottom>
            Gastos
          </Typography>

          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <Button
              variant="contained"
              color="success"
              onClick={handleAddGasto}
              sx={(theme) => ({ border: `1px solid ${theme.palette.common.black}` })}
            >
              Agregar Gasto
            </Button>
            <FiltersDialog
              applyFilters={(f) => {
                setFilterMetodoPago(f.metodoPago ?? "");
                setFilterMonths(f.months ?? 0);
                setPage(1);
              }}
            />
          </Box>

          <Box mt={2}>
            {isLoading ? (
              <Typography>Cargando gastos...</Typography>
            ) : gastos.length === 0 ? (
              <Typography>No hay gastos registrados.</Typography>
            ) : (
              <>
                {paginatedGastos.map((gasto) => (
                  <Box
                    key={gasto.id}
                    position="relative"
                    p={2}
                    my={1}
                    borderRadius={2}
                    sx={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                  >
                    <DeleteForever onClick={() => openDeleteDialog(gasto.id)} sx={{ cursor: 'pointer', position: "absolute", top: 12, right: 12, color: "gray", '&:hover': { color: "error.dark" } }} />

                    <Box pr={5}>
                      <Typography variant="h6">{gasto.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(gasto.fecha).toLocaleDateString("es-AR")} — {gasto.tipo}
                      </Typography>
                      <Typography variant="body1">Total: ${gasto.total}</Typography>
                      {gasto.observaciones ? <Typography variant="body2">Observaciones: {gasto.observaciones}</Typography> : null}
                    </Box>
                  </Box>
                ))}

                <Box mt={3} mb={2} display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" gap={2}>
                  <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                    <FormControl variant="standard" sx={{ minWidth: 180 }}>
                      <InputLabel id="filter-metodo-label">Filtrar método</InputLabel>
                      <Select
                        labelId="filter-metodo-label"
                        id="filter-metodo"
                        value={filterMetodoPago}
                        label="Filtrar método"
                        onChange={(e) => {
                          setFilterMetodoPago(e.target.value as string);
                          setPage(1);
                        }}
                      >
                        <MenuItem value="">Todos</MenuItem>
                        {paymentMethodOptions.map((m) => (
                          <MenuItem key={m} value={m}>
                            {m}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl variant="standard" sx={{ minWidth: 140 }}>
                      <InputLabel id="rows-per-page-label">Mostrar</InputLabel>
                      <Select
                        labelId="rows-per-page-label"
                        id="rows-per-page"
                        value={String(rowsPerPage)}
                        label="Mostrar"
                        onChange={handleRowsPerPageChange}
                      >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" showFirstButton showLastButton />
                </Box>
              </>
            )}
          </Box>
        </Box>

        <Box width={{ xs: "100%", lg: "40%" }}>
          <GastosBarChart gastos={gastos} />
        </Box>
      </Box>

      <DeleteGastoDialog
        open={deleteDialogOpen}
        gastoId={deleteGastoId}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteGasto}
      />
      <AddGastoDialog open={isDialogOpen} setOpen={setIsDialogOpen} onGastoAdded={handleGastoAdded} />
    </>
  );
}
