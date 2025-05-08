import { Button, ButtonProps, styled } from "@mui/material";

export const ChipProductListButton = styled(Button)<ButtonProps>(
  ({ theme }) => ({
    border: `1px solid ${theme.palette.common.black}`,
    borderRadius: theme.spacing(1),
    height: theme.spacing(5),
    minWidth: theme.spacing(0),
    padding: theme.spacing(1),
    width: theme.spacing(5),
  })
);
