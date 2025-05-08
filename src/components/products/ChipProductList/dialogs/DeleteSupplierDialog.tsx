// Importes de React
import { useState } from 'react';
// Importes de terceros
import { toast } from 'sonner';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
// Importes propios
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import { deleteSupplier, getSuppliers } from '../../../../redux/slices/productsSlice';

export const DeleteSupplierDialog = ({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: (data: boolean) => void;
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const dispatch = useAppDispatch();
  const { suppliers } = useAppSelector((state) => state.productos);

  const handleDialogClose = () => {
    setSelectedSupplier('');
    setOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedSupplier(event.target.value);
  };

  if (open && !suppliers?.length) {
    toast.error('No hay proveedores cargados');
    setOpen(false);
  }

  return (
    <Dialog
      aria-modal
      onClose={handleDialogClose}
      open={open}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
            const sendData = async () => {
              await dispatch(deleteSupplier(Number(selectedSupplier)));
              await dispatch(getSuppliers());
            };
            sendData();
            handleDialogClose();
          } catch (err) {
            toast.error(err.issues[0].message);
          }
        },
        
      }}>
      <DialogTitle>Eliminar un proveedor</DialogTitle>
      <DialogContent>
        <InputLabel id='deleteSupplierSelect' sx={(theme) => ({ marginBottom: theme.spacing(1) })}>
          Proveedor
        </InputLabel>
        <Select
          labelId='deleteSupplierSelect'
          value={selectedSupplier}
          onChange={handleChange}
          sx={{ minWidth: '60%' }}>
          {suppliers?.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.nombre}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions sx={(theme) => ({ color: theme.palette.common.black })}>
        <Button onClick={handleDialogClose} color='inherit'>
          Cancelar
        </Button>
        <Button type='submit' color='error' variant='contained' disabled={selectedSupplier === ''}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
