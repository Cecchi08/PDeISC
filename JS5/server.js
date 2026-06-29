import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from './db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const app  = express();
const PORT = 3000;
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Inicializa la base de datos
async function initDB() {
  await pool.query(`CREATE TABLE IF NOT EXISTS alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    edad INT NOT NULL
  )`);
  console.log('✔  Tabla "alumnos" lista.');
}

// Api de listar alumnos
app.post('/api/alumnos/listar', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alumnos ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener alumnos.' });
  }
});

// Api de agregar alumnos + validaciones con expresiones regulares
app.post('/api/alumnos/agregar', async (req, res) => {
  try {
    const { nombre, apellido, edad } = req.body;
    if (!nombre || !apellido || edad === undefined || edad === null || edad === '')
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });

    const n = nombre.trim(), a = apellido.trim();
    if (n.length < 2 || n.length > 30)
      return res.status(400).json({ error: 'El nombre debe tener entre 2 y 30 caracteres.' });
    if (!NAME_RE.test(n))
      return res.status(400).json({ error: 'El nombre solo puede contener letras y espacios.' });
    if (a.length < 2 || a.length > 30)
      return res.status(400).json({ error: 'El apellido debe tener entre 2 y 30 caracteres.' });
    if (!NAME_RE.test(a))
      return res.status(400).json({ error: 'El apellido solo puede contener letras y espacios.' });

    const edadNum = parseInt(edad, 10);
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 120)
      return res.status(400).json({ error: 'La edad debe ser un número entre 1 y 120.' });

    const [dup] = await pool.query(
      'SELECT id FROM alumnos WHERE LOWER(nombre)=LOWER(?) AND LOWER(apellido)=LOWER(?) AND edad=?',
      [n, a, edadNum]);
    if (dup.length > 0)
      return res.status(409).json({ error: `Ya existe un alumno con nombre "${n}", apellido "${a}" y edad ${edadNum}.` });

    const [result] = await pool.query(
      'INSERT INTO alumnos (nombre, apellido, edad) VALUES (?, ?, ?)', [n, a, edadNum]);
    res.status(201).json({ id: result.insertId, nombre: n, apellido: a, edad: edadNum });
  } catch (err) {
    console.error('Error POST /api/alumnos/agregar:', err.message);
    res.status(500).json({ error: 'Error interno al agregar alumno.' });
  }
});

// Api de modificar alumno (POST únicamente)
app.post('/api/alumnos/modificar', async (req, res) => {
  try {
    const { id, nombre, apellido, edad } = req.body;
    if (!id || !nombre || !apellido || edad === undefined || edad === null || edad === '')
      return res.status(400).json({ error: 'Todos los campos son obligatorios, incluyendo el ID.' });

    const idNum = parseInt(id, 10);
    if (isNaN(idNum))
      return res.status(400).json({ error: 'El ID proporcionado no es válido.' });

    const n = nombre.trim(), a = apellido.trim();
    if (n.length < 2 || n.length > 30)
      return res.status(400).json({ error: 'El nombre debe tener entre 2 y 30 caracteres.' });
    if (!NAME_RE.test(n))
      return res.status(400).json({ error: 'El nombre solo puede contener letras y espacios.' });
    if (a.length < 2 || a.length > 30)
      return res.status(400).json({ error: 'El apellido debe tener entre 2 y 30 caracteres.' });
    if (!NAME_RE.test(a))
      return res.status(400).json({ error: 'El apellido solo puede contener letras y espacios.' });

    const edadNum = parseInt(edad, 10);
    if (isNaN(edadNum) || edadNum < 1 || edadNum > 120)
      return res.status(400).json({ error: 'La edad debe ser un número entre 1 y 120.' });

    // Verificar que el alumno a modificar exista
    const [exists] = await pool.query('SELECT id FROM alumnos WHERE id = ?', [idNum]);
    if (exists.length === 0)
      return res.status(444).json({ error: 'El alumno a modificar no existe en el sistema.' });

    // Verificar duplicados con otro alumno
    const [dup] = await pool.query(
      'SELECT id FROM alumnos WHERE LOWER(nombre)=LOWER(?) AND LOWER(apellido)=LOWER(?) AND edad=? AND id != ?',
      [n, a, edadNum, idNum]);
    if (dup.length > 0)
      return res.status(409).json({ error: `Ya existe otro alumno con nombre "${n}", apellido "${a}" y edad ${edadNum}.` });

    // Actualizar registro
    await pool.query(
      'UPDATE alumnos SET nombre = ?, apellido = ?, edad = ? WHERE id = ?',
      [n, a, edadNum, idNum]
    );

    res.json({ id: idNum, nombre: n, apellido: a, edad: edadNum });
  } catch (err) {
    console.error('Error POST /api/alumnos/modificar:', err.message);
    res.status(500).json({ error: 'Error interno al modificar alumno.' });
  }
});

// Primero inicializa la db, si está bien entonces carga el servidor
initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
}).catch((err) => {
  console.error('❌ Error DB:', err.message);
  process.exit(1);
});
