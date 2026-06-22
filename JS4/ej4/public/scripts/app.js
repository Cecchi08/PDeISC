
// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", async () => {
  ThemeContext.init();
  ThemeContext.initMobileMenu();
  document.getElementById("theme-toggle").addEventListener("click", ThemeContext.toggle);
  document.getElementById("form-alumno").addEventListener("submit", manejarAgregar);

  await _verificarServidor();
  await Promise.all([cargarAlumnos(), _cargarStats()]);
});

// ESTADO DEL SERVIDOR
// Verifica si la API responde y actualiza el indicador visual.

async function _verificarServidor() {
  const el  = document.getElementById("stat-server");
  const box = document.getElementById("stat-server-box");
  try {
    const res = await fetch("/api/alumnos/list", { method: "POST", signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      el.textContent = "🟢 En línea";
      box.style.borderColor = "var(--success)";
    } else throw new Error();
  } catch {
    el.textContent = "🔴 Offline";
    box.style.borderColor = "var(--danger)";
  }
}

// LEER — POST /api/alumnos/list
// Carga la lista completa de alumnos y la renderiza en la tabla.

async function cargarAlumnos() {
  document.getElementById("tabla-area").innerHTML =
    '<div class="loader"><div class="spinner"></div>Cargando…</div>';
  try {
    const res  = await fetch("/api/alumnos/list", { method: "POST" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    _renderizarTabla(json.data);
  } catch (err) {
    document.getElementById("tabla-area").innerHTML =
      `<div class="alert alert-danger">
        Error al conectar con la API: <strong>${err.message}</strong>
       </div>`;
    console.error("[EJ4] Error cargando alumnos:", err);
  }
}

// CREAR — POST /api/alumnos/create
// Maneja el submit del formulario de alta.
// Envía los datos al servidor y recarga la lista si tuvo éxito.

async function manejarAgregar(e) {
  e.preventDefault();

  const campos = {
    nombre:   document.getElementById("inp-nombre").value.trim(),
    email:    document.getElementById("inp-email").value.trim(),
    carrera:  document.getElementById("inp-carrera").value.trim(),
    anio:     Number(document.getElementById("inp-anio").value)     || 1,
    promedio: Number(document.getElementById("inp-promedio").value) || 0,
  };

  // Validación del lado del cliente
  const nombreRegex = /^[a-zA-Z\s]{2,30}$/;
  if (!nombreRegex.test(campos.nombre)) {
    _mostrarMsgForm("El nombre debe tener entre 2 y 30 caracteres (solo letras).", "danger");
    return;
  }
  
  if (!campos.email.endsWith("@uni.edu") || campos.email.length < 9) {
    _mostrarMsgForm("El email debe terminar en @uni.edu.", "danger");
    return;
  }
  
  const carreraRegex = /^[a-zA-Z\s]+$/;
  if (!campos.carrera || !carreraRegex.test(campos.carrera)) {
    _mostrarMsgForm("La carrera debe contener solo letras.", "danger");
    return;
  }

  _setBtnLoading(true);

  try {
    const res  = await fetch("/api/alumnos/create", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(campos),
    });
    const json = await res.json();

    if (!json.ok) {
      // Mostrar errores de validación del servidor
      _mostrarMsgForm((json.errores || ["Error desconocido"]).join(", "), "danger");
      return;
    }

    _mostrarMsgForm(`✅ "${json.data.nombre}" agregado con ID #${json.data.id}`, "success");
    document.getElementById("form-alumno").reset();
    await Promise.all([cargarAlumnos(), _cargarStats()]);

  } catch (err) {
    _mostrarMsgForm(`Error de conexión: ${err.message}`, "danger");
    console.error("[EJ4] Error al agregar:", err);
  } finally {
    _setBtnLoading(false);
  }
}

// ELIMINAR — POST /api/alumnos/delete
// Elimina un alumno por ID usando el modal personalizado.

function eliminarAlumno(id, nombre) {
  _mostrarModalPersonalizado(`¿Confirmás eliminar a "${nombre}" (ID #${id})?`, async () => {
    try {
      const res  = await fetch(`/api/alumnos/delete`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.message);
      await Promise.all([cargarAlumnos(), _cargarStats()]);
    } catch (err) {
      _mostrarAlertPersonalizado(`Error al eliminar: ${err.message}`);
    }
  });
}

// ESTADÍSTICAS — POST /api/stats

async function _cargarStats() {
  try {
    const res  = await fetch("/api/stats", { method: "POST" });
    const json = await res.json();
    document.getElementById("stat-total").textContent    = json.data.total;
    document.getElementById("stat-promedio").textContent = json.data.promedioGeneral;
    document.getElementById("stat-carreras").textContent = json.data.carreras;
  } catch { /* silencioso */ }
}

// RENDERIZADO

// Renderiza la tabla de alumnos en el DOM.
function _renderizarTabla(alumnos) {
  const chip = document.getElementById("count-chip");
  chip.textContent = alumnos.length;
  chip.style.display = "inline-flex";

  if (!alumnos.length) {
    document.getElementById("tabla-area").innerHTML =
      '<div class="alert alert-info">No hay alumnos registrados. ¡Agregá el primero!</div>';
    return;
  }

  const rows = alumnos.map((a, i) => {
    const color = a.promedio >= 8 ? "var(--success)" : a.promedio >= 6 ? "var(--accent)" : "var(--danger)";
    return `
      <tr class="slide-up" style="animation-delay:${i * 30}ms">
        <td data-label="ID"><span class="chip">#${a.id}</span></td>
        <td data-label="Nombre"><strong>${a.nombre}</strong></td>
        <td data-label="Email" class="text-muted text-small">${a.email}</td>
        <td data-label="Carrera">${a.carrera}</td>
        <td data-label="Año" style="text-align:center">${a.anio}°</td>
        <td data-label="Promedio" style="text-align:center;font-weight:700;color:${color}">${a.promedio}</td>
        <td data-label="Acción" style="text-align:center">
          <button class="btn btn-sm btn-danger"
            onclick="eliminarAlumno(${a.id}, '${a.nombre.replace(/'/g, "\\'")}')"
            title="Eliminar">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
          </button>
        </td>
      </tr>`;
  }).join("");

  document.getElementById("tabla-area").innerHTML = `
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>ID</th><th>Nombre</th><th>Email</th>
          <th>Carrera</th><th>Año</th><th>Prom.</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// UTILIDADES

// Crea un modal de confirmación
function _mostrarModalPersonalizado(mensaje, onConfirm) {
  const modalHTML = `
    <div id="custom-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);">
      <div style="background:var(--bg-card);padding:2rem;border-radius:12px;border:1px solid var(--border);max-width:400px;width:90%;box-shadow:var(--shadow);text-align:center;animation:slideDown 0.3s ease;">
        <h3 style="margin-top:0;margin-bottom:1rem;color:var(--text)">Atención</h3>
        <p style="color:var(--text-muted);margin-bottom:1.5rem;font-size:0.95rem">${mensaje}</p>
        <div style="display:flex;gap:10px;justify-content:center">
          <button id="modal-btn-cancel" class="btn btn-secondary">Cancelar</button>
          <button id="modal-btn-confirm" class="btn btn-danger">Confirmar</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modal = document.getElementById("custom-modal");
  
  document.getElementById("modal-btn-cancel").addEventListener("click", () => modal.remove());
  
  document.getElementById("modal-btn-confirm").addEventListener("click", () => {
    modal.remove();
    if (onConfirm) onConfirm();
  });
}

// Crea un alert personalizado
function _mostrarAlertPersonalizado(mensaje) {
  const modalHTML = `
    <div id="custom-alert" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);">
      <div style="background:var(--bg-card);padding:2rem;border-radius:12px;border:1px solid var(--border);max-width:400px;width:90%;box-shadow:var(--shadow);text-align:center;animation:slideDown 0.3s ease;">
        <h3 style="margin-top:0;margin-bottom:1rem;color:var(--text)">Aviso</h3>
        <p style="color:var(--text-muted);margin-bottom:1.5rem;font-size:0.95rem">${mensaje}</p>
        <button id="alert-btn-ok" class="btn btn-primary">Entendido</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  document.getElementById("alert-btn-ok").addEventListener("click", () => {
    document.getElementById("custom-alert").remove();
  });
}

// Muestra un mensaje de feedback en el formulario que se auto-oculta.
function _mostrarMsgForm(msg, tipo) {
  const el = document.getElementById("form-msg");
  el.innerHTML = `<div class="alert alert-${tipo}" style="font-size:.82rem;padding:10px 14px;margin-bottom:.75rem">${msg}</div>`;
  setTimeout(() => { el.innerHTML = ""; }, 5000);
}

// Activa / desactiva el estado de carga del botón Agregar
function _setBtnLoading(loading) {
  const btn = document.getElementById("btn-agregar");
  btn.disabled = loading;
  btn.innerHTML = loading
    ? `<div class="spinner" style="width:14px;height:14px;border-width:2px"></div> Guardando…`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
       </svg> Agregar alumno`;
}
