import { useState } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";

import {
  Home,
  ShoppingBag,
  People,
  Label,
  Logout,
} from "@mui/icons-material";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
} from "@mui/material";

import { useAuth } from "../contexts/AuthContext"; // 🔹 importamos el contexto

const drawerWidth = 240;

const navigation = [
  { name: "Dashboard", href: "/admin", icon: <Home sx={{ color: "#F9FAFB" }} /> },
  { name: "Productos", href: "/admin/productos", icon: <ShoppingBag sx={{ color: "#3B82F6" }} /> },
  { name: "Usuarios", href: "/admin/usuarios", icon: <People sx={{ color: "#22C55E" }} /> },
  { name: "Categorías", href: "/admin/categorias", icon: <Label sx={{ color: "#FACC15" }} /> },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [title, setTitle] = useState("Panel de Administración"); // título dinámico
  const navigate = useNavigate();
  const { logout } = useAuth(); // 🔹 usamos el logout del contexto

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();      // 🔹 limpia el user en contexto y borra tokens
    navigate("/"); // 🔹 vuelve al home
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#111827",
        color: "#F9FAFB",
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "#374151" }}>
        <Typography variant="h6" sx={{ color: "#F5F5DC", fontWeight: "bold" }}>
          Panel Admin
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {navigation.map((item) => (
          <ListItemButton
            key={item.name}
            component={NavLink}
            to={item.href}
            onClick={() => setTitle(item.name)}
            sx={{
              "&.Mui-selected": { bgcolor: "#1F2937" },
              "&.Mui-selected:hover": { bgcolor: "#374151" },
            }}
          >
            <ListItemIcon sx={{ color: "#F9FAFB" }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                sx: { color: "#6B8E23", fontWeight: "bold" },
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: "#374151" }} />

      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          component={Link}
          to="/"
          startIcon={
            <i className="fas fa-seedling" style={{ fontSize: 15, color: "#F9FAFB" }}></i>
          }
          sx={{ justifyContent: "flex-start", mb: 1 }}
        >
          Tierra Viva
        </Button>

        <Button
          fullWidth
          startIcon={<Logout sx={{ color: "#F9FAFB" }} />}
          sx={{ justifyContent: "flex-start" }}
          onClick={handleLogout} // 🔹 logout correcto
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#111827", color: "#F9FAFB" }}>
      {/* Sidebar Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", bgcolor: "#111827", color: "#F9FAFB" },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Sidebar Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box", bgcolor: "#111827", color: "#F9FAFB" },
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { lg: `calc(100% - ${drawerWidth}px)` } }}>
        <Box sx={{ mt: 2 }}>
          <Outlet context={{ setTitle }} />
        </Box>
      </Box>
    </Box>
  );
}
