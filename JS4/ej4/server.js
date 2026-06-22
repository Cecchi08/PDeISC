import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3004;
const DATA_FILE = path.join(__dirname, "data", "alumnos.json");

// Middleware 
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// CORS para desarrollo
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin",  "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// BASE DE DATOS EN ARCHIVO JSON
let alumnos = [];
let nextId = 1;

async function loadData() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      alumnos = JSON.parse(data);
      if (alumnos.length > 0) {
        nextId = Math.max(...alumnos.map(a => a.id)) + 1;
      }
    } catch {
      // Si el archivo no existe, lo creamos con datos iniciales
      alumnos = [
        { id: 1, nombre: "Valentina Romero",  email: "vale.romero@uni.edu",   carrera: "Ingeniería en Sistemas", anio: 3, promedio: 8.5 },
        { id: 2, nombre: "Mateo García",      email: "mateo.garcia@uni.edu",  carrera: "Diseño Gráfico",         anio: 1, promedio: 7.2 },
        { id: 3, nombre: "Lucía Fernández",   email: "lucia.fern@uni.edu",    carrera: "Administración",         anio: 4, promedio: 9.1 },
        { id: 4, nombre: "Santiago López",    email: "santi.lopez@uni.edu",   carrera: "Ingeniería en Sistemas", anio: 2, promedio: 6.8 },
        { id: 5, nombre: "Camila Torres",     email: "cami.torres@uni.edu",   carrera: "Contador Público",       anio: 3, promedio: 8.0 },
      ];
      await fs.writeFile(DATA_FILE, JSON.stringify(alumnos, null, 2));
      nextId = 6;
    }
  } catch(err) {
    console.error("Error al cargar datos:", err);
  }
}
await loadData();

async function saveData() {
  await fs.writeFile(DATA_FILE, JSON.stringify(alumnos, null, 2));
}

// VALIDACIÓN
// Valida los datos de un alumno.

function validarAlumno(body) {
  const errores = [];
  const nombre = String(body.nombre || "").trim();
  const nombreRegex = /^[a-zA-Z\s]{2,30}$/;
  if (!nombreRegex.test(nombre))
    errores.push("nombre debe tener entre 2 y 30 caracteres (solo letras)");
    
  const email = String(body.email || "").trim();
  if (!email.endsWith("@uni.edu") || email.length < 9)
    errores.push("email debe terminar en @uni.edu");
    
  const carrera = String(body.carrera || "").trim();
  const carreraRegex = /^[a-zA-Z\s]+$/;
  if (!carrera || !carreraRegex.test(carrera))
    errores.push("carrera debe contener solo letras");
    
  const anio = Number(body.anio);
  if (isNaN(anio) || anio < 1 || anio > 5)
    errores.push("anio debe ser entre 1 y 5");
    
  const promedio = Number(body.promedio);
  if (isNaN(promedio) || promedio < 0 || promedio > 10)
    errores.push("promedio debe ser entre 0 y 10");
    
  return { valido: errores.length === 0, errores };
}

// RUTAS (Todas por POST)

// POST /api/alumnos/list
// Devuelve todos los alumnos. Acepta { carrera } en el body.
app.post("/api/alumnos/list", (req, res) => {
  const { carrera } = req.body || {};
  let resultado = [...alumnos];
  if (carrera) {
    resultado = resultado.filter(a =>
      a.carrera.toLowerCase().includes(carrera.toLowerCase())
    );
  }
  console.log(`[EJ4] POST /api/alumnos/list → ${resultado.length} registros`);
  res.json({ ok: true, total: resultado.length, data: resultado });
});

// POST /api/alumnos/get
// Devuelve un alumno por ID. { id } en body.
app.post("/api/alumnos/get", (req, res) => {
  const id     = Number(req.body.id);
  const alumno = alumnos.find(a => a.id === id);
  if (!alumno) return res.status(404).json({ ok: false, message: `Alumno #${id} no encontrado` });
  res.json({ ok: true, data: alumno });
});

// POST /api/alumnos/create
// Crea un nuevo alumno. Body: { nombre, email, carrera, anio, promedio }
app.post("/api/alumnos/create", async (req, res) => {
  const { valido, errores } = validarAlumno(req.body);
  if (!valido) return res.status(400).json({ ok: false, errores });

  const nuevo = {
    id:       nextId++,
    nombre:   String(req.body.nombre).trim(),
    email:    String(req.body.email).trim().toLowerCase(),
    carrera:  String(req.body.carrera).trim(),
    anio:     Number(req.body.anio),
    promedio: Math.round(Number(req.body.promedio) * 10) / 10,
  };
  alumnos.push(nuevo);
  await saveData();
  
  console.log(`[EJ4] POST /api/alumnos/create → creado #${nuevo.id} "${nuevo.nombre}"`);
  res.status(201).json({ ok: true, message: "Alumno creado", data: nuevo });
});

// POST /api/alumnos/update
// Actualiza un alumno existente. Body: { id, nombre, email, carrera, anio, promedio }
app.post("/api/alumnos/update", async (req, res) => {
  const id  = Number(req.body.id);
  const idx = alumnos.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, message: `Alumno #${id} no encontrado` });

  alumnos[idx] = {
    ...alumnos[idx],
    nombre:   req.body.nombre  ? String(req.body.nombre).trim()   : alumnos[idx].nombre,
    email:    req.body.email   ? String(req.body.email).trim().toLowerCase()    : alumnos[idx].email,
    carrera:  req.body.carrera ? String(req.body.carrera).trim()  : alumnos[idx].carrera,
    anio:     req.body.anio    ? Number(req.body.anio)            : alumnos[idx].anio,
    promedio: req.body.promedio !== undefined ? Number(req.body.promedio) : alumnos[idx].promedio,
    id,
  };
  await saveData();
  
  console.log(`[EJ4] POST /api/alumnos/update → #${id} actualizado`);
  res.json({ ok: true, message: "Alumno actualizado", data: alumnos[idx] });
});

// POST /api/alumnos/delete
// Elimina un alumno por ID. Body: { id }
app.post("/api/alumnos/delete", async (req, res) => {
  const id  = Number(req.body.id);
  const idx = alumnos.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, message: `Alumno #${id} no encontrado` });
  const [eliminado] = alumnos.splice(idx, 1);
  await saveData();
  
  console.log(`[EJ4] POST /api/alumnos/delete → "${eliminado.nombre}" eliminado`);
  res.json({ ok: true, message: "Alumno eliminado", data: eliminado });
});

// POST /api/stats
// Estadísticas
app.post("/api/stats", (req, res) => {
  const total    = alumnos.length;
  const promProm = total ? (alumnos.reduce((s, a) => s + a.promedio, 0) / total).toFixed(2) : 0;
  const carreras = [...new Set(alumnos.map(a => a.carrera))].length;
  res.json({ ok: true, data: { total, promedioGeneral: Number(promProm), carreras } });
});

// Fallback al frontend 
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Inicio 
app.listen(PORT, () => {
  console.log(`\n EJ4 corriendo en http://localhost:${PORT}`);
});
