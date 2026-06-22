import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3003;
const JSONPLACEHOLDER = "https://jsonplaceholder.typicode.com/users";

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Caché en memoria para no golpear la API en cada recarga 
let cacheUsuarios   = null;
let cacheFechaMs    = 0;
const CACHE_TTL_MS  = 5 * 60 * 1000; // 5 minutos

// ENDPOINTS DE LA API

// POST /api/usuarios
// Devuelve el array completo de usuarios de JSONPlaceholder.
// Cachea el resultado para evitar llamadas repetidas.
 
app.post("/api/usuarios", async (req, res) => {
  const ahora = Date.now();

  // Servir desde caché si es válida
  if (cacheUsuarios && (ahora - cacheFechaMs) < CACHE_TTL_MS) {
    console.log(`[EJ3] Sirviendo ${cacheUsuarios.length} usuarios desde caché`);
    return res.json({ ok: true, total: cacheUsuarios.length, fromCache: true, data: cacheUsuarios });
  }

  try {
    const inicio = Date.now();
    const { data } = await axios.get(JSONPLACEHOLDER);
    const ms = Date.now() - inicio;

    // Guardar en caché
    cacheUsuarios = data;
    cacheFechaMs  = ahora;

    console.log(`[EJ3] Obtenidos ${data.length} usuarios de API en ${ms}ms`);
    res.json({ ok: true, total: data.length, fromCache: false, tiempoMs: ms, data });
  } catch (error) {
    console.error("[EJ3] Error:", error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

// Fallback al frontend 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicio del servidor 
app.listen(PORT, () => {
  console.log(`\n EJ3 corriendo en http://localhost:${PORT}`);
});
