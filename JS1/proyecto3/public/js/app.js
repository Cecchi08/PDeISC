// ============================================================
// PROYECTO 3 — ALMACÉN DE PERSONAS CON LOCALSTORAGE
// ============================================================

const LS_KEY = 'almacen_personas';

// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderizarPersonas();
  actualizarStats();
});

// ============================================================
// TOGGLE CAMPO HIJOS
// ============================================================
function toggleCantidadHijos() {
  const val = document.querySelector('input[name="tieneHijos"]:checked')?.value;
  const campo = document.getElementById('campo-cantidad-hijos');
  const input = document.getElementById('cantidadHijos');
  campo.style.display = val === 'si' ? 'block' : 'none';
  if (val !== 'si') { input.value = ''; limpiarError('cantidadHijos'); }
}

// ============================================================
// VALIDACIONES DINÁMICAS (en tiempo real)
// ============================================================

// Añadir validación en tiempo real al cargar
document.addEventListener('DOMContentLoaded', () => {
  const campos = ['nombre','apellido','edad','fechaNacimiento','sexo','documento','estadoCivil','nacionalidad','telefono','email','cantidadHijos'];
  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => validarCampo(id));
      el.addEventListener('change', () => validarCampo(id));
    }
  });
});

function validarCampo(id) {
  const el = document.getElementById(id);
  if (!el) return true;
  const val = el.value.trim();
  let error = '';

  switch (id) {
    case 'nombre':
    case 'apellido':
      if (!val) error = `El ${id} es requerido`;
      else if (val.length < 2) error = `El ${id} debe tener al menos 2 caracteres`;
      else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(val)) error = `Solo letras permitidas`;
      break;

    case 'edad':
      if (!val) error = 'La edad es requerida';
      else if (isNaN(val) || val < 0 || val > 120) error = 'Edad debe ser entre 0 y 120';
      break;

    case 'fechaNacimiento':
      if (!val) error = 'La fecha es requerida';
      else if (new Date(val) > new Date()) error = 'La fecha no puede ser futura';
      break;

    case 'sexo':
      if (!val) error = 'Seleccioná el sexo';
      break;

    case 'documento':
      if (!val) error = 'El documento es requerido';
      else if (!/^\d{7,8}$/.test(val)) error = 'Debe tener 7 u 8 dígitos numéricos';
      break;

    case 'estadoCivil':
      if (!val) error = 'Seleccioná el estado civil';
      break;

    case 'nacionalidad':
      if (!val) error = 'La nacionalidad es requerida';
      else if (val.length < 2) error = 'Debe tener al menos 2 caracteres';
      break;

    case 'telefono':
      if (!val) error = 'El teléfono es requerido';
      else if (!/^\+?[\d\s\-]{8,15}$/.test(val)) error = 'Formato inválido (ej: +54 223 1234567)';
      break;

    case 'email':
      if (!val) error = 'El email es requerido';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Email inválido (ej: juan@gmail.com)';
      break;

    case 'cantidadHijos':
      const tieneHijos = document.querySelector('input[name="tieneHijos"]:checked')?.value;
      if (tieneHijos === 'si') {
        if (!val || val < 1) error = 'Ingresá la cantidad de hijos (mín. 1)';
        else if (val > 20) error = 'Cantidad excesiva';
      }
      break;
  }

  if (error) {
    el.classList.add('is-invalid');
    el.classList.remove('is-valid');
    document.getElementById(`err-${id}`).textContent = error;
    return false;
  } else {
    el.classList.remove('is-invalid');
    el.classList.add('is-valid');
    document.getElementById(`err-${id}`).textContent = '';
    return true;
  }
}

function limpiarError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('is-invalid', 'is-valid');
  const errEl = document.getElementById(`err-${id}`);
  if (errEl) errEl.textContent = '';
}

// ============================================================
// VALIDAR FORMULARIO COMPLETO
// ============================================================
function validarFormulario() {
  const campos = ['nombre','apellido','edad','fechaNacimiento','sexo','documento','estadoCivil','nacionalidad','telefono','email'];
  let todoBien = true;

  campos.forEach(id => { if (!validarCampo(id)) todoBien = false; });

  // Validar radio hijos
  const tieneHijos = document.querySelector('input[name="tieneHijos"]:checked');
  const errHijos = document.getElementById('err-tieneHijos');
  if (!tieneHijos) {
    errHijos.textContent = 'Indicá si tiene hijos';
    todoBien = false;
  } else {
    errHijos.textContent = '';
    if (tieneHijos.value === 'si' && !validarCampo('cantidadHijos')) todoBien = false;
  }

  return todoBien;
}

// ============================================================
// GUARDAR PERSONA
// ============================================================
async function guardarPersona(event) {
  event.preventDefault();

  if (!validarFormulario()) {
    mostrarNotif('❌ Corregí los errores antes de guardar', 'error');
    // Scroll al primer error
    const primerError = document.querySelector('.is-invalid');
    if (primerError) primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const tieneHijos = document.querySelector('input[name="tieneHijos"]:checked')?.value;

  const persona = {
    id: Date.now(),
    nombre: document.getElementById('nombre').value.trim(),
    apellido: document.getElementById('apellido').value.trim(),
    edad: parseInt(document.getElementById('edad').value),
    fechaNacimiento: document.getElementById('fechaNacimiento').value,
    sexo: document.getElementById('sexo').value,
    documento: document.getElementById('documento').value.trim(),
    estadoCivil: document.getElementById('estadoCivil').value,
    nacionalidad: document.getElementById('nacionalidad').value.trim(),
    telefono: document.getElementById('telefono').value.trim(),
    email: document.getElementById('email').value.trim(),
    tieneHijos,
    cantidadHijos: tieneHijos === 'si' ? parseInt(document.getElementById('cantidadHijos').value) : 0,
    fechaRegistro: new Date().toLocaleString('es-AR'),
  };

  // Mostrar loader
  const btn = document.querySelector('.btn-guardar');
  btn.disabled = true;
  btn.textContent = '⏳ Validando con servidor...';
  mostrarNotif('🔄 Validando datos con el servidor...', 'info');

  try {
    // VALIDACIÓN EN BACKEND (integración frontend-backend)
    const res = await fetch('/api/validar-persona', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(persona),
    });

    const data = await res.json();

    if (!data.success) {
      mostrarNotif('❌ Errores del servidor:\n' + data.errores.join('\n'), 'error');
      return;
    }

    // GUARDAR EN LOCALSTORAGE
    const personas = obtenerPersonas();

    // Verificar duplicado por documento
    const existe = personas.find(p => p.documento === persona.documento);
    if (existe) {
      mostrarNotif(`⚠️ Ya existe una persona con el documento ${persona.documento}`, 'error');
      return;
    }

    personas.push(persona);
    localStorage.setItem(LS_KEY, JSON.stringify(personas)); // ← LOCALSTORAGE

    mostrarNotif(`✅ ${persona.nombre} ${persona.apellido} guardado correctamente en LocalStorage`, 'success');
    limpiarFormulario();
    renderizarPersonas();
    actualizarStats();

  } catch (err) {
    mostrarNotif(`❌ Error de conexión: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '💾 Guardar en LocalStorage';
  }
}

// ============================================================
// LOCALSTORAGE — CRUD
// ============================================================
function obtenerPersonas() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch { return []; }
}

function eliminarPersona(id) {
  if (!confirm('¿Eliminar esta persona del almacén?')) return;
  const personas = obtenerPersonas().filter(p => p.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(personas));
  mostrarNotif('🗑️ Persona eliminada', 'info');
  renderizarPersonas();
  actualizarStats();
}

function limpiarTodo() {
  if (!confirm('¿Eliminar TODOS los datos del LocalStorage?')) return;
  localStorage.removeItem(LS_KEY);
  mostrarNotif('🗑️ LocalStorage limpiado', 'info');
  renderizarPersonas();
  actualizarStats();
}

// ============================================================
// RENDERIZAR LISTA
// ============================================================
function renderizarPersonas(lista = null) {
  const personas = lista || obtenerPersonas();
  const contenedor = document.getElementById('lista-personas');

  document.getElementById('nav-total').textContent = `${obtenerPersonas().length} personas`;

  if (personas.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <div>👥</div>
        <p>No hay personas registradas aún.</p>
      </div>`;
    return;
  }

  contenedor.innerHTML = personas.map(p => `
    <div class="persona-card" id="pc-${p.id}">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <span class="pnombre">${p.nombre} ${p.apellido}</span>
          <span class="pbadge ${p.sexo === 'Masculino' ? 'masc' : 'fem'}">${p.sexo}</span>
          <div class="pdet">📋 DNI: ${p.documento} · 🎂 ${p.edad} años · 💍 ${p.estadoCivil}</div>
          <div class="pdet">📧 ${p.email} · 📞 ${p.telefono}</div>
          <div class="pdet">🌍 ${p.nacionalidad} · 👶 Hijos: ${p.tieneHijos === 'si' ? p.cantidadHijos : 'No'}</div>
          <div class="pdet" style="color:#9ca3af;font-size:0.72rem">Registrado: ${p.fechaRegistro}</div>
        </div>
        <div class="d-flex flex-column gap-1 ms-2">
          <button class="btn-ver" onclick="verDetalle(${p.id})">👁 Ver</button>
          <button class="btn-del-p" onclick="eliminarPersona(${p.id})">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================================
// BÚSQUEDA EN TIEMPO REAL
// ============================================================
function buscarPersonas() {
  const q = document.getElementById('buscador').value.toLowerCase();
  const todas = obtenerPersonas();
  const filtradas = q
    ? todas.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.apellido.toLowerCase().includes(q) ||
        p.documento.includes(q) ||
        p.email.toLowerCase().includes(q))
    : todas;
  renderizarPersonas(filtradas);
}

// ============================================================
// MODAL DETALLE
// ============================================================
function verDetalle(id) {
  const personas = obtenerPersonas();
  const p = personas.find(x => x.id === id);
  if (!p) return;

  document.getElementById('modal-nombre').textContent = `${p.nombre} ${p.apellido}`;
  document.getElementById('modal-body').innerHTML = `
    <div class="detalle-grid">
      ${campo('👤 Nombre completo', `${p.nombre} ${p.apellido}`)}
      ${campo('🎂 Edad', `${p.edad} años`)}
      ${campo('📅 Fecha de nacimiento', p.fechaNacimiento)}
      ${campo('⚥ Sexo', p.sexo)}
      ${campo('📋 Documento', p.documento)}
      ${campo('💍 Estado civil', p.estadoCivil)}
      ${campo('🌍 Nacionalidad', p.nacionalidad)}
      ${campo('📞 Teléfono', p.telefono)}
      ${campo('📧 Email', p.email)}
      ${campo('👶 Hijos', p.tieneHijos === 'si' ? `Sí (${p.cantidadHijos})` : 'No')}
      ${campo('🕐 Registrado', p.fechaRegistro)}
    </div>
  `;

  new bootstrap.Modal(document.getElementById('modalDetalle')).show();
}

function campo(label, value) {
  return `
    <div class="detalle-item">
      <div class="d-label">${label}</div>
      <div class="d-value">${value || '—'}</div>
    </div>`;
}

// ============================================================
// ESTADÍSTICAS
// ============================================================
function actualizarStats() {
  const personas = obtenerPersonas();
  const masc  = personas.filter(p => p.sexo === 'Masculino').length;
  const fem   = personas.filter(p => p.sexo === 'Femenino').length;
  const edadProm = personas.length
    ? Math.round(personas.reduce((a, p) => a + p.edad, 0) / personas.length)
    : '-';

  document.getElementById('st-total').textContent  = personas.length;
  document.getElementById('st-masc').textContent   = masc;
  document.getElementById('st-fem').textContent    = fem;
  document.getElementById('st-edad').textContent   = edadProm;
  document.getElementById('nav-total').textContent = `${personas.length} personas`;
}

// ============================================================
// UTILS
// ============================================================
function limpiarFormulario() {
  const form = document.getElementById('form-persona');
  form.reset();
  document.getElementById('campo-cantidad-hijos').style.display = 'none';
  // Limpiar clases de validación
  form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
    el.classList.remove('is-invalid', 'is-valid');
  });
  form.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
}

let notifTimer;
function mostrarNotif(mensaje, tipo) {
  const el = document.getElementById('notificacion');
  el.innerHTML = mensaje.replace(/\n/g, '<br>');
  el.className = `notif ${tipo}`;
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => { el.className = 'notif d-none'; }, 5000);
}