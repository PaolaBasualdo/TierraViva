import { Box, Container, Typography, Stack, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailIcon from "@mui/icons-material/Mail";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import CloseIcon from "@mui/icons-material/Close";

function Footer() {
  const iconColor = "background.paper"; // forzamos color contrastante
  const textColor = "background.paper";

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "secondary.main", // Terracota suave del theme
        color: textColor,
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          spacing={4}
          alignItems="flex-start"
        >
          {/* Contacto */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
              Contacto
            </Typography>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon sx={{ color: iconColor }} />
                <Typography sx={{ color: textColor }}>+54 9 1234 5678</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <WhatsAppIcon sx={{ color: iconColor }} />
                <Typography sx={{ color: textColor }}>+54 9 9876 5432</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <MailIcon sx={{ color: iconColor }} />
                <Typography sx={{ color: textColor }}>info@tierraviva.com</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Enlaces útiles */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
              Enlaces útiles
            </Typography>
            <Stack spacing={1}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: textColor }}>Inicio</Typography>
              </Link>
              <Link to="/productos" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: textColor }}>Productos</Typography>
              </Link>
              <Link to="/contacto" style={{ textDecoration: "none" }}>
                <Typography variant="body2" sx={{ color: textColor }}>Contacto</Typography>
              </Link>
            </Stack>
          </Box>

          {/* Redes sociales */}
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: textColor }}>
              Redes sociales
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton aria-label="Facebook" href="https://facebook.com" target="_blank" sx={{ color: iconColor }}>
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Instagram" href="https://instagram.com" target="_blank" sx={{ color: iconColor }}>
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="X" href="https://x.com" target="_blank" sx={{ color: iconColor }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>
        </Stack>

        <Typography variant="body2" align="center" sx={{ mt: 4, color: textColor }}>
          &copy; {new Date().getFullYear()} Tierra Viva. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
