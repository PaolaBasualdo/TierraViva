// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App.jsx";
import theme from "./theme/theme.js";
// Importamos el componente personalizado
import GlobalSnackbarProvider from "./components/GlobalSnackbarProvider.jsx"; 
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <BrowserRouter>
        {/* Usamos el componente wrapper limpio */}
        <GlobalSnackbarProvider>
          <App />
        </GlobalSnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
{/*import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";

import App from "./App.jsx";
import theme from "./theme/theme.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          ComponentsProps={{
            success: {
              style: {
                backgroundColor: theme.palette.success.main,
                color: theme.palette.primary.contrastText,
                fontWeight: "bold",
                borderRadius: 8,
                padding: "8px 16px",
              },
            },
            error: {
              style: {
                backgroundColor: theme.palette.error.main,
                color: theme.palette.primary.contrastText,
                borderRadius: 8,
                padding: "8px 16px",
              },
            },
            info: {
              style: {
                backgroundColor: theme.palette.text.primary,
                color: theme.palette.primary.contrastText,
                borderRadius: 8,
                padding: "8px 16px",
              },
            },
            warning: {
              style: {
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.primary.contrastText,
                borderRadius: 8,
                padding: "8px 16px",
              },
            },
          }}
        >
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);*/}

{
  /*import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App.jsx";
import theme from "./theme/theme.js"; 
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* resetea y normaliza estilos 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);*/
}
