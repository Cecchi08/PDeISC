import express from 'express'
import path from 'path'
const app = express();
const PORT = 3001;
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Simulated user database
const usuarios = [];

let nextId = 6;

// ============================================================
// Función de validación reutilizable (devuelve array de errores)
// ============================================================
function validarCampos(datos) {
  const errores = [];

  if (!datos.nombre || datos.nombre.trim().length < 2)
    errores.push({ campo: 'Nombre', mensaje: 'Es requerido y debe tener al menos 2 caracteres.' });

  if (!datos.apellido || datos.apellido.trim().length < 2)
    errores.push({ campo: 'Apellido', mensaje: 'Es requerido y debe tener al menos 2 caracteres.' });

  if (!datos.edad || isNaN(datos.edad) || Number(datos.edad) < 1 || Number(datos.edad) > 120)
    errores.push({ campo: 'Edad', mensaje: 'Debe ser un número entre 1 y 120.' });

  if (!datos.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email))
    errores.push({ campo: 'Email', mensaje: 'Formato inválido (ej: alumno@universidad.edu).' });

  const legajo = Number(datos.legajo);
  if (!datos.legajo || !Number.isInteger(legajo) || legajo <= 0)
    errores.push({ campo: 'Número de legajo', mensaje: 'Debe ser un número entero positivo.' });

  if (!datos.carrera || datos.carrera.trim().length < 2)
    errores.push({ campo: 'Carrera', mensaje: 'Es requerida y debe tener al menos 2 caracteres.' });

  if (!datos.universidad || datos.universidad.trim().length < 2)
    errores.push({ campo: 'Universidad / Institución', mensaje: 'Es requerida y debe tener al menos 2 caracteres.' });

  const anio = Number(datos.anio);
  if (!datos.anio || isNaN(anio) || anio < 1 || anio > 10 || !Number.isInteger(anio))
    errores.push({ campo: 'Año de cursada', mensaje: 'Debe ser un número entero entre 1 y 10.' });

  return errores;
}

// GET - Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// GET - Get all users
app.get('/api/usuarios', (req, res) => {
  res.json({ success: true, usuarios });
});

// POST - Add new user (Method 1: JSON body)
app.post('/api/usuario/json', (req, res) => {
  const errores = validarCampos(req.body);
  if (errores.length > 0)
    return res.status(400).json({ success: false, errores });

  const { nombre, apellido, edad, email, legajo, carrera, universidad, anio } = req.body;
  const nuevo = { id: nextId++, nombre, apellido, edad: Number(edad), email,
                  legajo: Number(legajo), carrera, universidad, anio: Number(anio) };
  usuarios.push(nuevo);
  res.json({ success: true, usuario: nuevo, metodo: 'JSON Body (fetch + JSON.stringify)' });
});

// POST - Add user via URL-encoded form (Method 2: FormData / URLEncoded)
app.post('/api/usuario/form', (req, res) => {
  const errores = validarCampos(req.body);
  if (errores.length > 0)
    return res.status(400).json({ success: false, errores });

  const { nombre, apellido, edad, email, legajo, carrera, universidad, anio } = req.body;
  const nuevo = { id: nextId++, nombre, apellido, edad: Number(edad), email,
                  legajo: Number(legajo), carrera, universidad, anio: Number(anio) };
  usuarios.push(nuevo);
  res.json({ success: true, usuario: nuevo, metodo: 'FormData (URLEncoded)' });
});

// GET - Add user via Query Params (Method 3: Query String)
app.get('/api/usuario/query', (req, res) => {
  const errores = validarCampos(req.query);
  if (errores.length > 0)
    return res.status(400).json({ success: false, errores });

  const { nombre, apellido, edad, email, legajo, carrera, universidad, anio } = req.query;
  const nuevo = { id: nextId++, nombre, apellido, edad: Number(edad), email,
                  legajo: Number(legajo), carrera, universidad, anio: Number(anio) };
  usuarios.push(nuevo);
  res.json({ success: true, usuario: nuevo, metodo: 'Query String (?nombre=...&apellido=...)' });
});

app.listen(PORT, () => console.log(`Proyecto 1 corriendo en http://localhost:${PORT}`));