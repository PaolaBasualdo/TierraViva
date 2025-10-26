// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CarritoProvider } from "./contexts/CarritoContext";
import { SocketProvider } from "./contexts/SocketContext";
import RutaProtegida from "./components/RutaProtegida";
import ScrollToTop from "./components/ScrollToTop";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Páginas públicas
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import FormularioContacto from "./components/FormularioContacto";
import Categorias from "./pages/Categorias";
import CategoriaDetalle from "./pages/CategoriaDetalle";
import ProductoDetalle from "./pages/ProductoDetalle";
import ProductosxCategoria from "./components/ProductosxCategoria";
import Perfil from "./pages/Perfil";
import NuevoProducto from "./pages/NuevoProducto";
import MisProductos from "./pages/MisProductos";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerMas from "./pages/VerMas";

// Páginas admin
import Dashboard from "./pages/admin/Dashboard";
import ListaProductos from "./pages/admin/productos/ListaProductos";
import FormularioProducto from "./pages/admin/productos/FormularioProducto";
import ListaUsuarios from "./pages/admin/usuarios/ListaUsuarios";
import FormularioUsuario from "./pages/admin/usuarios/FormularioUsuario";
import ListaCategorias from "./pages/admin/categorias/ListaCategorias";
import FormularioCategoria from "./pages/admin/categorias/FormularioCategoria";

// Wrapper para proteger rutas de admin
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user || !user.es_admin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <GoogleOAuthProvider clientId="241025979521-4gdp0r3gf0cbaia9v5b148l01vp56ohn.apps.googleusercontent.com">
      <AuthProvider>
        <CarritoProvider>
          <SocketProvider>
            <ScrollToTop />
            <Routes>
              {/* Rutas públicas con layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/categoria/:id" element={<CategoriaDetalle />} />
                <Route
                  path="/productos/categoria/:id"
                  element={<ProductosxCategoria />}
                />
                <Route path="/productos/:id" element={<ProductoDetalle />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/vermas" element={<VerMas />} />

                {/* Carrito protegido */}
                <Route
                  path="/carrito"
                  element={
                    <RutaProtegida>
                      <Carrito />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/checkout/:idPedido"
                  element={
                    <RutaProtegida>
                      <Checkout />
                    </RutaProtegida>
                  }
                />

                {/* Solo usuarios normales pueden crear/editar sus productos */}
                <Route
                  path="/nuevo-producto"
                  element={
                    <RutaProtegida>
                      <NuevoProducto />
                    </RutaProtegida>
                  }
                />
                <Route
                  path="/mis-productos"
                  element={
                    <RutaProtegida>
                      <MisProductos />
                    </RutaProtegida>
                  }
                />
              </Route>

              {/* Rutas admin con layout propio */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Dashboard />} />

                {/* Productos */}
                <Route path="productos" element={<ListaProductos />} />
                <Route
                  path="productos/nuevo"
                  element={<FormularioProducto />}
                />
                <Route
                  path="productos/:id/editar"
                  element={<FormularioProducto />}
                />

                {/* Usuarios */}
                <Route path="usuarios" element={<ListaUsuarios />} />
                <Route path="usuarios/nuevo" element={<FormularioUsuario />} />
                <Route
                  path="usuarios/:id/editar"
                  element={<FormularioUsuario />}
                />

                {/* Categorías */}
                <Route path="categorias" element={<ListaCategorias />} />
                <Route
                  path="categorias/nuevo"
                  element={<FormularioCategoria />}
                />
                <Route
                  path="categorias/:id/editar"
                  element={<FormularioCategoria />}
                />
              </Route>

              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SocketProvider>
        </CarritoProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

{
  /*import { Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CarritoProvider } from "./contexts/CarritoContext";
import { SocketProvider } from "./contexts/SocketContext";
import RutaProtegida from "./components/RutaProtegida";
import ScrollToTop from "./components/ScrollToTop";
import Carrito from "./pages/Carrito";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Páginas públicas
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Contacto from "./pages/Contacto";
import Categorias from "./pages/Categorias";
import CategoriaDetalle from "./pages/CategoriaDetalle";
import ProductoDetalle from "./pages/ProductoDetalle";
import ProductosxCategoria from "./components/ProductosxCategoria";
import Perfil from "./pages/Perfil";
import NuevoProducto from "./pages/NuevoProducto";
import MisProductos from "./pages/MisProductos";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Páginas admin
import Dashboard from "./pages/admin/Dashboard";
import ListaProductos from "./pages/admin/productos/ListaProductos";
import FormularioProducto from "./pages/admin/productos/FormularioProducto";
import ListaUsuarios from "./pages/admin/usuarios/ListaUsuarios";
import FormularioUsuario from "./pages/admin/usuarios/FormularioUsuario";
import ListaCategorias from "./pages/admin/categorias/ListaCategorias";
import FormularioCategoria from "./pages/admin/categorias/FormularioCategoria";

// 🔹 Wrapper para proteger rutas de admin
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user || !user.es_admin) {
    // Si no es admin, redirige al home
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <GoogleOAuthProvider clientId="241025979521-4gdp0r3gf0cbaia9v5b148l01vp56ohn.apps.googleusercontent.com">
      <AuthProvider>
        <CarritoProvider>
          <SocketProvider>
            <ScrollToTop />
            <Routes>
              {/* Rutas públicas con layout *
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/categoria/:id" element={<CategoriaDetalle />} />
                <Route path="/productos/categoria/:id" element={<ProductosxCategoria />} />
                <Route path="/productos/:id" element={<ProductoDetalle />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Solo usuarios normales pueden crear/editar sus productos 
                <Route path="/nuevo-producto" element={
                  <RutaProtegida>
                    <NuevoProducto />
                  </RutaProtegida>
                } />
                <Route path="/mis-productos" element={
                  <RutaProtegida>
                    <MisProductos />
                  </RutaProtegida>
                } />
              </Route>

              {/* Rutas admin con layout propio 
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<Dashboard />} />

                {/* Productos *
                <Route path="productos" element={<ListaProductos />} />
                <Route path="productos/nuevo" element={<FormularioProducto />} />
                <Route path="productos/:id/editar" element={<FormularioProducto />} />

                {/* Usuarios 
                <Route path="usuarios" element={<ListaUsuarios />} />
                <Route path="usuarios/nuevo" element={<FormularioUsuario />} />
                <Route path="usuarios/:id/editar" element={<FormularioUsuario />} />

                {/* Categorías 
                <Route path="categorias" element={<ListaCategorias />} />
                <Route path="categorias/nuevo" element={<FormularioCategoria />} />
                <Route path="categorias/:id/editar" element={<FormularioCategoria />} />
              </Route>

              {/* Carrito protegido 
              <Route path="/carrito" element={
                <RutaProtegida>
                  <Carrito />
                </RutaProtegida>
              } />

              {/* Redirección por defecto 
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SocketProvider>
        </CarritoProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;*/
}
