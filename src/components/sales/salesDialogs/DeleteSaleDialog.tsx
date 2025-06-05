import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";

interface DeleteSaleDialogTypes {
  handleDelete: (id: number) => void;
  id: number;
  open: boolean;
  setOpen: (data: boolean) => void;
}

export const DeleteSaleDialog = ({
  handleDelete,
  id,
  open,
  setOpen,
}: DeleteSaleDialogTypes) => {
  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      aria-modal
      onClose={handleDialogClose}
      open={open}
      PaperProps={{
        sx: (theme) => ({
          minWidth: theme.spacing(50),
        }),
      }}
    >
      <DialogTitle>Eliminar una venta</DialogTitle>
      <Divider />
      <DialogContent
        sx={(theme) => ({
          paddingTop: theme.spacing(1),
          paddingInline: theme.spacing(1),
        })}
      >
        <Typography px={1} py={2}>
          Estas a punto de borrar la venta de ID #{id}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={(theme) => ({
          color: theme.palette.common.black,
          display: "flex",
          justifyContent: "flex-end",
        })}
      >
        <Box>
          <Button onClick={handleDialogClose} color="inherit">
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              try {
                handleDelete(id);
                setOpen(false);
              } catch {}
            }}
          >
            Eliminar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
