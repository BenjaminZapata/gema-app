// Importes de React
import { useState } from 'react'
// Importes de terceros
import { toast } from 'sonner'
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
} from '@mui/material'
// Importes propios
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks'
import {
  deleteCategory,
  getCategories,
} from '../../../../redux/slices/productsSlice'
import { ZodError } from 'zod'

export const DeleteCategoryDialog = ({
  open = false,
  setOpen,
}: {
  open: boolean
  setOpen: (data: boolean) => void
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const dispatch = useAppDispatch()
  const { categories } = useAppSelector((state) => state.productos)

  const sortedCategories = [...categories].sort(function (a, b) {
    if (a.nombre < b.nombre) return -1
    if (b.nombre < a.nombre) return 1
    return 0
  })

  const handleDialogClose = () => {
    setSelectedCategory('')
    setOpen(false)
  }

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
  }

  if (open && !categories?.length) {
    toast.error('No hay categorías cargadas')
    setOpen(false)
  }

  return (
    <Dialog
      aria-modal
      onClose={handleDialogClose}
      open={open}
      PaperProps={{
        component: 'form',
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault()
          try {
            const sendData = async () => {
              await dispatch(deleteCategory(selectedCategory))
              await dispatch(getCategories())
            }
            sendData()
            handleDialogClose()
          } catch (err) {
            if (err instanceof ZodError) {
              toast.error(err.issues[0].message)
            } else console.log(err)
          }
        },
        sx: (theme) => ({ width: '40vw', minWidth: theme.spacing(50) }),
      }}
    >
      <DialogTitle>Eliminar una categoría</DialogTitle>
      <DialogContent>
        <InputLabel
          id="DeleteCategorySelect"
          sx={(theme) => ({ marginBottom: theme.spacing(1) })}
        >
          Categoría
        </InputLabel>
        <Select
          labelId="DeleteCategorySelect"
          value={selectedCategory}
          onChange={handleChange}
          sx={{ minWidth: '60%' }}
        >
          {sortedCategories?.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.nombre}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions sx={(theme) => ({ color: theme.palette.common.black })}>
        <Button onClick={handleDialogClose} color="inherit">
          Cancelar
        </Button>
        <Button
          type="submit"
          color="error"
          variant="contained"
          disabled={selectedCategory === ''}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
