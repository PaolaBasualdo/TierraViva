import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";

// Páginas del admin
import Dashboard from "./pages/admin/Dashboard";
import ListaProductos from "./pages/admin/productos/ListaProductos";
import FormularioProducto from "./pages/admin/productos/FormularioProducto";
import ListaUsuarios from "./pages/admin/usuarios/ListaUsuarios";
import FormularioUsuario from "./pages/admin/usuarios/FormularioUsuario";
import ListaCategorias from "./pages/admin/categorias/ListaCategorias";
import FormularioCategoria from "./pages/admin/categorias/FormularioCategoria";

function App() {
  return (
    <Routes>
      {/* Redirige la raíz al dashboard */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Zona Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />

        {/* Productos */}
        <Route path="productos" element={<ListaProductos />} />
        <Route path="productos/nuevo" element={<FormularioProducto />} />
        <Route path="productos/:id/editar" element={<FormularioProducto />} />

        {/* Usuarios */}
        <Route path="usuarios" element={<ListaUsuarios />} />
        <Route path="usuarios/nuevo" element={<FormularioUsuario />} />
        <Route path="usuarios/:id/editar" element={<FormularioUsuario />} />

        {/* Categorías */}
        <Route path="categorias" element={<ListaCategorias />} />
        <Route path="categorias/nuevo" element={<FormularioCategoria />} />
        <Route path="categorias/:id/editar" element={<FormularioCategoria />} />
      </Route>

      {/* Aquí agregar otras rutas públicas más adelante */}
      {/* <Route path="/" element={<Home />} /> */}
    </Routes>
  );
}

export default App;
