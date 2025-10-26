// src/components/Tabla.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TablePagination,
  Typography,
  Box,
} from "@mui/material";

function Tabla({
  columns = [],         // [{ field: "nombre", header: "Nombre" }, ...]
  rows = [],            // [{ id: 1, nombre: "..." }, ...]
  loading = false,      // true = muestra spinner
  page = 0,             // página actual (desde el padre)
  rowsPerPage = 10,     // cantidad de filas por página
  totalRows = 0,        // total de registros (para paginación backend)
  onPageChange,         // callback al cambiar página
  onRowsPerPageChange,  // callback al cambiar cantidad de filas por página
  renderActions,        // callback (row) => <Botones /> (editar/eliminar)
}) {
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "#121212",   // Fondo oscuro principal
        color: "#e0e0e0",     // Texto gris claro
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    bgcolor: "#1e1e1e", // fondo del header
                    color: "#ffffff",   // texto blanco
                    fontWeight: "bold",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {col.header}
                  </Typography>
                </TableCell>
              ))}
              {renderActions && (
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: "#1e1e1e",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  sx={{ textAlign: "center", py: 3 }}
                >
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  sx={{
                    "&:hover": { bgcolor: "#2c2c2c" }, // efecto hover oscuro
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.field}
                      sx={{ color: "#e0e0e0" }}
                    >
                      {row[col.field]}
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell align="center" sx={{ color: "#e0e0e0" }}>
                      {renderActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  align="center"
                  sx={{ color: "#9e9e9e" }}
                >
                  <Typography variant="body2">No hay registros</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={totalRows}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página"
        sx={{
          bgcolor: "#1e1e1e",
          color: "#e0e0e0",
          borderTop: "1px solid #333",
          "& .MuiTablePagination-actions button": {
            color: "#e0e0e0",
          },
        }}
      />
    </Paper>
  );
}

export default Tabla;
