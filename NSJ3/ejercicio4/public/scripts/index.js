// ─────────────────────────────────────────────
// PROYECTO 4 — Nodos <a> y atributos
// ─────────────────────────────────────────────

const contenedor    = document.getElementById('contenedor-nodos');
const logLista      = document.getElementById('log-cambios');
const logVacio      = document.getElementById('log-vacio');
const contadorNodos = document.getElementById('contador-nodos');

// Registro interno: id → elemento <a>
const nodos = {};
let contadorLog = 0;

// ── Crear nodo ──────────────────────────────
function crearNodo(id, texto, href, emoji) {
  // Si ya existe, solo loguear
  if (nodos[id]) {
    agregarLog('info', `<strong>${texto}</strong> ya existe`, null, null, '⚠');
    return;
  }

  // Crear <a> con createElement
  const a = document.createElement('a');
  a.id        = 'nodo-' + id;
  a.href      = href;
  a.target    = '_blank';
  a.rel       = 'noopener noreferrer';
  a.className = 'nodo-link';

  a.innerHTML =
    `<span class="fs-5">${emoji}</span>` +
    `<span class="flex-grow-1">` +
      `<span class="fw-semibold">${texto}</span><br>` +
      `<span class="nodo-url">${href}</span>` +
    `</span>` +
    `<span class="badge bg-secondary nodo-target" title="atributo target">_blank</span>`;

  // Quitar placeholder si es el primero
  const placeholder = contenedor.querySelector('p');
  if (placeholder) placeholder.remove();

  contenedor.appendChild(a);
  nodos[id] = a;

  actualizarContador();
  agregarLog('create', `Nodo <strong>${texto}</strong> creado`, null, href, '✚');
}

// ── Modificar href ───────────────────────────
function modificarAtributo(id, atributo, nuevoValor, nuevoTexto) {
  const a = nodos[id];
  if (!a) {
    agregarLog('warn', `Nodo <strong>${id}</strong> no existe aún`, null, null, '⚠');
    return;
  }

  const valorAnterior = a.getAttribute(atributo);

  // Aplicar el cambio
  a.setAttribute(atributo, nuevoValor);

  // Actualizar la URL visible dentro del nodo
  const urlSpan = a.querySelector('.nodo-url');
  if (urlSpan) urlSpan.textContent = nuevoValor;

  // Actualizar el texto visible si el href cambió
  const textoSpan = a.querySelector('.fw-semibold');
  if (textoSpan && nuevoTexto) textoSpan.textContent = nuevoTexto;

  // Animación de modificado
  a.classList.add('modificado');
  setTimeout(() => a.classList.remove('modificado'), 700);

  agregarLog('modify',
    `<strong>${atributo}</strong> en <em>#${id}</em>`,
    valorAnterior,
    nuevoValor,
    '✎'
  );
}

// ── Cambiar target en todos ──────────────────
function cambiarTarget(nuevoTarget) {
  const ids = Object.keys(nodos);
  if (ids.length === 0) {
    agregarLog('warn', 'No hay nodos creados todavía', null, null, '⚠');
    return;
  }

  ids.forEach(function (id) {
    const a = nodos[id];
    const anterior = a.getAttribute('target');
    a.setAttribute('target', nuevoTarget);

    // Actualizar badge visible
    const badge = a.querySelector('.nodo-target');
    if (badge) badge.textContent = nuevoTarget;

    agregarLog('modify',
      `<strong>target</strong> en <em>#${id}</em>`,
      anterior,
      nuevoTarget,
      '🎯'
    );
  });
}

// ── Limpiar nodos ────────────────────────────
function limpiarNodos() {
  contenedor.innerHTML = '<p class="text-muted small text-center mt-3">Todavía no creaste ningún nodo.<br>Usá los botones de la izquierda.</p>';
  Object.keys(nodos).forEach(k => delete nodos[k]);
  actualizarContador();
  agregarLog('warn', 'Todos los nodos fueron eliminados', null, null, '🗑');
}

// ── Limpiar log ──────────────────────────────
function limpiarLog() {
  logLista.innerHTML = '';
  logVacio.style.display = '';
  contadorLog = 0;
}

// ── Actualizar contador de nodos ─────────────
function actualizarContador() {
  const cant = Object.keys(nodos).length;
  contadorNodos.textContent = cant;
  contadorNodos.className = cant > 0 ? 'badge bg-primary' : 'badge bg-secondary';
}

// ── Agregar entrada al log ───────────────────
function agregarLog(tipo, descripcion, antes, despues, icono) {
  logVacio.style.display = 'none';
  contadorLog++;

  const li = document.createElement('li');
  li.className = 'log-item list-group-item';

  let contenidoCambio = '';
  if (antes !== null && despues !== null) {
    contenidoCambio =
      `<div class="mt-1">` +
        `<span class="log-antes">${antes}</span>` +
        ` → ` +
        `<span class="log-despues">${despues}</span>` +
      `</div>`;
  }

  li.innerHTML =
    `<div class="d-flex justify-content-between">` +
      `<span>${icono} ${descripcion}</span>` +
      `<span class="text-muted">#${contadorLog}</span>` +
    `</div>` +
    contenidoCambio;

  // Insertar al principio
  logLista.insertBefore(li, logLista.firstChild);
}