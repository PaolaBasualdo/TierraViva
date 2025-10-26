// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#F5F5DC", // Beige claro (fondo principal)
      paper: "#EAD8C0",   // Arcilla clara (tarjetas)
    },
    primary: {
      main: "#6B8E23", // Verde oliva (botones principales)
      contrastText: "#fff",
    },
    secondary: {
      main: "#A3604D", // Terracota suave
      contrastText: "#fff",
    },
    text: {
      primary: "#5D4037", // Marrón tierra
      secondary: "#8C6D5A", // Marrón ceniza
    },
    info: {
      main: "#DDEAC3", // Menta suave
    },
    warning: {
      main: "#D8A48F", // Rosa seco claro
    },
    success: {
      main: "#A3B18A", // Verde salvia
    },
  },
  typography: {
    h6: {
      fontWeight: "bold",
      color: "#5D4037",
    },
    subtitle1: {
      fontWeight: "bold",
      color: "#5D4037",
    },
    body1: {
      color: "#5D4037",
    },
    body2: {
      color: "#8C6D5A",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(93, 64, 55, 0.2)", // Marrón sombra
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
  },
});

export default theme;
