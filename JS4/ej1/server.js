import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3001;
const JSONPLACEHOLDER = "https://jsonplaceholder.typicode.com/users";

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ENDPOINTS DE LA API

// GET /api/usuarios/fetch
// Obtiene los usuarios desde JSONPlaceholder usando el fetch nativo de Node.js 18+.
// Registra el tiempo de respuesta de la API externa.

app.post("/api/usuarios/fetch", async (req, res) => {
  const inicio = Date.now();
  try {
    const respuesta = await fetch(JSONPLACEHOLDER);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const data = await respuesta.json();
    
    const ms = Date.now() - inicio;
    console.log(`[EJ1][fetch] Obtenidos ${data.length} usuarios en ${ms}ms`);
    res.json({ ok: true, metodo: "fetch", tiempoMs: ms, data });
  } catch (error) {
    console.error("[EJ1][fetch] Error:", error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});


// GET /api/usuarios/axios
// Obtiene los usuarios desde JSONPlaceholder usando la librería axios.
// Registra el tiempo de respuesta de la API externa.

app.post("/api/usuarios/axios", async (req, res) => {
  const inicio = Date.now();
  try {
    const resultado = await axios.get(JSONPLACEHOLDER);
    const ms = Date.now() - inicio;
    
    console.log(`[EJ1][axios] Obtenidos ${resultado.data.length} usuarios en ${ms}ms`);
    res.json({ ok: true, metodo: "axios", tiempoMs: ms, data: resultado.data });
  } catch (error) {
    console.error("[EJ1][axios] Error:", error.message);
    res.status(500).json({ ok: false, message: error.message });
  }
});

// Fallback al frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicio del servidor 
app.listen(PORT, () => {
  console.log(`\n🚀 EJ1 corriendo en http://localhost:${PORT}`);
});
