import { useState } from "react";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import { ChipProductListButton } from "./ChipProductListButton";
import { AddCategoryDialog } from "./dialogs/AddCategoryDialog";
import { DeleteCategoryDialog } from "./dialogs/DeleteCategoryDialog";
import { AddSupplierDialog } from "./dialogs/AddSupplierDialog";
import { DeleteSupplierDialog } from "./dialogs/DeleteSupplierDialog";

export const ChipMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addCategoryOpen, setAddCategoryOpen] = useState<boolean>(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState<boolean>(false);
  const [addSupplierOpen, setAddSupplierOpen] = useState<boolean>(false);
  const [deleteSupplierOpen, setDeleteSupplierOpen] = useState<boolean>(false);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip
        disableInteractive
        title="Administrar categorias y proveedores"
        sx={(theme) => ({
          width: `${theme.spacing(2.5)} !important`,
        })}
      >
        <ChipProductListButton
          data-name="ChipMenu"
          onClick={handleMenuClick}
          variant="contained"
          color="success"
          sx={(theme) => ({
            borderBottomLeftRadius: theme.spacing(0),
            borderLeft: "none",
            borderTopLeftRadius: theme.spacing(0),
            width: `${theme.spacing(2.5)} !important`,
          })}
        />
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        aria-modal
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setAddCategoryOpen(true);
          }}
        >
          Agregar categoria
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setDeleteCategoryOpen(true);
          }}
        >
          Eliminar categoria
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setAddSupplierOpen(true);
          }}
        >
          Agregar proveedor
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setDeleteSupplierOpen(true);
          }}
        >
          Eliminar proveedor
        </MenuItem>
      </Menu>

      <AddCategoryDialog open={addCategoryOpen} setOpen={setAddCategoryOpen} />
      <DeleteCategoryDialog
        open={deleteCategoryOpen}
        setOpen={setDeleteCategoryOpen}
      />
      <AddSupplierDialog open={addSupplierOpen} setOpen={setAddSupplierOpen} />
      <DeleteSupplierDialog
        open={deleteSupplierOpen}
        setOpen={setDeleteSupplierOpen}
      />
    </>
  );
};
