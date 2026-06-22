/* INICIALIZACIÓN */
document.addEventListener("DOMContentLoaded", () => {
  ThemeContext.init();
  ThemeContext.initMobileMenu();
  document.getElementById("theme-toggle").addEventListener("click", ThemeContext.toggle);
});

// ACCIONES PÚBLICAS (llamadas desde el HTML)

// Obtiene usuarios usando el endpoint /api/usuarios/fetch del servidor. El servidor utiliza fetch nativo de Node.js 18+.

async function cargarConFetch() {
  _setLoading("btn-fetch", true);
  try {
    const json = await _get("/api/usuarios/fetch");
    _mostrarMetodo("fetch", json.tiempoMs);
    _renderizarUsuarios(json.data);
  } catch (e) {
    _mostrarError(e.message);
  } finally {
    _setLoading("btn-fetch", false);
  }
}

// Obtiene usuarios usando el endpoint /api/usuarios/axios del servidor.
// El servidor utiliza la librería axios.

async function cargarConAxios() {
  _setLoading("btn-axios", true);
  try {
    const json = await _get("/api/usuarios/axios");
    _mostrarMetodo("axios", json.tiempoMs);
    _renderizarUsuarios(json.data);
  } catch (e) {
    _mostrarError(e.message);
  } finally {
    _setLoading("btn-axios", false);
  }
}

// Limpia todos los resultados y resetea la UI.

function limpiar() {
  document.getElementById("resultado").innerHTML = `
    <div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <p>No hay usuarios cargados</p>
      <small>Presioná un botón para obtener datos 👆</small>
    </div>`;
  document.getElementById("method-msg").innerHTML  = "";
  document.getElementById("count-chip").style.display = "none";
  document.getElementById("stats-row").style.display  = "none";
}

   // RENDERIZADO

// Renderiza el grid de tarjetas de usuario en el DOM.

function _renderizarUsuarios(usuarios) {
  const contenedor = document.getElementById("resultado");

  if (!usuarios || !usuarios.length) {
    contenedor.innerHTML = '<div class="alert alert-info">La API no devolvió usuarios.</div>';
    return;
  }

  const grid = document.createElement("div");
  grid.className = "user-grid";

  usuarios.forEach((u, i) => {
    const card = document.createElement("div");
    card.className = "user-card slide-up";
    card.style.animationDelay = `${i * 45}ms`;
    card.innerHTML = `
      <div class="d-flex align-center gap-1">
        <div class="user-avatar">${u.name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="user-name">${u.name}</div>
          <div class="user-email">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <a href="mailto:${u.email}" style="color:inherit;text-decoration:none">${u.email}</a>
          </div>
        </div>
      </div>
      <div class="user-meta">
        <span class="chip"># ${u.id}</span>
        <span class="chip">📍 ${u.address?.city || "—"}</span>
      </div>`;
    grid.appendChild(card);
  });

  contenedor.innerHTML = "";
  contenedor.appendChild(grid);

  // Actualizar stats
  document.getElementById("stat-total").textContent = usuarios.length;
  document.getElementById("count-chip").textContent = usuarios.length;
  document.getElementById("count-chip").style.display = "inline-flex";
  document.getElementById("stats-row").style.display  = "flex";
}

// Muestra el banner de método usado y tiempo de respuesta.

function _mostrarMetodo(metodo, ms) {
  document.getElementById("stat-metodo").textContent = metodo;
  document.getElementById("stat-tiempo").textContent = `${ms}ms`;
  document.getElementById("method-msg").innerHTML = `
    <div class="alert alert-success">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      Datos obtenidos con <strong>${metodo}</strong> en el servidor
      · tiempo de API externa: <strong>${ms}ms</strong>
    </div>`;
}

// Muestra error en el área de resultados
function _mostrarError(msg) {
  document.getElementById("resultado").innerHTML =
    `<div class="alert alert-danger">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Error: ${msg}
    </div>`;
}

// UTILIDADES

// POST a un endpoint local y devuelve el JSON.
async function _get(url) {
  const inicio = performance.now();
  document.getElementById("resultado").innerHTML =
    '<div class="loader"><div class="spinner"></div>Obteniendo datos del servidor…</div>';
  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`Servidor respondió HTTP ${res.status}`);
  return res.json();
}

// Activa o desactiva el estado de carga de un botón.
function _setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  if (loading) {
    btn._originalHTML = btn.innerHTML;
    btn.innerHTML = `<div class="spinner" style="width:14px;height:14px;border-width:2px"></div> Cargando…`;
  } else if (btn._originalHTML) {
    btn.innerHTML = btn._originalHTML;
  }
}
