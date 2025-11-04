// src/components/GlobalSnackbarProvider.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack'; // Importamos la librería original

/**
 * Componente que envuelve el SnackbarProvider para aplicar estilos globales del tema.
 * Se llama diferente para evitar conflictos de nombres, pero cumple la misma función.
 */
const GlobalSnackbarProvider = ({ children }) => {
    const theme = useTheme();

    // Estilos base para todas las notificaciones
    const commonSnackbarStyle = {
        fontWeight: 'bold',
        borderRadius: 8,
        padding: '8px 16px',
        color: theme.palette.primary.contrastText, 
    };

    return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={1000}
      SnackbarProps={{
        ContentProps: {
          sx: {
            fontWeight: "bold",
          },
        },
      }}
      Components={{
        success: (props) => (
          <div
            {...props}
            style={{
              backgroundColor: theme.palette.success.main, // Verde salvia
              color: theme.palette.text.primary,
              fontWeight: "bold",
              borderRadius: 8,
              padding: "8px 16px",
            }}
          >
            {props.message}
          </div>
        ),
        error: (props) => (
          <div
            {...props}
            style={{
              backgroundColor: theme.palette.secondary.main, // Terracota suave
              color: theme.palette.primary.contrastText,     // Blanco
              fontWeight: "bold",
              borderRadius: 8,
              padding: "8px 16px",
            }}
          >
            {props.message}
          </div>
        ),
        info: (props) => (
          <div
            {...props}
            style={{
              backgroundColor: theme.palette.info.main,       // Menta suave
              color: theme.palette.text.primary,    
              fontWeight: "bold",
              borderRadius: 8,
              padding: "8px 16px",
            }}
          >
            {props.message}
          </div>
        ),
        warning: (props) => (
          <div
            {...props}
            style={{
              backgroundColor: theme.palette.warning.main,   // Rosa seco claro
              color: theme.palette.text.primary,    
              fontWeight: "bold",
              borderRadius: 8,
              padding: "8px 16px",
            }}
          >
            {props.message}
          </div>
        ),
      }}
    >
      
            {children}
        </SnackbarProvider>
    );
};

export default GlobalSnackbarProvider;