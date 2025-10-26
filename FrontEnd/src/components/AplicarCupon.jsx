import { useState } from "react";
import { TextField, Button, Alert, Box, Typography } from "@mui/material";
import { useCuponContexto } from "../context/CuponContext";

export default function AplicarCupon() {
  const { cuponActivo, validarYAplicarCupon, quitarCupon } = useCuponContexto();

  const [codigo, setCodigo] = useState("");
  /*const [mensaje, setMensaje] = useState(null); // mensaje es un objeto { tipo: 'error' | 'success', texto: 'cupon aplicado con exito }*/
  const [mensaje, setMensaje] = useState("")

  const handleAplicar = async () => {
    const resultado = await validarYAplicarCupon(codigo);
    /*if (resultado.exito) {
      setMensaje({
        tipo: "success",
        texto: `Cupón "${resultado.cupon.nombreCupon}" (${resultado.cupon.porcentajeDescuento}%) aplicado con éxito.`,
      });
    } else {
      setMensaje({ tipo: "error", texto: resultado.mensaje });
    }*/
 if (resultado.exito) {
  setMensaje(`Cupón aplicado con éxito.`);
} else {
  setMensaje(resultado.mensaje);
}

    setCodigo("");
  };
 

  const handleQuitar = () => {
    quitarCupon();
    setMensaje("Cupón eliminado.");
    /*setMensaje({ tipo: "info", texto: "Cupón eliminado." });*/
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F5F5DC", // Beige claro
        padding: 3,
        borderRadius: 2,
        boxShadow: "0 2px 4px rgba(93, 64, 55, 0.2)", // Marrón sombra
        maxWidth: 500,
        margin: "auto",
        marginTop: 4,
      }}
    >
      <Typography variant="h6" sx={{ color: "#5D4037", marginBottom: 2 }}>
        Ingresá tu código de cupón
      </Typography>

      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          variant="outlined"
          label="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { color: "#5D4037" } }}
          sx={{
            input: { color: "#5D4037" },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff", // color de fondo normal
              "&:hover": {
                backgroundColor: "#FDEBD0", // por ejemplo, un beige claro en hover
              },
              "& fieldset": { borderColor: "#8C6D5A" },
              "&:hover fieldset": { borderColor: "#A3604D" },
              "&.Mui-focused fieldset": { borderColor: "#6B8E23" },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAplicar}
          sx={{
            backgroundColor: "#6B8E23", // Verde oliva
            color: "#fff",
            "&:hover": {
              backgroundColor: "#5D7230",
            },
          }}
        >
          Aplicar
        </Button>
      </Box>

      {mensaje && (
        <Alert
          severity={mensaje.tipo}
          sx={{
            backgroundColor: mensaje.tipo === "success" ? "#A3B18A" : "#A3604D",
            color: "#fff",
          }}
        >
          {mensaje}
        </Alert>
      )}

      {cuponActivo && (
        <Box sx={{ marginTop: 2 }}>
          <Button
            variant="outlined"
            onClick={handleQuitar}
            sx={{
              backgroundColor: "#6B8E23", // Verde oliva
              color: "#fff",
              "&:hover": {
                backgroundColor: "#5D7230",
              },
            }}
          >
            Quitar cupón
          </Button>
        </Box>
      )}
    </Box>
  );
}
