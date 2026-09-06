// Componente / Módulo: auth
// Propósito: Maneja la lógica y la vista/rutas relacionadas con auth.
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();

// Validations
const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRgx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const nameRgx = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol = 'user' } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  if (!nameRgx.test(nombre))
    return res.status(400).json({ error: 'Nombre inválido (2-50 letras).' });
  if (!emailRgx.test(email))
    return res.status(400).json({ error: 'Email inválido.' });
  if (!passRgx.test(password))
    return res.status(400).json({ error: 'La contraseña debe tener mín. 8 caracteres, mayúscula, minúscula y número.' });

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0)
    return res.status(409).json({ error: 'El email ya está registrado.' });

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, hash, rol]
  );

  const token = jwt.sign({ id: result.insertId, email, rol }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.status(201).json({ token, user: { id: result.insertId, nombre, email, rol } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos.' });

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0)
    return res.status(401).json({ error: 'Credenciales incorrectas.' });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ error: 'Credenciales incorrectas.' });

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
});

export default router;
