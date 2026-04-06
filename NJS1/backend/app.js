import { createServer } from 'node:http';
import { ejercicio1 } from './ejercicio1.js';
import { ejercicio2 } from './ejercicio2.js';
import { ejercicio3 } from './ejercicio3.js';
import { ejercicio4 } from './ejercicio4.js';

const server = createServer((req, res) => {

  const r1 = ejercicio1();
  const r2 = ejercicio2();
  const r3 = ejercicio3();
  const r4 = ejercicio4();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados Backend</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
</head>
<body class="d-flex justify-content-center align-items-center vh-100">

    <div class="container">
        <div class="table-responsive">

            <table class="table table-dark table-striped text-center">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ejercicio</th>
                        <th>Resultado</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th>1</th>
                        <td>Ejercicio 1</td>
                        <td>${r1}</td>
                    </tr>
                    <tr>
                        <th>2</th>
                        <td>Ejercicio 2</td>
                        <td>${r2}</td>
                    </tr>
                    <tr>
                        <th>3</th>
                        <td>Ejercicio 3</td>
                        <td>${r3}</td>
                    </tr>
                    <tr>
                        <th>4</th>
                        <td>Ejercicio 4</td>
                        <td>${r4}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script> 
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Servidor en http://127.0.0.1:3000');
});