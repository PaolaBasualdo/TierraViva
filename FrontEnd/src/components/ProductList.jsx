// src/components/ProductList.jsx
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProductCard from "./ProductCard";
import ProductPagination from "./ProductPagination";
import API from "../api";
import { getImageUrl } from "../utils/imageUtils";



const ProductList = ({
  categoria,
  limit = 8,
  showPagination = true,
  orderBy = null,
  filters = {},
}) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchProductos = async (newPage = 1) => {
    setLoading(true);
    try {
      const params = { page: newPage, limit };

      if (categoria) params.categoria = categoria;
      if (orderBy) params.orderBy = orderBy;

      // 
      if (filters.nombre) params.search = filters.nombre;
      if (filters.precio) {
        params.minPrecio = filters.precio[0];
        params.maxPrecio = filters.precio[1];
      }

      const { data } = await API.get("/productos", { params });

      if (data.success) {
        const processed = (data.data || []).map((p) => ({
          ...p,
          imagen: getImageUrl(p.imagen),
        }));
        setProductos(processed);
        setPagination(data.pagination);
        setPage(newPage);
      } else {
        setProductos([]);
      }
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [categoria, orderBy, JSON.stringify(filters)]); // 👈 compara por valor, no referencia

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (productos.length === 0)
    return (
      <Typography variant="h6" align="center" mt={4}>
        No hay productos para mostrar
      </Typography>
    );

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        {productos.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </Box>

      {showPagination && pagination && (
        <ProductPagination
          page={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={fetchProductos}
        />
      )}
    </Box>
  );
};

export default ProductList;


{/*import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProductCard from "./ProductCard";
import ProductPagination from "./ProductPagination";
import API from "../api";
import { getImageUrl } from "../utils/imageUtils";

const ProductList = ({
  categoria,
  limit = 8,
  showPagination = true,
  orderBy = null, //  nuevo prop
}) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchProductos = async (newPage = 1) => {
    setLoading(true);
    try {
      const params = { page: newPage, limit };
      if (categoria) params.categoria = categoria;
      if (orderBy) params.orderBy = orderBy; // 🔹 enviar al backend si existe

      const { data } = await API.get("/productos", { params });

      if (data.success) {
        const processed = (data.data || []).map((p) => ({
          ...p,
          imagen: getImageUrl(p.imagen),
        }));
        setProductos(processed);
        setPagination(data.pagination);
        setPage(newPage);
      } else {
        setProductos([]);
      }
    } catch (err) {
      console.error(err);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [categoria, orderBy]); // 🔹 recarga si cambia orderBy

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (productos.length === 0)
    return (
      <Typography variant="h6" align="center" mt={4}>
        No hay productos para mostrar
      </Typography>
    );

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        {productos.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </Box>

      {showPagination && pagination && (
        <ProductPagination
          page={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={fetchProductos}
        />
      )}
    </Box>
  );
};

export default ProductList;*/}
