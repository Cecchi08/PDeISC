// ─────────────────────────────────────────────
// PROYECTO 5 — Inserción con innerHTML
// ─────────────────────────────────────────────

const zona      = document.getElementById('zona-insercion');
const contEl    = document.getElementById('contador');
const ultimoTipo = document.getElementById('ultimo-tipo');
let total = 0;

// Colores y nombres para variar cada inserción
const coloresCard    = ['primary', 'success', 'danger', 'warning', 'info', 'dark'];
const coloresAlerta  = ['alert-primary', 'alert-success', 'alert-warning', 'alert-danger', 'alert-info'];
const frases = [
  'El código limpio habla por sí mismo.',
  'Primero hacelo funcionar, luego optimizalo.',
  'Un buen nombre vale más que un comentario.',
  'El mejor bug es el que nunca se escribe.',
  'Debuggear es el doble de difícil que programar.',
];

function quitarPlaceholder() {
  const ph = document.getElementById('placeholder');
  if (ph) ph.remove();
}

function registrar(tipo) {
  total++;
  contEl.textContent = total;
  ultimoTipo.textContent = tipo;
  ultimoTipo.className = 'badge bg-primary';
}

function wrapNuevo(html) {
  return `<div class="elemento-nuevo">${html}</div>`;
}

// ── 1. Tarjeta ───────────────────────────────
function agregarTarjeta() {
  quitarPlaceholder();
  const color = coloresCard[total % coloresCard.length];
  const num   = total + 1;
  zona.innerHTML += wrapNuevo(`
    <div class="card border-${color}">
      <div class="card-header bg-${color} text-white fw-semibold">
        Tarjeta #${num} — insertada con innerHTML
      </div>
      <div class="card-body">
        <p class="mb-1">Este elemento fue creado y agregado al DOM mediante:</p>
        <code>zona.innerHTML += '&lt;div class="card"&gt;...&lt;/div&gt;'</code>
      </div>
    </div>
  `);
  registrar('Tarjeta');
}

// ── 2. Alerta ────────────────────────────────
function agregarAlerta() {
  quitarPlaceholder();
  const clase = coloresAlerta[total % coloresAlerta.length];
  const iconos = { 'alert-primary': 'ℹ️', 'alert-success': '✅', 'alert-warning': '⚠️', 'alert-danger': '❌', 'alert-info': '💡' };
  const icono = iconos[clase] || '🔔';
  zona.innerHTML += wrapNuevo(`
    <div class="alert ${clase} d-flex align-items-center gap-2" role="alert">
      <span>${icono}</span>
      <span>Alerta #${total + 1}: elemento agregado dinámicamente con <strong>innerHTML</strong>.</span>
    </div>
  `);
  registrar('Alerta');
}

// ── 3. Tabla ─────────────────────────────────
function agregarTabla() {
  quitarPlaceholder();
  const filas = [
    ['innerHTML', 'Reemplaza/agrega HTML como string', 'Rápido, sencillo'],
    ['createElement', 'Crea nodos individualmente', 'Más control'],
    ['insertAdjacentHTML', 'Inserta en posición exacta', 'Flexible'],
  ];
  const filasHTML = filas.map(f =>
    `<tr><td>${f[0]}</td><td>${f[1]}</td><td><span class="badge bg-success">${f[2]}</span></td></tr>`
  ).join('');

  zona.innerHTML += wrapNuevo(`
    <div class="table-responsive">
      <table class="table table-bordered table-hover mb-0">
        <thead class="table-dark">
          <tr><th>Método</th><th>Descripción</th><th>Ventaja</th></tr>
        </thead>
        <tbody>${filasHTML}</tbody>
      </table>
    </div>
  `);
  registrar('Tabla');
}

// ── 4. Badges ────────────────────────────────
function agregarBadges() {
  quitarPlaceholder();
  const tecnologias = ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Node.js', 'Express', 'DOM', 'DHTML'];
  const colores = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'primary'];
  const badgesHTML = tecnologias.map((t, i) =>
    `<span class="badge bg-${colores[i]} fs-6">${t}</span>`
  ).join(' ');

  zona.innerHTML += wrapNuevo(`
    <div class="card">
      <div class="card-body">
        <p class="small text-muted mb-2">Badges insertados con innerHTML:</p>
        <div class="d-flex flex-wrap gap-2">${badgesHTML}</div>
      </div>
    </div>
  `);
  registrar('Badges');
}

// ── 5. Barras de progreso ────────────────────
function agregarProgress() {
  quitarPlaceholder();
  const habilidades = [
    { nombre: 'HTML/CSS',    pct: 90, color: 'success' },
    { nombre: 'JavaScript',  pct: 75, color: 'primary' },
    { nombre: 'Node.js',     pct: 60, color: 'info'    },
    { nombre: 'Bootstrap',   pct: 85, color: 'warning' },
  ];
  const barrasHTML = habilidades.map(h => `
    <div class="mb-2">
      <div class="d-flex justify-content-between small mb-1">
        <span>${h.nombre}</span><span>${h.pct}%</span>
      </div>
      <div class="progress" style="height:10px">
        <div class="progress-bar bg-${h.color}" style="width:${h.pct}%"></div>
      </div>
    </div>
  `).join('');

  zona.innerHTML += wrapNuevo(`
    <div class="card">
      <div class="card-header fw-semibold">📊 Barras de progreso</div>
      <div class="card-body">${barrasHTML}</div>
    </div>
  `);
  registrar('Barras');
}

// ── 6. Cita ──────────────────────────────────
function agregarCita() {
  quitarPlaceholder();
  const frase = frases[total % frases.length];
  zona.innerHTML += wrapNuevo(`
    <div class="cita-bloque">
      <p class="mb-1 fs-5">"${frase}"</p>
      <small class="text-muted">— Insertado con innerHTML · elemento #${total + 1}</small>
    </div>
  `);
  registrar('Cita');
}

// ── 7. Lista ordenada ────────────────────────
function agregarListaOrdenada() {
  quitarPlaceholder();
  const pasos = [
    'Seleccionar el contenedor destino con <code>getElementById</code>',
    'Definir el HTML como string con template literals',
    'Asignarlo con <code>contenedor.innerHTML += htmlString</code>',
    'El navegador parsea el string y actualiza el DOM',
    'El nuevo elemento queda disponible para futuras manipulaciones',
  ];
  const itemsHTML = pasos.map(p => `<li class="list-group-item">${p}</li>`).join('');

  zona.innerHTML += wrapNuevo(`
    <div class="card">
      <div class="card-header fw-semibold">📝 Cómo funciona innerHTML</div>
      <ol class="list-group list-group-numbered list-group-flush">${itemsHTML}</ol>
    </div>
  `);
  registrar('Lista');
}

// ── Limpiar todo ─────────────────────────────
function limpiarTodo() {
  zona.innerHTML = `
    <div id="placeholder" class="placeholder-zona text-center py-5 text-muted border rounded">
      <div class="fs-1 mb-2">📥</div>
      <p class="mb-0">Hacé click en un botón para agregar elementos aquí.</p>
    </div>`;
  total = 0;
  contEl.textContent = '0';
  ultimoTipo.textContent = '—';
  ultimoTipo.className = 'badge bg-secondary';
}