import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import API from "../api";

const ChatComponent = () => {
  const theme = useTheme();
  const [textoInput, setTextoInput] = useState("");
  const [textoChat, setTextoChat] = useState([
    { remitente: "bot", texto: "Hola, soy tu asistente virtual. ¿En qué puedo ayudarte?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleConsulta = async () => {
    if (!textoInput.trim()) return;

    const nuevoMensajeUsuario = { remitente: "usuario", texto: textoInput };
    setTextoChat((prev) => [...prev, nuevoMensajeUsuario]);
    setIsLoading(true);

    try {
      const { data } = await API.post("/ia/consultaIA", { pregunta: textoInput });
      const nuevoMensajeIA = { remitente: "bot", texto: data.respuesta };
      setTextoChat((prev) => [...prev, nuevoMensajeIA]);
    } catch (error) {
      console.error("Error al consultar la IA:", error);
      setTextoChat((prev) => [
        ...prev,
        { remitente: "bot", texto: "Lo siento, hubo un problema de conexión." },
      ]);
    } finally {
      setIsLoading(false);
      setTextoInput("");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height: 300,
          overflowY: "auto",
          mb: 2,
          backgroundColor: theme.palette.info.main,
          borderRadius: 2,
          p: 1.5,
        }}
      >
        {textoChat.map((msg, i) => (
          <Box
            key={i}
            sx={{
              alignSelf: msg.remitente === "usuario" ? "flex-end" : "flex-start",
              bgcolor:
                msg.remitente === "usuario"
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
              color: theme.palette.primary.contrastText,
              px: 2,
              py: 1,
              borderRadius: 3,
              maxWidth: "80%",
            }}
          >
            <Typography variant="body2"sx={{
          color: theme.palette.primary.contrastText, // forzar color visible
        }}
            >{msg.texto}</Typography>
          </Box>
        ))}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <CircularProgress size={22} color="primary" />
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Escribe tu pregunta..."
          value={textoInput}
          onChange={(e) => setTextoInput(e.target.value)}
          disabled={isLoading}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleConsulta}
          disabled={isLoading}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default ChatComponent;
