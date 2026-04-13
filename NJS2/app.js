import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { upperCase } from 'upper-case';
import fs from 'fs';

// __dirname fix (OBLIGATORIO en ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Módulos propios
import { getFecha, getHora, getDiaSemana } from './modules/tiempo.js';
import * as calculo from './modules/calculo.js';

// Componentes
import { getMenu } from './components/menu.js';
import { generarArchivoHTML, iniciarServidorHTTP } from './components/httpFileSystem.js';
import { analizarURL } from './components/urlDemo.js';

const app  = express();
const PORT = 3000;
// ── Middlewares ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

generarArchivoHTML();                  
iniciarServidorHTTP();               
analizarURL('https://miapp.com:8080/productos/lista?categoria=ropa&orden=asc#resultados');

function layout(titulo, contenido, paginaActiva = '') {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo} | NodeApp</title>
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<body class="bg-light">
  ${getMenu(paginaActiva)}
  <div class="container my-5">
    <h2 class="mb-4 fw-bold text-dark">
      <i class="bi bi-chevron-right text-primary me-2"></i>${titulo}
    </h2>
    ${contenido}
  </div>
  <footer class="bg-dark text-white text-center py-3 mt-5">
    <small>NodeApp &copy; ${new Date().getFullYear()} — Proyecto Examen Node.js</small>
  </footer>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}

app.get('/', (req, res) => {
  const contenido = `
    <div class="row g-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h5 class="card-title">Mi proyecto</h5>
            <p class="card-text text-muted">
              Proyecto que integra módulos propios, módulos nativos de Node.js y paquetes NPM.
              Navegá por el menú para explorar cada sección.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center p-4">
            <i class="bi bi-clock-fill fs-1 text-primary"></i>
            <h6 class="mt-2">Módulo Tiempo</h6>
            <p class="text-muted small">Fecha, hora y día de la semana</p>
            <a href="/tiempo" class="btn btn-primary btn-sm">Ver</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center p-4">
            <i class="bi bi-calculator-fill fs-1 text-success"></i>
            <h6 class="mt-2">Módulo Cálculo</h6>
            <p class="text-muted small">Operaciones matemáticas</p>
            <a href="/calculo" class="btn btn-success btn-sm">Ver</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center p-4">
            <i class="bi bi-folder-fill fs-1 text-warning"></i>
            <h6 class="mt-2">FileSystem</h6>
            <p class="text-muted small">Módulos HTTP + FS nativos</p>
            <a href="/filesystem" class="btn btn-warning btn-sm">Ver</a>
          </div>
        </div>
      </div>
    </div>`;
  res.send(layout('Inicio', contenido, '/'));
});

// TIEMPO
app.get('/tiempo', (req, res) => {
  const fecha = getFecha();
  const hora = getHora();
  const diaSem = getDiaSemana();

  const contenido = `
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm text-center p-4">
          <i class="bi bi-calendar3 fs-1 text-primary mb-2"></i>
          <h6 class="text-muted">Fecha actual</h6>
          <h3 class="fw-bold">${fecha}</h3>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm text-center p-4">
          <i class="bi bi-clock fs-1 text-success mb-2"></i>
          <h6 class="text-muted">Hora actual</h6>
          <h3 class="fw-bold">${hora}</h3>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm text-center p-4">
          <i class="bi bi-calendar-week fs-1 text-warning mb-2"></i>
          <h6 class="text-muted">Día de la semana</h6>
          <h3 class="fw-bold">${diaSem}</h3>
        </div>
      </div>
    </div>`;
  res.send(layout('Módulo Tiempo', contenido, '/tiempo'));
});

// CÁLCULO
app.get('/calculo', (req, res) => {
  const a = 12, b = 4;
  const resultados = [
    { op: 'Suma',         icono: 'plus-lg',       color: 'primary',  res: calculo.sumar(a, b),       expr: `${a} + ${b}` },
    { op: 'Resta',        icono: 'dash-lg',        color: 'danger',   res: calculo.restar(a, b),      expr: `${a} - ${b}` },
    { op: 'Multiplicación', icono: 'x-lg',         color: 'success',  res: calculo.multiplicar(a, b), expr: `${a} × ${b}` },
    { op: 'División',     icono: 'slash-lg',       color: 'warning',  res: calculo.dividir(a, b),     expr: `${a} ÷ ${b}` },
    { op: 'Potencia',     icono: 'lightning-fill', color: 'info',     res: calculo.potencia(a, b),    expr: `${a} ^ ${b}` },
  ];

  const cards = resultados.map(r => `
    <div class="col-md-4 col-sm-6">
      <div class="card border-0 shadow-sm text-center p-3">
        <i class="bi bi-${r.icono} fs-2 text-${r.color} mb-2"></i>
        <h6 class="text-muted">${r.op}</h6>
        <p class="text-muted small mb-1"><code>${r.expr}</code></p>
        <h4 class="fw-bold text-${r.color}">${r.res}</h4>
      </div>
    </div>`).join('');

  const contenido = `
    <div class="row g-4">
      ${cards}
    </div>`;
  res.send(layout('Módulo Cálculo', contenido, '/calculo'));
});

// FILESYSTEM
app.get('/filesystem', (req, res) => {
  generarArchivoHTML(); // Regenera el archivo en cada visita

  const filePath = path.join(__dirname, 'views/filesystem.html');
  const htmlGenerado = fs.readFileSync(filePath, 'utf8');

  const contenido = `
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-dark text-white">
            <i class="bi bi-file-code me-2"></i>Contenido generado por <code>js</code>
          </div>
          <div class="card-body p-0">
            <iframe srcdoc="${htmlGenerado.replace(/"/g, '&quot;')}"
              style="width:100%; height:220px; border:none;"></iframe>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-secondary text-white">
            <i class="bi bi-server me-2"></i>Servidor HTTP nativo (puerto 3001)
          </div>
          <div class="card-body">
            <p>Se levantó un servidor HTTP puro con el módulo <code>http</code> de Node.js</p>
            <a href="http://localhost:3001" target="_blank" class="btn btn-outline-secondary">
              <i class="bi bi-box-arrow-up-right me-1"></i>Abrir en localhost:3001
            </a>
          </div>
        </div>
      </div>
    </div>`;
  res.send(layout('FileSystem + HTTP', contenido, '/filesystem'));
});

// URL DEMO
app.get('/url-demo', (req, res) => {
  const urlEjemplo = 'https://miapp.com:8080/productos/lista?categoria=ropa&orden=asc#resultados';
  const datos = analizarURL(urlEjemplo);

  const filas = Object.entries({
    'URL completa':  datos.urlCompleta,
    'Protocolo':     datos.protocolo,
    'Host':          datos.host,
    'Hostname':      datos.hostname,
    'Puerto':        datos.puerto,
    'Pathname':      datos.pathname,
    'Search':        datos.busqueda,
    'Hash':          datos.hash,
    'Params (JSON)': JSON.stringify(datos.params),
  }).map(([k, v]) => `
    <tr>
      <td class="fw-semibold text-muted">${k}</td>
      <td><code>${v}</code></td>
    </tr>`).join('');

  const contenido = `
    <div class="row g-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-dark text-white">
            <i class="bi bi-table me-2"></i>Resultado del módulo <code>URL</code>
          </div>
          <div class="card-body p-0">
            <table class="table table-striped mb-0">
              <thead class="table-dark">
                <tr><th>Propiedad</th><th>Valor</th></tr>
              </thead>
              <tbody>${filas}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
  res.send(layout('Módulo URL', contenido, '/url-demo'));
});

// NPM DEMO (upper-case)
app.get('/npm-demo', (req, res) => {
  const textos = [
    'hola mundo desde node.js',
    'módulos npm son muy útiles',
    'express + bootstrap = sitio completo',
    'amo Node JS',
  ];

  const filas = textos.map(t => `
    <tr>
      <td>${t}</td>
      <td class="text-success fw-bold">${upperCase(t)}</td>
    </tr>`).join('');

  const contenido = `
    <div class="row g-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-dark text-white">
            <i class="bi bi-arrow-up-square me-2"></i>Textos transformados con <code>upperCase()</code>
          </div>
          <div class="card-body p-0">
            <table class="table table-hover mb-0">
              <thead class="table-dark">
                <tr><th>Texto original</th><th>Resultado upper-case</th></tr>
              </thead>
              <tbody>${filas}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;
  res.send(layout('NPM — upper-case', contenido, '/npm-demo'));
});

// 404
app.use((req, res) => {
  const contenido = `
    <div class="text-center py-5">
      <i class="bi bi-exclamation-triangle-fill fs-1 text-danger"></i>
      <h3 class="mt-3">Página no encontrada</h3>
      <p class="text-muted">La ruta <code>${req.url}</code> no existe.</p>
      <a href="/" class="btn btn-primary">Volver al inicio</a>
    </div>`;
  res.status(404).send(layout('404 - No encontrado', contenido));
});

// ── Iniciar servidor ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor Express corriendo en http://localhost:${PORT}`);
  console.log(`📁 Servidor HTTP nativo en     http://localhost:3001\n`);
});