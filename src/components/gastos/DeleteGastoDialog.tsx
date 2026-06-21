"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface DeleteGastoDialogProps {
  open: boolean;
  gastoId: number | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteGastoDialog = ({ open, gastoId, onClose, onConfirm }: DeleteGastoDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar borrado</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Estás a punto de borrar el gasto de id<b> #{gastoId ?? "?"}</b>.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
