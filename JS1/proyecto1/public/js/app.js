document.addEventListener('DOMContentLoaded', () => {
  cargarTodos();
});

// ============================================================
// HELPERS SEGUROS
// ============================================================
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ============================================================
// MÉTODO 1 — JSON
// ============================================================
async function enviarJSON() {
  const datos = {
    nombre: getValue('j-nombre'),
    apellido: getValue('j-apellido'),
    edad: getValue('j-edad'),
    email: getValue('j-email'),
    legajo: getValue('j-legajo'),
    carrera: getValue('j-carrera'),
    universidad: getValue('j-universidad'),
    anio: getValue('j-anio'),
  };

  mostrarResultado('res-json', null, null);

  try {
    const res = await fetch('/api/usuario/json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    const data = await res.json();

    if (data.success) {
      mostrarResultado('res-json', `✅ Usuario agregado!\n👤 ${data.usuario.nombre}`, 'success');
      limpiarCampos(['j-nombre','j-apellido','j-edad','j-email','j-legajo','j-carrera','j-universidad','j-anio']);
      cargarTodos();
    } else {
      mostrarResultado('res-json', formatearErrores(data.errores), 'error');
    }
  } catch (err) {
    mostrarResultado('res-json', `❌ Error: ${err.message}`, 'error');
  }
}

// ============================================================
// MÉTODO 2 — FormData
// ============================================================
async function enviarFormData(event) {
  event.preventDefault();

  const form = document.getElementById('form-formdata');
  const formData = new FormData(form);

  mostrarResultado('res-form', null, null);

  try {
    const res = await fetch('/api/usuario/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData),
    });

    const data = await res.json();

    if (data.success) {
      mostrarResultado('res-form', `✅ Usuario agregado!\n👤 ${data.usuario.nombre}`, 'success');
      form.reset();
      cargarTodos();
    } else {
      mostrarResultado('res-form', formatearErrores(data.errores), 'error');
    }
  } catch (err) {
    mostrarResultado('res-form', `❌ Error: ${err.message}`, 'error');
  }
}

// ============================================================
// MÉTODO 3 — QUERY
// ============================================================
async function enviarQuery() {
  const datos = {
    nombre: getValue('q-nombre'),
    apellido: getValue('q-apellido'),
    edad: getValue('q-edad'),
    email: getValue('q-email'),
    legajo: getValue('q-legajo'),
    carrera: getValue('q-carrera'),
    universidad: getValue('q-universidad'),
    anio: getValue('q-anio'),
  };

  const params = new URLSearchParams(datos);

  mostrarResultado('res-query', null, null);

  try {
    const res = await fetch(`/api/usuario/query?${params}`);
    const data = await res.json();

    if (data.success) {
      mostrarResultado('res-query', `✅ Usuario agregado!\n👤 ${data.usuario.nombre}`, 'success');
      limpiarCampos(['q-nombre','q-apellido','q-edad','q-email','q-legajo','q-carrera','q-universidad','q-anio']);
      cargarTodos();
    } else {
      mostrarResultado('res-query', formatearErrores(data.errores), 'error');
    }
  } catch (err) {
    mostrarResultado('res-query', `❌ Error: ${err.message}`, 'error');
  }
}

// ============================================================
// UTILIDADES
// ============================================================
function formatearErrores(errores) {
  if (!errores) return 'Error desconocido';
  return '❌ ' + errores.map(e => `${e.campo}: ${e.mensaje}`).join('\n');
}

async function cargarTodos() {
  const contenedor = document.getElementById('lista-usuarios');

  try {
    const res = await fetch('/api/usuarios');
    const data = await res.json();

    if (!data.usuarios.length) {
      contenedor.innerHTML = '<p>No hay usuarios</p>';
      return;
    }

    contenedor.innerHTML = data.usuarios.map(u => `
      <div>
        <strong>${u.nombre} ${u.apellido}</strong>
        <div>${u.email}</div>
        <div>${u.carrera} - Año ${u.anio}</div>
      </div>
    `).join('');
  } catch {
    contenedor.innerHTML = 'Error cargando usuarios';
  }
}

function mostrarResultado(id, mensaje, tipo) {
  const el = document.getElementById(id);
  if (!mensaje) {
    el.className = 'd-none';
    return;
  }
  el.textContent = mensaje;
  el.className = tipo;
}

function limpiarCampos(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}