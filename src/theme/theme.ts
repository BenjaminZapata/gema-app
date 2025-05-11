import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    common: {
      white: "#FCFCFC",
      black: "#050505",
    },
    primary: {
      main: "#0F4D7C",
      light: "#1768AC",
      dark: "#07324B",
    },
    secondary: {
      main: "#E7ADC5",
      dark: "#792359",
      light: "#F2D5E1",
    },
    background: {
      default: "#8AB2D4",
    },
    text: {
      primary: "#050505",
      disabled: "#CCCCCC",
      secondary: "#3E3E3E",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: "center",
          padding: "8px 16px",
        },
      },
    },
  },
});

export default theme;
