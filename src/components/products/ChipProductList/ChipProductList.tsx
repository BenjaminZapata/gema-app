// Importes de terceros
import { Box, Tooltip } from "@mui/material";
import { Replay } from "@mui/icons-material";
// Importes propios
import { AddProductDialog } from "./dialogs/AddProductDialog";
import { ChipMenu } from "./ChipMenu";
import { ChipProductListButton } from "./ChipProductListButton";
import { NameFilter } from "./NameFilter";
import { FiltersDialog } from "./dialogs/FiltersDialog";
import { ProductFiltersStateTypes } from "@/types/CommonTypes";

interface ChipProductListProps {
  activeFilters: ProductFiltersStateTypes;
  applyFilters: (filtersFromDialog: ProductFiltersStateTypes) => void;
  nameInput: string;
  reloadData: () => Promise<void>;
  setNameInput: (data: string) => void;
}

export const ChipProductList = ({
  activeFilters,
  applyFilters,
  nameInput,
  reloadData,
  setNameInput,
}: ChipProductListProps) => {
  return (
    <Box
      alignItems={"center"}
      display={"flex"}
      data-name="ChipProductList"
      gap={10}
      justifyContent={"center"}
      mx={"auto"}
      mt={2}
      sx={(theme) => ({
        background: theme.palette.primary.contrastText,
        border: `solid 1px ${theme.palette.others.light}`,
        borderRadius: theme.spacing(1),
        height: theme.spacing(8),
        maxWidth: "max-content",
        padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
      })}
    >
      <NameFilter nameInput={nameInput} setNameInput={setNameInput} />

      <Box display={"flex"} gap={2}>
        <Box>
          <AddProductDialog />
          <ChipMenu />
        </Box>

        <FiltersDialog
          activeFilters={activeFilters}
          applyFilters={applyFilters}
        />

        <Tooltip disableInteractive title="Recargar información">
          <ChipProductListButton
            variant="contained"
            color="warning"
            onClick={reloadData}
          >
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
