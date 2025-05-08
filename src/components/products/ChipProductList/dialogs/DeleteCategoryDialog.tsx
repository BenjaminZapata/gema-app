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
import { deleteCategory, getCategories } from '../../../../redux/slices/productsSlice';

export const DeleteCategoryDialog = ({
  open = false,
  setOpen,
}: {
  open: boolean;
  setOpen: (data: boolean) => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.productos);

  const handleDialogClose = () => {
    setSelectedCategory('');
    setOpen(false);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  if (open && !categories?.length) {
    toast.error('No hay categorias cargadas');
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
              await dispatch(deleteCategory(Number(selectedCategory)));
              await dispatch(getCategories());
            };
            sendData();
            handleDialogClose();
          } catch (err) {
            toast.error(err.issues[0].message);
          }
        },
        sx: (theme) => ({ width: '40vw', minWidth: theme.spacing(50) }),
      }}>
      <DialogTitle>Eliminar una categoria</DialogTitle>
      <DialogContent>
        <InputLabel id='DeleteCategorySelect' sx={(theme) => ({ marginBottom: theme.spacing(1) })}>
          Categoria
        </InputLabel>
        <Select
          labelId='DeleteCategorySelect'
          value={selectedCategory}
          onChange={handleChange}
          sx={{ minWidth: '60%' }}>
          {categories?.map((c) => (
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
        <Button type='submit' color='error' variant='contained' disabled={selectedCategory === ''}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
