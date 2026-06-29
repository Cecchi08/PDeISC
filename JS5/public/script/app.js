const API_LISTAR    = '/api/alumnos/listar';
const API_AGREGAR   = '/api/alumnos/agregar';
const API_MODIFICAR = '/api/alumnos/modificar';
const NAME_RE = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

let editingId = null;

const form           = document.getElementById('alumno-form');
const submitBtn      = document.getElementById('submit-btn');
const submitBtnText  = document.getElementById('submit-btn-text');
const cancelBtn      = document.getElementById('cancel-btn');
const formTitle      = document.querySelector('#form-section h2');
const tbody          = document.getElementById('alumnos-tbody');
const table          = document.getElementById('alumnos-table');
const emptyState     = document.getElementById('empty-state');
const loadState      = document.getElementById('loading-state');
const refreshBtn     = document.getElementById('refresh-btn');
const elTotal        = document.getElementById('total-alumnos');
const elProm         = document.getElementById('edad-promedio');
const elUlt          = document.getElementById('ultimo-id');
const toastBox       = document.getElementById('toast-container');

// Fetch hacia la api de alumnos (POST únicamente)
async function fetchAlumnos() {
  showLoading(true);
  try {
    const res = await fetch(API_LISTAR, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Error al obtener datos');
    const data = await res.json();
    renderTable(data);
    updateStats(data);
  } catch (e) { showToast(e.message, 'error'); }
  finally { showLoading(false); }
}

// Renderizar tablas
function renderTable(arr) {
  tbody.innerHTML = '';
  if (!arr.length) {
    table.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }
  table.classList.remove('hidden');
  emptyState.classList.add('hidden');
  arr.forEach((a, i) => {
    const tr = document.createElement('tr');
    tr.classList.add('row-enter');
    tr.style.animationDelay = `${i * 60}ms`;
    tr.innerHTML = `
      <td data-label="ID"><span class="id-badge">#${a.id}</span></td>
      <td data-label="Nombre">${esc(a.nombre)}</td>
      <td data-label="Apellido">${esc(a.apellido)}</td>
      <td data-label="Edad"><span class="age-badge">${a.edad}</span></td>
      <td data-label="Modificar">
        <button class="btn-edit" data-id="${a.id}" data-nombre="${esc(a.nombre)}" data-apellido="${esc(a.apellido)}" data-edad="${a.edad}" aria-label="Modificar alumno">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// Estadísticas
function updateStats(arr) {
  elTotal.textContent = arr.length;
  if (arr.length) {
    elProm.textContent = (arr.reduce((s, a) => s + a.edad, 0) / arr.length).toFixed(1);
    elUlt.textContent  = `#${arr[arr.length - 1].id}`;
  } else {
    elProm.textContent = '0';
    elUlt.textContent  = '—';
  }
  document.querySelectorAll('.stat-number').forEach(el => {
    el.classList.remove('stat-pop');
    void el.offsetWidth;
    el.classList.add('stat-pop');
  });
}

//   Validacion de nombre
function validateName(val, label) {
  if (!val) return `${label} es obligatorio.`;
  if (val.length < 2) return `${label} debe tener al menos 2 caracteres.`;
  if (val.length > 30) return `${label} debe tener como máximo 30 caracteres.`;
  if (!NAME_RE.test(val)) return `${label} solo puede contener letras y espacios.`;
  return '';
}

//   Validacion de edad
function validateEdad(val) {
  if (!val) return 'La edad es obligatoria.';
  const n = parseInt(val, 10);
  if (isNaN(n) || n < 1 || n > 120) return 'La edad debe ser entre 1 y 120.';
  return '';
}

// Mostrar campo de error
function showFieldError(id, msg) {
  const el = document.getElementById(`${id}-error`);
  if (el) { el.textContent = msg; el.classList.toggle('visible', !!msg); }
  const inp = document.getElementById(id);
  if (inp) inp.classList.toggle('input-error', !!msg);
}

// Limpiar errores
function clearErrors() {
  ['nombre', 'apellido', 'edad'].forEach(id => showFieldError(id, ''));
}

// Validar en tiempo real
['nombre', 'apellido'].forEach(id => {
  document.getElementById(id).addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val) showFieldError(id, validateName(val, id === 'nombre' ? 'El nombre' : 'El apellido'));
    else showFieldError(id, '');
  });
});
document.getElementById('edad').addEventListener('input', (e) => {
  const val = e.target.value.trim();
  if (val) showFieldError('edad', validateEdad(val));
  else showFieldError('edad', '');
});

// Cambiar a modo edición
function startEdit(id, nombre, apellido, edad) {
  editingId = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('apellido').value = apellido;
  document.getElementById('edad').value = edad;
  clearErrors();

  submitBtnText.textContent = 'Guardar Cambios';
  cancelBtn.classList.remove('hidden');
  
  formTitle.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg> Modificar Alumno #${id}`;

  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

// Cancelar modo edición
function cancelEdit() {
  editingId = null;
  form.reset();
  clearErrors();
  submitBtnText.textContent = 'Agregar Alumno';
  cancelBtn.classList.add('hidden');
  
  formTitle.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <line x1="20" y1="8" x2="20" y2="14"/>
      <line x1="23" y1="11" x2="17" y2="11"/>
    </svg> Registrar Alumno`;
}

// Event delegation para botones de edición en la tabla
tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-edit');
  if (!btn) return;
  const id = btn.getAttribute('data-id');
  const nombre = btn.getAttribute('data-nombre');
  const apellido = btn.getAttribute('data-apellido');
  const edad = btn.getAttribute('data-edad');
  startEdit(id, nombre, apellido, edad);
});

cancelBtn.addEventListener('click', cancelEdit);

// Enviar formulario (Agregar o Modificar por POST)
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const nombre   = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const edadVal  = document.getElementById('edad').value.trim();

  const errN = validateName(nombre, 'El nombre');
  const errA = validateName(apellido, 'El apellido');
  const errE = validateEdad(edadVal);

  showFieldError('nombre', errN);
  showFieldError('apellido', errA);
  showFieldError('edad', errE);

  if (errN || errA || errE) {
    showToast('Corregí los errores antes de enviar.', 'error');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add('btn-loading');

  const isEditing = editingId !== null;
  const targetUrl = isEditing ? API_MODIFICAR : API_AGREGAR;
  const payload   = { nombre, apellido, edad: parseInt(edadVal, 10) };
  if (isEditing) payload.id = parseInt(editingId, 10);

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al procesar solicitud');

    showToast(
      isEditing 
        ? `✓ Alumno #${editingId} modificado con éxito.`
        : `✓ ${nombre} ${apellido} registrado con éxito.`, 
      'success'
    );
    
    cancelEdit();
    await fetchAlumnos();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('btn-loading');
  }
});

// Boton de refrescar la página
refreshBtn.addEventListener('click', () => {
  refreshBtn.classList.add('spin');
  fetchAlumnos().finally(() => setTimeout(() => refreshBtn.classList.remove('spin'), 600));
});

// Mostrar loading
function showLoading(on) {
  loadState.classList.toggle('hidden', !on);
  if (on) { table.classList.add('hidden'); emptyState.classList.add('hidden'); }
}

// Escape de HTML
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function showToast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.textContent = msg;
  toastBox.appendChild(el);
  requestAnimationFrame(() => el.classList.add('toast--visible'));
  setTimeout(() => {
    el.classList.remove('toast--visible');
    el.addEventListener('transitionend', () => el.remove());
  }, 3500);
}

// Al cargar la página, obtener los alumnos
document.addEventListener('DOMContentLoaded', fetchAlumnos);
