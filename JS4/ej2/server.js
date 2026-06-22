import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3002;
const DATA_FILE = path.join(__dirname, "data", "usuarios.json");

// Middleware 
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Inicializar archivo de datos si no existe
async function initDataFile() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
  } catch(err) {
    console.error("Error inicializando datos:", err);
  }
}
initDataFile();

// ENDPOINTS DE LA API

// POST /api/usuarios
// Recibe { nombre, email } del cliente y lo guarda en JSON
// Responde con el ID asignado.

app.post("/api/usuarios", async (req, res) => {
  const { nombre, email } = req.body;
  const metodo = (req.headers["x-method"] || "json local").toLowerCase();

  if (!nombre || !email) {
    return res.status(400).json({ ok: false, message: "nombre y email son requeridos" });
  }

  const inicio = Date.now();
  try {
    const fileData = await fs.readFile(DATA_FILE, "utf-8");
    const usuarios = JSON.parse(fileData);
    
    // Contar desde el 11 como pidió el usuario
    const nextId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 11;
    
    const nuevoUsuario = { id: nextId, nombre, email };
    usuarios.push(nuevoUsuario);
    await fs.writeFile(DATA_FILE, JSON.stringify(usuarios, null, 2));

    const ms = Date.now() - inicio;
    console.log(`[EJ2][${metodo}] Usuario "${nombre}" creado con ID #${nextId} en ${ms}ms`);
    res.status(201).json({ ok: true, metodo, tiempoMs: ms, id: nextId, data: nuevoUsuario });

  } catch (error) {
    console.error(`[EJ2][${metodo}] Error:`, error.message);
    res.status(500).json({ ok: false, metodo, message: error.message });
  }
});

// Fallback al frontend 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicio del servidor 
app.listen(PORT, () => {
  console.log(`\n🚀 EJ2 corriendo en http://localhost:${PORT}`);
});
