const express = require('express');
const path = require('path');
const app = express();
const PORT = 3003;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

// El almacenamiento real es en el cliente (localStorage)
// El backend valida y devuelve confirmación (integración frontend-backend)
app.post('/api/validar-persona', (req, res) => {
  const persona = req.body;
  const errores = [];

  if (!persona.nombre || persona.nombre.trim().length < 2)
    errores.push('El nombre debe tener al menos 2 caracteres');
  if (!persona.apellido || persona.apellido.trim().length < 2)
    errores.push('El apellido debe tener al menos 2 caracteres');
  if (!persona.edad || persona.edad < 0 || persona.edad > 120)
    errores.push('La edad debe estar entre 0 y 120');
  if (!persona.fechaNacimiento)
    errores.push('La fecha de nacimiento es requerida');
  if (!['Masculino', 'Femenino'].includes(persona.sexo))
    errores.push('El sexo debe ser Masculino o Femenino');
  if (!persona.documento || !/^\d{7,8}$/.test(persona.documento))
    errores.push('El documento debe tener 7 u 8 dígitos');
  if (!persona.estadoCivil)
    errores.push('El estado civil es requerido');
  if (!persona.nacionalidad || persona.nacionalidad.trim().length < 2)
    errores.push('La nacionalidad es requerida');
  if (!persona.telefono || !/^\+?[\d\s\-]{8,15}$/.test(persona.telefono))
    errores.push('El teléfono no tiene un formato válido');
  if (!persona.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(persona.email))
    errores.push('El email no tiene un formato válido');
  if (persona.tieneHijos === 'si' && (!persona.cantidadHijos || persona.cantidadHijos < 1))
    errores.push('Indica la cantidad de hijos');

  if (errores.length > 0) {
    return res.status(400).json({ success: false, errores });
  }

  res.json({
    success: true,
    mensaje: 'Persona validada correctamente',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => console.log(`Proyecto 3 corriendo en http://localhost:${PORT}`));