import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// FIX __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generarArchivoHTML() {
  const filePath = path.join(__dirname, '../views/filesystem.html');
  const fecha = new Date().toLocaleString();

  const contenido = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>FileSystem Demo</title>
  <link rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="bg-light p-5">
  <div class="container">
    <div class="alert alert-success">
      <h4>✅ Archivo generado por<strong>js</strong></h4>
      <p>Este archivo HTML fue creado automáticamente por Node.js</p>
      <p><strong>Fecha de generación:</strong> ${fecha}</p>
    </div>
    <p class="text-muted">Ruta del archivo: <code>${filePath}</code></p>
  </div>
</body>
</html>`;

  fs.writeFileSync(filePath, contenido, 'utf8');
  console.log(`[FS] Archivo generado en: ${filePath}`);
}

export function iniciarServidorHTTP() {
  const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, '../views/filesystem.html');

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Archivo no encontrado');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
  });

  server.listen(3001, () => {
    console.log('[HTTP] Servidor HTTP nativo corriendo en http://localhost:3001');
  });
}
