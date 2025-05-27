import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    others: Palette["primary"];
  }
  interface PaletteOptions {
    others: PaletteOptions["primary"];
  }
}

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
    others: {
      main: "#0F4D7C",
      light: "#00000036",
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
          padding: "4px",
        },
      },
    },
  },
});

export default theme;
