import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Autoplay, EffectCreative } from "swiper/modules";
import { Box, useTheme } from "@mui/material";

// imágenes locales
import miel2 from "../assets/miel2.jpg";
import panes from "../assets/panes.jpg";
import tomates2 from "../assets/tomates2.jpg";
import huevos2 from "../assets/huevos2.jpg";
import lechuga2 from "../assets/lechuga2.jpg";
import duraznos from "../assets/duraznos.jpg";

const images = [miel2, tomates2, panes, huevos2, lechuga2, duraznos];

function Banner() {
  const theme = useTheme(); // 👈 accede a los colores y tipografía de tu theme.js

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: 350,
        overflow: "hidden",
        backgroundColor: theme.palette.background.default, // 👈 beige definido en tu theme
      }}
    >
      <Swiper
        modules={[Autoplay, EffectCreative]}
        effect="creative"
        creativeEffect={{
          prev: { translate: ["-10%", 0, -100] },
          next: { translate: ["10%", 0, 0] },
        }}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000 }}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={img}
              alt={`Slide ${index + 1}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain", 
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default Banner;
