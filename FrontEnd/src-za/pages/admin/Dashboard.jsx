import { Card, CardContent, CardHeader, Typography, Box } from "@mui/material";
import { Inventory2, People, Category } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const statsCards = [
  {
    title: "Total Productos",
    value: "1,234",
    description: "+12% desde el mes pasado",
    icon: <Inventory2 sx={{ color: "#3B82F6" }} />,
  },
  {
    title: "Usuarios Activos",
    value: "856",
    description: "+8% desde el mes pasado",
    icon: <People sx={{ color: "#22C55E" }} />,
  },
];

const quickActions = [
  { name: "Agregar Producto", href: "/admin/productos/nuevo", icon: <Inventory2 sx={{ color: "#3B82F6" }} /> },
  { name: "Gestionar Usuarios", href: "/admin/usuarios", icon: <People sx={{ color: "#22C55E" }} /> },
  { name: "Ver Categorías", href: "/admin/categorias", icon: <Category sx={{ color: "#FACC15" }} /> },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, bgcolor: "#111827", minHeight: "100vh", p: 4 }}>
      
      {/* Welcome Section */}
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#F9FAFB" }}>
          Bienvenido al Panel de Administración
        </Typography>
        <Typography variant="body1" sx={{ color: "#D1D5DB" }}>
          Gestiona tu e-commerce desde aquí. Revisa las estadísticas y accede a las herramientas principales.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
        }}
      >
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            sx={{
              flex: "1 1 250px", // crece, encoge y ancho mínimo
              bgcolor: "#1F2937",
              color: "#F9FAFB",
            }}
          >
            <CardHeader
              avatar={stat.icon}
              title={
                <Typography variant="subtitle2" sx={{ color: "#D1D5DB" }}>
                  {stat.title}
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                {stat.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick Actions */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#F9FAFB" }}>
          Accesos Rápidos
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {quickActions.map((action, index) => (
            <Card
              key={index}
              onClick={() => navigate(action.href)}
              sx={{
                flex: "1 1 250px",
                bgcolor: "#1F2937",
                color: "#F9FAFB",
                cursor: "pointer",
                "&:hover": { bgcolor: "#374151" },
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                <Box sx={{ mr: 2 }}>{action.icon}</Box>
                <Typography variant="body1">{action.name}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
