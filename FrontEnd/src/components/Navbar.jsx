// src/components/Navbar.jsx
import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCarrito } from "../contexts/CarritoContext";
import { useSnackbar } from "notistack";  

const pages = [
  { name: "Inicio", path: "/" },
  { name: "Productos", path: "/productos" },
  { name: "Categorias", path: "/categorias" },
  { name: "Contacto", path: "/contacto" },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const { carrito } = useCarrito();

  const handleCarritoClick = (event) => {
    if (!user) {
      event.preventDefault(); // evita que navegue al carrito
      enqueueSnackbar("Debes iniciar sesión o registrarte para comprar productos 🛒", {
        variant: "warning",
      });
    }
  };


  return (
    <AppBar position="static" sx={{ bgcolor: "secondary.main" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            sx={{
              bgcolor: "background.default",
              borderRadius: "50%",
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              boxShadow: 3,
              border: "2px solid",
              borderColor: "secondary.main",
              mr: 2,
              display: { xs: "none", md: "flex" },
            }}
          >
            <i
              className="fas fa-seedling"
              style={{ fontSize: 24, color: "#6B8E23" }}
            ></i>
          </Box>

          {/* Título */}
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 6,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".01rem",
              color: "text.primary",
              textDecoration: "none",
            }}
            component={Link}
            to="/"
          >
            TIERRA VIVA
          </Typography>

          {/* Menú móvil */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                >
                  {page.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Links desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{ my: 2, color: "background.default", display: "block" }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Carrito + Login/Avatar + Botón Admin */}
          <Box
            sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}
          >
            <IconButton
              size="large"
              color="inherit"
              component={Link}
              to="/carrito"
              onClick={handleCarritoClick} 
            >
              <Badge badgeContent={carrito.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* 🔹 Botón "Volver al Panel Admin" solo para admin */}
            {isAuthenticated && user?.es_admin && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/admin")}
                sx={{ textTransform: "none" }}
              >
                Volver
              </Button>
            )}

            {/* 🔹 Solo mostrar Avatar/Perfil si NO es admin */}
            {isAuthenticated && !user?.es_admin ? (
              <>
                <Tooltip title="Cuenta">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user?.nombre}
                      src={user?.fotoPerfil || ""}
                      sx={{ bgcolor: "secondary.main" }}
                    >
                      {user?.nombre?.[0] || "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  sx={{ mt: "45px" }}
                >
                  <MenuItem
                    component={Link}
                    to="/perfil"
                    onClick={handleCloseUserMenu}
                  >
                    Perfil
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Salir</MenuItem>
                </Menu>
              </>
            ) : null}

            {/* 🔹 Botón Login solo si NO autenticado */}
            {!isAuthenticated && (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="inherit"
              >
                Iniciar sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
