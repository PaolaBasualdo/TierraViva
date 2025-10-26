import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import FilterBar from "../components/FilterBar";
import ProductList from "../components/ProductList";
import Hero from "../components/Hero";
import { Box, Alert, Fade, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  

  return (
    <>
      <Banner />

      <Box sx={{ bgcolor: "#EAD8C0", py: 4, px: 2 }}>
        
        <FilterBar />
        <Box mb={4}>
          <ProductList
            limit={8}
            showPagination={false}
            orderBy="fecha_desc" // Trae los últimos productos primero
          />

          <Box mt={2} display="flex" justifyContent="center">
            <Link to="/productos" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#6B8E23",
                  "&:hover": { backgroundColor: "#557A1F" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "16px",
                  px: 6,
                  fontWeight: "bold",
                }}
              >
                Ver todos los productos
              </Button>
            </Link>
          </Box>
        </Box>

        <Hero />
      </Box>
    </>
  );
}

export default Home;
