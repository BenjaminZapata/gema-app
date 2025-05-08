// Importes de terceros
import { Box, Tooltip } from '@mui/material';
import { FilterList, Replay } from '@mui/icons-material';
// Importes propios
import { AddProductDialog } from './dialogs/AddProductDialog';
import { ChipMenu } from './ChipMenu';
import { ChipProductListButton } from './ChipProductListButton';
import { NameFilter } from './NameFilter';
import { ProductTypes } from '@/types/CommonTypes';

interface ChipProductListProps {
  inputValue: string;
  productList: Array<ProductTypes>;
  reloadData: () => Promise<void>;
  setInputValue: (data: string) => void;
  setProductList: (data: Array<ProductTypes>) => void;
}

export const ChipProductList = ({
  inputValue,
  productList,
  reloadData,
  setInputValue,
  setProductList,
}: ChipProductListProps) => {
  return (
    <Box
      alignItems={'center'}
      display={'flex'}
      data-name='ChipProductList'
      gap={10}
      justifyContent={'center'}
      mx={'auto'}
      sx={(theme) => ({
        background: theme.palette.primary.contrastText,
        borderRadius: theme.spacing(1),
        maxWidth: 'max-content',
        padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
        height: theme.spacing(8),
      })}>
      <NameFilter
        inputValue={inputValue}
        productList={productList}
        setInputValue={setInputValue}
        setProductsList={setProductList}
      />

      <Box display={'flex'} gap={2}>
        <Box>
          <AddProductDialog />
          <ChipMenu />
        </Box>

        <Tooltip disableInteractive title='Cambiar filtros'>
          <ChipProductListButton variant='contained' color='info'>
            <FilterList
              sx={(theme) => ({
                color: theme.palette.primary.contrastText,
              })}
            />
          </ChipProductListButton>
        </Tooltip>

        <Tooltip disableInteractive title='Recargar información'>
          <ChipProductListButton variant='contained' color='warning' onClick={reloadData}>
            <Replay
              sx={(theme) => ({
                color: theme.palette.primary.contrastText,
              })}
            />
          </ChipProductListButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
