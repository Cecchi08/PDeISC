

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", async () => {
  ThemeContext.init();
  ThemeContext.initMobileMenu();
  document.getElementById("theme-toggle").addEventListener("click", ThemeContext.toggle);

  // Bind del input con debounce para no filtrar en cada keystroke
  document.getElementById("search-input")
    .addEventListener("input", _debounce(_manejarBusqueda, 200));

  await _cargarUsuarios();
});

// CARGA INICIAL DEL SERVIDOR

// Solicita al servidor Express la lista completa de usuarios.
// El servidor la obtiene de JSONPlaceholder y la cachea.

async function _cargarUsuarios() {
  try {
    const res  = await fetch("/api/usuarios", { method: "POST" });
    if (!res.ok) throw new Error(`Servidor HTTP ${res.status}`);
    const json = await res.json();

    todosLosUsuarios = json.data;
    document.getElementById("stat-total").textContent = json.total;

    // Mostrar si vino de caché o de la API externa
    const cacheEl = document.getElementById("stat-cache");
    if (json.fromCache) {
      cacheEl.textContent = "💾 Caché";
      cacheEl.style.color = "var(--warning)";
    } else {
      cacheEl.textContent = "🌐 API externa";
      cacheEl.style.color = "var(--success)";
    }

    _renderizarUsuarios(todosLosUsuarios, "");
  } catch (err) {
    document.getElementById("resultado").innerHTML =
      `<div class="alert alert-danger">
        No se pudo conectar al servidor: <strong>${err.message}</strong>
      </div>`;
    console.error("[EJ3] Error cargando usuarios:", err);
  }
}

// BÚSQUEDA Y FILTRADO (100% local)

// Manejador del evento input. Filtra el array local y re-renderiza.
function _manejarBusqueda(e) {
  const query    = e.target.value.trim();
  const filtrado = _filtrarPorNombre(todosLosUsuarios, query);
  _renderizarUsuarios(filtrado, query);
}
// Filtra un array de usuarios por nombre (case-insensitive, parcial).
function _filtrarPorNombre(usuarios, query) {
  if (!query) return usuarios;
  const q = query.toLowerCase();
  return usuarios.filter(u => u.name.toLowerCase().includes(q));
}

// Limpia el campo de búsqueda y vuelve a mostrar todos los usuarios.
function limpiarBusqueda() {
  const input = document.getElementById("search-input");
  input.value = "";
  input.dispatchEvent(new Event("input"));
  input.focus();
}


// RENDERIZADO

// Renderiza el grid de tarjetas, resaltando las coincidencias del query.
function _renderizarUsuarios(usuarios, query) {
  const contenedor = document.getElementById("resultado");
  const titulo     = document.getElementById("results-title");

  document.getElementById("stat-visible").textContent = usuarios.length;

  titulo.textContent = query
    ? `${usuarios.length} resultado${usuarios.length !== 1 ? "s" : ""} para "${query}"`
    : `Todos los usuarios (${usuarios.length})`;

  if (!usuarios.length) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>Sin resultados</p>
        <small>No hay usuarios que coincidan con "<em>${query}</em>"</small>
      </div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.className = "user-grid";

  usuarios.forEach((u, i) => {
    const nombreHTML = query ? _resaltar(u.name, query) : u.name;
    const card = document.createElement("div");
    card.className = "user-card slide-up";
    card.style.animationDelay = `${i * 35}ms`;
    card.innerHTML = `
      <div class="d-flex align-center gap-1">
        <div class="user-avatar">${u.name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="user-name">${nombreHTML}</div>
          <div class="user-email">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            ${u.email}
          </div>
        </div>
      </div>
      <div class="user-meta">
        <span class="chip"># ${u.id}</span>
        <span class="chip">📍 ${u.address?.city || "—"}</span>
        <span class="chip">🏢 ${u.company?.name?.split(" ")[0] || "—"}</span>
      </div>`;
    grid.appendChild(card);
  });

  contenedor.innerHTML = "";
  contenedor.appendChild(grid);
}

// UTILIDADES

// Resalta las coincidencias del query dentro de un texto.

function _resaltar(texto, query) {
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return texto.replace(regex,
    `<mark style="background:rgba(99,102,241,0.22);color:var(--accent);border-radius:3px;padding:0 2px">$1</mark>`);
}

// Debounce: evita que la función se ejecute en cada keystroke.
function _debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}
