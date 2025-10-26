// config/gemini.js

// Importar la clase principal de la IA
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'; // Cargar variables de entorno

// 1. Obtener la clave de forma segura
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("La variable de entorno GEMINI_API_KEY no está definida.");
}

// 2. Instanciar la clase principal de la IA
// La instancia 'ai' es la que tiene los métodos de generación.
const ai = new GoogleGenAI({ apiKey });

// 3. Exportar la instancia por defecto
// Exportamos solo la función 'generateContent' del cliente de IA.
// Esto es más limpio y se adapta mejor a cómo la usaremos en el controlador.
export const generateContent = async (contents) => {
    // Usamos gemini-2.5-flash como modelo predeterminado
    return ai.models.generateContent({ 
        model: "gemini-2.5-flash",
        contents: contents,
        // Eliminamos thinkingConfig, ya que no es un parámetro estándar en generateContent.
        // Si necesitas configurar la temperatura, usa 'config: { temperature: 0.0 }'
        // Lo dejaremos simple por ahora.
    });
};

// Exportamos la instancia ai completa (aunque no la usemos directamente en el controlador)
export default ai;