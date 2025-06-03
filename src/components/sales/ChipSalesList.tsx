import React from 'react'
import { Box } from '@mui/material'
import { AddSaleDialog } from './salesDialogs/AddSaleDialog'
import {
  PaymentMethodsTypes,
  ProductSaleDetailsTypes,
  ProductTypes,
} from '@/types/CommonTypes'
import { PaymentMethodsDialogs } from './paymentMethodsDialogs/PaymentMethodsDialogs'

interface ChipSalesListTypes {
  handleAddProduct: (product: ProductTypes) => void
  handleProductQuantityChange: (id: string, newQuantity: number) => void
  handleSaleSubmit: () => void
  open: boolean
  paymentMethods: Array<PaymentMethodsTypes>
  productsList: ProductSaleDetailsTypes[]
  setOpen: (value: boolean) => void
  total: number
  resetSale: () => void
}

export const ChipSalesList = ({
  handleAddProduct,
  handleProductQuantityChange,
  handleSaleSubmit,
  open,
  paymentMethods,
  productsList,
  setOpen,
  total,
  resetSale,
}: ChipSalesListTypes) => {
  return (
    <Box display={'flex'} gap={2} justifyContent={'flex-end'}>
      <AddSaleDialog
        handleAddProduct={handleAddProduct}
        handleProductQuantityChange={handleProductQuantityChange}
        handleSaleSubmit={handleSaleSubmit}
        paymentMethods={paymentMethods}
        productsList={productsList}
        total={total}
        open={open}
        setOpen={setOpen}
        resetSale={resetSale}
      />
      <PaymentMethodsDialogs paymentMethods={paymentMethods} />
    </Box>
  )
}
