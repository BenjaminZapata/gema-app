import React, { useState } from 'react'
import { Box, Button, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { AddPaymentMethodDialog } from './AddPaymentMethodDialog'
import { DeletePaymentMethodDialog } from './DeletePaymentMethodDialog'
import { PaymentMethodsTypes } from '@/types/CommonTypes'

interface PaymentMethodsDialogsTypes {
  paymentMethods: Array<PaymentMethodsTypes>
}

export const PaymentMethodsDialogs = ({
  paymentMethods,
}: PaymentMethodsDialogsTypes) => {
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Tooltip
        disableInteractive
        title="Administrar metodos de pago"
        sx={(theme) => ({
          height: theme.spacing(5),
          width: `${theme.spacing(2.5)} !important`,
        })}
      >
        <Button
          color="info"
          variant="contained"
          onClick={handleMenuClick}
          sx={(theme) => ({
            border: `1px solid ${theme.palette.common.black}`,
            width: 'max-content',
          })}
        >
          Metodos de pago
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        aria-modal
      >
        <MenuItem
          onClick={() => {
            setOpenAdd(true)
            setAnchorEl(null)
          }}
        >
          Agregar metodo de pago
        </MenuItem>
        <Tooltip
          disableInteractive
          title={
            paymentMethods.length === 0
              ? 'No hay metodos de pago añadidos'
              : null
          }
          sx={(theme) => ({
            height: theme.spacing(5),
            width: `${theme.spacing(2.5)} !important`,
          })}
        >
          <Typography component={'span'}>
            <MenuItem
              disabled={paymentMethods?.length == 0}
              onClick={() => {
                setOpenDelete(true)
                setAnchorEl(null)
              }}
            >
              Eliminar metodo de pago
            </MenuItem>
          </Typography>
        </Tooltip>
      </Menu>
      <AddPaymentMethodDialog open={openAdd} setOpen={setOpenAdd} />
      <DeletePaymentMethodDialog open={openDelete} setOpen={setOpenDelete} />
    </Box>
  )
}
