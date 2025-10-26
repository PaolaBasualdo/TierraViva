import React, { useState } from "react";
import { Fab, Box, Zoom, Paper, IconButton, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import ChatComponent from "./ChatComponent"; // tu chat existente
import { useTheme } from "@mui/material/styles";

const ChatWidget = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <Fab
        color="primary"
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Ventana del chat */}
      <Zoom in={open}>
        <Box
          sx={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 340,
            zIndex: 1299,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.5,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
              <Typography variant="subtitle1">Asistente Virtual</Typography>
              <IconButton
                size="small"
                onClick={() => setOpen(false)}
                sx={{ color: theme.palette.primary.contrastText }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ p: 1.5 }}>
              <ChatComponent />
            </Box>
          </Paper>
        </Box>
      </Zoom>
    </>
  );
};

export default ChatWidget;
