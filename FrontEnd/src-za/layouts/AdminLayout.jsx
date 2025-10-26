import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  People,
  Label,
  Menu,
  Settings,
  Logout,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  Button,
} from "@mui/material";

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#111827", color: "#F9FAFB" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "#374151" }}>
        <Typography variant="h6">Admin Panel</Typography>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {navigation.map((item) => (
          <ListItemButton
            key={item.name}
            component={NavLink}
            to={item.href}
            onClick={() => setTitle(item.name)} // al hacer click cambia el título
            sx={{
              "&.Mui-selected": { bgcolor: "#1F2937" },
              "&.Mui-selected:hover": { bgcolor: "#374151" },
            }}
          >
            <ListItemIcon sx={{ color: "#F9FAFB" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: "#374151" }} />
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          startIcon={<Settings sx={{ color: "#F9FAFB" }} />}
          sx={{ justifyContent: "flex-start", mb: 1 }}
        >
          Configuración
        </Button>
        <Button
          fullWidth
          startIcon={<Logout sx={{ color: "#F9FAFB" }} />}
          sx={{ justifyContent: "flex-start" }}
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
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <AppBar
          position="sticky"
          sx={{
            bgcolor: "#1F2937",
            color: "#F9FAFB",
            width: { lg: `calc(100% - ${drawerWidth}px)` },
            ml: { lg: `${drawerWidth}px` },
          }}
          elevation={1}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { lg: "none" } }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              {title} {/* Título dinámico */}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ mt: 2 }}>
          <Outlet context={{ setTitle }} /> {/* Se pasa la función setTitle a cada página */}
        </Box>
      </Box>
    </Box>
  );
}
