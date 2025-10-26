import { Box, Button, Typography } from "@mui/material";

const ProductPagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null; // Si hay solo una página, no muestres nada

  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={2} mt={3}>
      <Button
        variant="outlined"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>

      <Typography fontWeight="bold">
        Página {page} de {totalPages}
      </Typography>

      <Button
        variant="outlined"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </Button>
    </Box>
  );
};

export default ProductPagination;
