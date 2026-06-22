
const historial = [];

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  ThemeContext.init();
  ThemeContext.initMobileMenu();
  document.getElementById("theme-toggle").addEventListener("click", ThemeContext.toggle);
  document.getElementById("user-form").addEventListener("submit", manejarEnvio);
});

// VALIDACIÓN
// Valida los campos del formulario. Muestra mensajes de error inline si hay problemas.
 
function validarFormulario() {
  const nombre = document.getElementById("inp-nombre").value.trim();
  const email  = document.getElementById("inp-email").value.trim();
  let valido = true;

  // Nombre: entre 2 y 30 caracteres, solo letras mayúsculas, minúsculas y espacios
  const nombreRegex = /^[a-zA-Z\s]{2,30}$/;
  if (!nombreRegex.test(nombre)) {
    _setError("err-nombre", "inp-nombre", "El nombre debe tener entre 2 y 30 caracteres y solo contener letras.");
    valido = false;
  } else {
    _clearError("err-nombre", "inp-nombre");
  }

  // Email: debe terminar en @uni.edu
  if (!email.endsWith("@uni.edu") || email.length < 9) {
    _setError("err-email", "inp-email", "Ingresá un correo válido terminado en @uni.edu.");
    valido = false;
  } else {
    _clearError("err-email", "inp-email");
  }

  return valido;
}

// ENVÍO DEL FORMULARIO
// Manejador del submit. Valida, envía al servidor y procesa la respuesta.

async function manejarEnvio(e) {
  e.preventDefault();
  if (!validarFormulario()) return;

  const nombre = document.getElementById("inp-nombre").value.trim();
  const email  = document.getElementById("inp-email").value.trim();
  const metodo = document.querySelector('input[name="method"]:checked').value;

  _setBtnLoading(true);

  try {
    // Enviar al servidor Express. El servidor decide si usa axios o fetch.
    const res = await fetch("/api/usuarios", {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Method": metodo,           // header personalizado para el servidor
      },
      body: JSON.stringify({ nombre, email }),
    });

    const json = await res.json();
    if (!json.ok) throw new Error(json.message);

    _renderizarRespuesta(json, nombre, email);
    _agregarHistorial(nombre, email, json.id, metodo);

  } catch (err) {
    _renderizarError(err.message);
    console.error("[EJ2] Error:", err);
  } finally {
    _setBtnLoading(false);
  }
}

// RENDERIZADO DE RESPUESTA
// Muestra la tarjeta de éxito con el ID recibido.

function _renderizarRespuesta(json, nombre, email) {
  document.getElementById("response-area").innerHTML = `
    <div class="slide-up" style="display:flex;flex-direction:column;gap:10px">
      <div class="alert alert-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        ¡Usuario enviado correctamente!
      </div>

      <div style="background:var(--bg-card-alt);border:1px solid var(--border);
                  border-radius:var(--radius-sm);padding:1.25rem">
        <div class="d-flex align-center" style="justify-content:space-between;margin-bottom:.6rem">
          <span style="font-size:.74rem;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px">
            ID asignado por la API
          </span>
          <span class="chip">${json.metodo} · ${json.tiempoMs}ms</span>
        </div>
        <div style="font-size:3rem;font-weight:800;color:var(--accent);line-height:1">#${json.id}</div>
        <div style="margin-top:.5rem;font-size:.85rem;color:var(--text-muted)">
          <strong style="color:var(--text)">${nombre}</strong> — ${email}
        </div>
      </div>

      <div class="alert alert-info" style="font-size:.8rem">
        💡 JSONPlaceholder simula la persistencia. El ID ${json.id} siempre es el mismo en demo.
      </div>
    </div>`;
}

/** Muestra error en el área de respuesta */
function _renderizarError(msg) {
  document.getElementById("response-area").innerHTML =
    `<div class="alert alert-danger">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      ${msg}
    </div>`;
}

// HISTORIAL
// Agrega una entrada al historial y actualiza la tabla.

function _agregarHistorial(nombre, email, id, metodo) {
  const hora = new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  historial.unshift({ nombre, email, id, metodo, hora });

  const chip = document.getElementById("hist-chip");
  chip.textContent = historial.length;
  chip.style.display = "inline-flex";

  const rows = historial.map(h => `
    <tr>
      <td><strong>${h.nombre}</strong></td>
      <td class="text-muted text-small">${h.email}</td>
      <td><span class="chip"># ${h.id}</span></td>
      <td><span class="chip">${h.metodo}</span></td>
      <td class="text-muted text-small">${h.hora}</td>
    </tr>`).join("");

  document.getElementById("historial").innerHTML = `
    <div class="table-wrap">
      <table>
        <thead><tr>
          <th>Nombre</th><th>Email</th><th>ID</th><th>Método</th><th>Hora</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// RESET & UTILIDADES
// Resetea el formulario al estado inicial 

function resetForm() {
  document.getElementById("user-form").reset();
  _clearError("err-nombre", "inp-nombre");
  _clearError("err-email", "inp-email");
  document.getElementById("form-msg").innerHTML = "";
  document.getElementById("response-area").innerHTML = `
    <div class="empty-state" style="padding:2.5rem 1rem">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      <p>Sin respuesta aún</p>
      <small>Completá el formulario y envialo</small>
    </div>`;
}

// Muestra error en un campo
function _setError(errId, inputId, msg) {
  const err   = document.getElementById(errId);
  const input = document.getElementById(inputId);
  err.textContent = msg; err.classList.add("visible");
  input.classList.add("error");
}

/** Limpia error de un campo */
function _clearError(errId, inputId) {
  const err   = document.getElementById(errId);
  const input = document.getElementById(inputId);
  err.classList.remove("visible"); input.classList.remove("error");
}

/** Activa / desactiva el estado de carga del botón Enviar */
function _setBtnLoading(loading) {
  const btn = document.getElementById("btn-enviar");
  btn.disabled = loading;
  btn.innerHTML = loading
    ? `<div class="spinner" style="width:14px;height:14px;border-width:2px"></div> Enviando…`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
       </svg> Enviar`;
}
