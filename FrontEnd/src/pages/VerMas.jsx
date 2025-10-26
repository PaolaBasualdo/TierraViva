import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  useTheme,
} from "@mui/material";

function VerMas() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        py: { xs: 3, md: 6 },
        px: { xs: 2, md: 8 },
      }}
    >
      {/* Encabezado */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: "bold",
          color: theme.palette.text.primary,
          mb: 5,
        }}
      >
        Ciruelas: Origen Ancestral y Riqueza Nutricional
      </Typography>

     
      <Grid
        container
        spacing={4}
        alignItems="center"
        sx={{
          mb: 8,
        }}
      >
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 6px 16px rgba(93, 64, 55, 0.25)",
            }}
          >
            <CardMedia
              component="img"
              height="360"
              image="https://cdn.pixabay.com/photo/2020/08/06/10/11/plums-5467517_1280.jpg"
              alt="Ciruelas frescas"
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              p: { xs: 2, md: 3 },
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 1.8, textAlign: "justify"  }}
            >
              La ciruela tiene una historia milenaria: su cultivo comenzó en
              China y, gracias a la Ruta de la Seda, llegó a Europa y luego a
              nuestras tierras. En Argentina se da especialmente bien en la
              región de Cuyo —Mendoza, San Juan y parte de Río Negro— donde el
              clima seco y el sol intenso realzan su sabor. Pero más allá de las
              grandes producciones, muchos vecinos siguen cultivando ciruelos en
              sus patios, como antes. Es una fruta que no necesita mucho más que
              sol, agua y tiempo. Estas ciruelas vienen directo del árbol,
              cosechadas a mano, con ese punto justo entre dulzura y acidez que
              solo tiene la fruta recién cortada.
            </Typography>
          </Card>
        </Grid>
      </Grid>

      
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Propiedades Destacadas
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: theme.palette.info.main,
                p: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                🌿 Aliada Digestiva
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                Su alto contenido de fibra y sorbitol la convierten en una fruta
                desintoxicante y laxante por excelencia, ideal para el bienestar
                intestinal.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: theme.palette.warning.main,
                p: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                💜 Poder Antioxidante
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                Rica en vitaminas A, C y E, que actúan como potentes
                antioxidantes, beneficiando la piel y fortaleciendo las
                defensas.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: theme.palette.success.main,
                p: 3,
                height: "100%",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                💧 Diurética
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                Gracias a su aporte de potasio, ayuda a aliviar la retención de
                líquidos y favorece la salud renal.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* Sección 3: Receta */}
      <Grid
        container
        spacing={4}
        alignItems="center"
        direction={{ xs: "column-reverse", md: "row" }}
      >
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.palette.background.paper,
              p: { xs: 2, md: 3 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                color: theme.palette.secondary.main,
                fontWeight: "bold",
              }}
            >
              🍰 Tarta Rústica de Ciruelas Frescas
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontSize: "1.1rem", lineHeight: 1.8, textAlign: "justify"  }}
            >
              La versatilidad de la ciruela la hace perfecta para postres. Cortá
              las ciruelas por la mitad, quitá el carozo y colocalas sobre una
              masa sencilla (como la de un bizcochuelo o crumble). Horneá con un
              poco de canela y azúcar rubia para obtener una tarta húmeda,
              aromática y deliciosa, ideal para acompañar un té o un mate.
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 6px 16px rgba(93, 64, 55, 0.25)",
            }}
          >
            <CardMedia
              component="img"
              height="360"
              image="https://cdn.pixabay.com/photo/2021/05/09/17/25/plum-6241552_1280.jpg"
              alt="Tarta de ciruelas frescas"
              sx={{ objectFit: "cover" }}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default VerMas;
