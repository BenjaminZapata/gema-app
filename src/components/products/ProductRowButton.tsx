import { Button, ButtonProps, styled } from "@mui/material";

export const ProductRowButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: `1px solid ${theme.palette.common.black}`,
  borderRadius: theme.spacing(1),
  height: theme.spacing(4),
  minWidth: theme.spacing(0),
  padding: theme.spacing(0.5),
  width: theme.spacing(4),
  "& .MuiSvgIcon-root": {
    height: theme.spacing(2.5),
    width: theme.spacing(2.5),
  },
}));
