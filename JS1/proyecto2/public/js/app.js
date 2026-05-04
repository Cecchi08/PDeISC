// ============================================================
// PROYECTO 2 — CATÁLOGO DINÁMICO + MÉTODOS DE ALMACENAJE
// ============================================================

let todosLosProductos = []; // Cache local para filtrado

document.addEventListener('DOMContentLoaded', cargarProductos);

// ============================================================
// GUARDAR PRODUCTO
// ============================================================
async function guardarProducto(event) {
  event.preventDefault();

  const form = document.getElementById('form-producto');
  const formData = new FormData(form);
  const datos = Object.fromEntries(formData.entries()); // Objeto desde FormData

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = '⏳ Guardando...';

  try {
    const res = await fetch('/api/producto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    const data = await res.json();

    if (data.success) {
      mostrarNotif(`✅ "${data.producto.nombre}" guardado correctamente`, 'success');
      actualizarStats(data.stats);
      form.reset();
      cargarProductos();
    } else {
      mostrarNotif(`❌ ${data.error}`, 'error');
    }
  } catch (err) {
    mostrarNotif(`❌ Error de conexión: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '💾 Guardar Producto';
  }
}

// ============================================================
// CARGAR Y MOSTRAR PRODUCTOS
// ============================================================
async function cargarProductos() {
  try {
    const res = await fetch('/api/productos');
    const data = await res.json();
    todosLosProductos = data.arraySimple;
    renderizarProductos(todosLosProductos);

    // Actualizar contador nav
    document.getElementById('nav-count').textContent = `${todosLosProductos.length} productos`;

    // Stats desde datos del objeto
    const obj = data.catalogoObjeto;
    const mapa = Object.keys(data.mapaProductos).length;
    const stack = data.stack[0]?.nombre || '-';

    actualizarStats({
      arraySimple: data.arraySimple.length,
      catalogoItems: obj.items.length,
      totalPrecio: obj.totalPrecio?.toFixed(2) || '0.00',
      mapaSize: mapa,
      stackTop: stack,
    });
  } catch (err) {
    console.error('Error cargando productos:', err);
  }
}

// ============================================================
// RENDERIZAR CARDS
// ============================================================
function renderizarProductos(lista) {
  const contenedor = document.getElementById('lista-productos');

  if (!lista || lista.length === 0) {
    contenedor.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No hay productos aún.<br>¡Agrega el primero!</p>
      </div>`;
    return;
  }

  contenedor.innerHTML = lista.map(p => `
    <div class="producto-card" id="prod-${p.id}">
      <div class="d-flex justify-content-between align-items-start">
        <div class="flex-grow-1">
          <span class="cat-badge">${p.categoria}</span>
          <div class="prod-nombre">${p.nombre}</div>
          <div class="d-flex gap-3 flex-wrap mt-1">
            <span class="prod-precio">$${parseFloat(p.precio).toLocaleString('es-AR', {minimumFractionDigits:2})}</span>
            <span class="prod-det">📦 Stock: ${p.stock}</span>
            <span class="prod-det">🏷️ ${p.marca}</span>
          </div>
          <div class="d-flex gap-3 flex-wrap mt-1">
            ${p.color !== 'N/A' ? `<span class="prod-det">🎨 ${p.color}</span>` : ''}
            ${p.peso !== 'N/A' ? `<span class="prod-det">⚖️ ${p.peso}</span>` : ''}
            ${p.origen !== 'N/A' ? `<span class="prod-det">🌍 ${p.origen}</span>` : ''}
          </div>
          ${p.descripcion ? `<div class="prod-det mt-1">📝 ${p.descripcion}</div>` : ''}
          <div class="prod-det mt-1">🕐 ${p.fechaAgregado}</div>
        </div>
        <button class="btn-del ms-3 mt-1" onclick="eliminarProducto(${p.id})">🗑️ Eliminar</button>
      </div>
    </div>
  `).join('');
}

// ============================================================
// FILTRAR POR CATEGORÍA (sin ir al servidor)
// ============================================================
function filtrarPorCategoria() {
  const filtro = document.getElementById('filtro-categoria').value;
  if (!filtro) {
    renderizarProductos(todosLosProductos);
  } else {
    const filtrados = todosLosProductos.filter(p => p.categoria === filtro);
    renderizarProductos(filtrados);
  }
}

// ============================================================
// ELIMINAR
// ============================================================
async function eliminarProducto(id) {
  if (!confirm('¿Eliminar este producto?')) return;

  try {
    const res = await fetch(`/api/producto/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      mostrarNotif(`🗑️ "${data.eliminado.nombre}" eliminado`, 'success');
      cargarProductos();
    }
  } catch (err) {
    mostrarNotif('❌ Error al eliminar', 'error');
  }
}

// ============================================================
// UTILIDADES
// ============================================================
function actualizarStats(stats) {
  if (stats.arraySimple !== undefined) document.getElementById('stat-array').textContent = stats.arraySimple;
  if (stats.catalogoItems !== undefined) document.getElementById('stat-obj').textContent = stats.catalogoItems;
  if (stats.mapaSize !== undefined) document.getElementById('stat-map').textContent = stats.mapaSize;
  if (stats.stackTop !== undefined) document.getElementById('stat-stack').textContent = stats.stackTop;
  if (stats.totalPrecio !== undefined) document.getElementById('stat-precio').textContent = `$${parseFloat(stats.totalPrecio).toLocaleString('es-AR', {minimumFractionDigits:2})}`;
  document.getElementById('nav-count').textContent = `${stats.arraySimple || 0} productos`;
}

let notifTimer;
function mostrarNotif(mensaje, tipo) {
  const el = document.getElementById('notificacion');
  el.textContent = mensaje;
  el.className = `notif ${tipo}`;
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => { el.className = 'notif d-none'; }, 4000);
}
