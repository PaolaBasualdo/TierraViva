/// controllers/ai.controller.js
import { generateContent } from "../config/gemini.js";
import { Producto } from "../models/index.js";

export const controladorConsultaIA = async (req, res) => {
  try {
    const { pregunta } = req.body;
    if (!pregunta) return res.status(400).json({ error: "Falta la pregunta" });

    // === CONTEXTOS ACTUALIZADOS PARA TIERRA VIVA ===
    const INFO_BASE = {
      VARIOS: `
Tierra Viva es una plataforma comunitaria de e-commerce diseñada para conectar a pequeños productores locales con consumidores conscientes. 
Promueve la venta de productos artesanales, naturales y sustentables, priorizando la cercanía, el comercio justo y la economía circular. 
Los usuarios pueden registrarse, explorar un catálogo por categorías, agregar productos al carrito y realizar compras seguras. 
Quienes deseen vender, pueden solicitar el rol de vendedor y publicar sus productos, los cuales serán revisados y aprobados por un administrador antes de hacerse visibles en el catálogo. 
Tierra Viva se distingue por su enfoque humano: busca fortalecer la comunidad local y valorizar el trabajo artesanal. 
Responde la pregunta en base a este contexto. Si la consulta es general sobre la plataforma, explica su propósito, funcionamiento básico y valores comunitarios.
      `,

      ENVIOS: `
Tierra Viva no utiliza servicios de paquetería tradicionales. En su lugar, fomenta métodos de entrega locales, sostenibles y con contacto directo entre comprador y vendedor. 
Después de confirmar la compra, las partes coordinan la entrega de manera personal, fomentando la confianza y la cercanía. 
Los métodos de entrega disponibles incluyen:
- Retiro en puntos de encuentro comunitarios (almacenes, ferias o espacios locales).
- Entregas a domicilio realizadas por una red local, generalmente a pie, en bicicleta o moto.
- Retiro en el domicilio del vendedor, si este lo autoriza.
El sistema actúa como un puente que facilita el contacto, sin intermediar en la logística. 
Responde la pregunta en base a este contexto y evita mencionar empresas de envío externas o procesos automáticos.
      `,

      PRODUCTOS: `
Los productos ofrecidos en Tierra Viva son artesanales, naturales y respetuosos con el medio ambiente. 
Cada producto incluye información sobre su origen, materiales y características de sostenibilidad. 
Algunos artículos son de temporada o edición limitada, identificados con etiquetas visibles como "Producto de Estación", "Stock Limitado" o "Edición Única". 
Los precios y stocks pueden variar según la disponibilidad local o la época del año. 
A continuación se incluye la lista actual de productos disponibles. Responde la pregunta únicamente en base a esta lista y su información. 
Si no encuentras el producto consultado, responde que no está disponible actualmente en la plataforma.
      `,

      USUARIOS: `
En Tierra Viva existen tres tipos de usuarios con roles y permisos específicos:

- **Comprador:** Puede navegar el catálogo, agregar productos al carrito, realizar compras y dejar calificaciones sobre los productos adquiridos.

- **Vendedor:** Puede solicitar el rol de vendedor desde su perfil. Una vez aprobado por un administrador, podrá publicar, editar o eliminar sus productos (mientras estén pendientes de revisión). Las publicaciones deben cumplir los valores de sostenibilidad y calidad del sitio.

- **Administrador:** Supervisa el funcionamiento general del sistema. Tiene acceso a la gestión de usuarios, aprobación de productos, categorías y órdenes de compra.

El registro de usuario es sencillo y seguro. Cada cuenta se crea inicialmente con el rol de comprador, y los permisos se amplían según la aprobación del administrador.
Responde la pregunta en base a este contexto si se consulta sobre registro, roles o permisos dentro del sistema.
      `
    };

    // === PASO 1: Clasificación con la IA ===
    const textoFiltro = `
Clasifica la siguiente pregunta en una de estas categorías: VARIOS, ENVIOS, PRODUCTOS o USUARIOS.
Solo responde con una palabra exacta.
Pregunta: "${pregunta}"
    `;

    const responseFiltro = await generateContent(textoFiltro);
    let palabraClave = responseFiltro.text.trim().toUpperCase();

    if (!["VARIOS", "ENVIOS", "PRODUCTOS", "USUARIOS"].includes(palabraClave)) {
      console.warn(`Clasificación inesperada: ${palabraClave}. Usando VARIOS por defecto.`);
      palabraClave = "VARIOS";
    }

    console.log("Categoría detectada:", palabraClave);

    // === PASO 2: Construcción del Prompt con el Contexto ===
    let contextoEspecial = "";

   if (palabraClave === "PRODUCTOS") {
      try {
        // MODIFICACIÓN CLAVE: Quitamos el 'limit: 10' para buscar en toda la BD.
        const productosDB = await Producto.findAll({
          attributes: ["nombre", "precio", "stock"],
          // AÑADIDO: Aseguramos que solo se consulten productos publicados (asumiendo que 'estado' = 'aprobado'/'publicado' es el campo)
          where: {
                // Aquí debes usar el campo real de tu modelo (ej. 'estado' o 'publicado')
                // Asumimos un campo 'estado' y un valor 'aprobado' o similar
              estado: 'aprobado' 
          }, 
          // Si el catálogo es grande (más de 100 items), puedes ordenar por relevancia o nombre, si no, lo dejamos simple.
          // limit: 10 <-- ¡ELIMINADO!
        });

        const textoProductos = productosDB
          .map((p) => `${p.nombre} - $${p.precio.toFixed(2)} - stock: ${p.stock}`)
          .join(". ");
          
        // Si no hay productos, la lista no se envía
        if (productosDB.length === 0) {
            contextoEspecial = "Actualmente no tenemos productos disponibles en el catálogo.";
        } else {
            contextoEspecial = `Lista de productos disponibles: ${textoProductos}.`;
        }

      } catch (errorDB) {
        console.error("Error al consultar productos:", errorDB.message);
        contextoEspecial = "No fue posible obtener la lista de productos en este momento.";
      }
    }

    const promptFinal = `
${INFO_BASE[palabraClave]} 
${contextoEspecial}

Responde la siguiente pregunta del usuario: "${pregunta}".

👉 Instrucciones de estilo:
- Usa un tono cercano y amable.
- Escribe en **primera persona**, como si hablara un asistente humano.
- La respuesta debe ser **breve y clara (máximo 120 caracteres)**.
- Si no tienes información suficiente, responde: "Lo siento, no tengo información sobre eso en este momento."
`;

    // === PASO 3: Generación de la Respuesta Final ===
    const respuestaIA = await generateContent(promptFinal);
    const textoFinal = respuestaIA.text;

    console.log("Respuesta IA:", textoFinal);
    return res.status(200).json({ respuesta: textoFinal });

  } catch (error) {
    console.error("Error en controladorConsultaIA:", error);
    return res.status(500).json({
      error: "Error interno del servidor al consultar la IA.",
      detalle: error.message
    });
  }
};
