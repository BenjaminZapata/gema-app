import { Box, ButtonBase, ButtonBaseProps, styled } from "@mui/material";

export const StyledNavbar = styled(Box)(({ theme }) => ({
  alignItems: "center",
  background: theme.palette.primary.light,
  borderRight: `2px solid ${theme.palette.primary.main}`,
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  left: 0,
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
  position: "absolute",
  top: 0,
  transition: "width 0.3s ease",
  width: theme.spacing(9),
  zIndex: 1000,
  "&:hover .text": {
    display: "block",
    transitionDelay: "0.3s",
    transition: "display 0.3s ease",
  },
  "&:hover .button": {
    width: theme.spacing(15),
    transition: "width 0.3s ease",
  },
  "&:hover": {
    width: theme.spacing(20),
  },
}));

interface LinkButtonTypes extends ButtonBaseProps {
  pathname: string | null;
  button: {
    link: string;
  };
}

export const LinkButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== "pathname" && prop !== "button",
})<LinkButtonTypes>(({ button, theme, pathname }) => ({
  background:
    pathname == button.link
      ? theme.palette.primary.main
      : theme.palette.background.default,
  borderRadius: theme.spacing(0.75),
  color:
    pathname == button.link
      ? theme.palette.common.white
      : theme.palette.text.primary,
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: theme.spacing(0.5),
  padding: theme.spacing(1),
  width: theme.spacing(6),
  height: theme.spacing(6),
  "&:hover": {
    background: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));
