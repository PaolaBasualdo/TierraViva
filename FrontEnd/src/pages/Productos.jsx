
import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import ProductList from "../components/ProductList";
import ProductFilters from "../components/ProductFilters";

function Productos() {
  const [filters, setFilters] = useState({ nombre: "", precio: [0, 100000] });

  return (
     <Container sx={{ py: 4 }}>
      <ProductFilters onFilterChange={setFilters} />

    <Box
      sx={{
        minHeight: "60vh", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2, 
      }}
    >
      <ProductList limit={12} showVerTodos={false} filters={filters}/>
    </Box>
    </Container>
  );
}

export default Productos;
