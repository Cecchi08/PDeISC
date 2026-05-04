# 🎓 Examen Fullstack — 3 Proyectos Node.js + Express + Bootstrap

## Estructura del proyecto

```
proyectos/
├── index.js              ← Inicia los 3 servidores
├── package.json
├── proyecto1/            ← Puerto 3001
│   ├── server.js
│   ├── views/index.html
│   └── public/
│       ├── css/styles.css
│       └── js/app.js
├── proyecto2/            ← Puerto 3002
│   ├── server.js
│   ├── views/index.html
│   └── public/...
└── proyecto3/            ← Puerto 3003
    ├── server.js
    ├── views/index.html
    └── public/...
```

## ▶️ Instalación y ejecución

```bash
npm install
node index.js
```

- Proyecto 1 → http://localhost:3001
- Proyecto 2 → http://localhost:3002
- Proyecto 3 → http://localhost:3003

---

## Proyecto 1 — Lectura dinámica + 3 métodos de formularios

**Objetivo:** Cargar usuarios sin recargar la página. Demostrar los 3 métodos de lectura.

| Método | Cómo se envía | Cómo se lee en backend |
|--------|--------------|------------------------|
| 1 | `JSON.stringify()` en fetch POST | `req.body` (express.json) |
| 2 | `new FormData()` → URLSearchParams | `req.body` (express.urlencoded) |
| 3 | `new URLSearchParams()` en GET | `req.query` |

---

## Proyecto 2 — Catálogo dinámico con 8+ campos

**Campos:** nombre, categoría, marca, precio, stock, color, peso, origen, descripción

**Métodos de almacenaje demostrados:**
- `Array.push()` — Array simple
- Objeto con metadatos + push (total precio, timestamps)
- `Map()` — Clave única por nombre
- Stack con `unshift()` — LIFO

---

## Proyecto 3 — Almacén de personas con LocalStorage

**Campos:** nombre, apellido, edad, fechaNacimiento, sexo, documento, estadoCivil, nacionalidad, teléfono, email, hijos/cantidad

**Funcionalidades:**
- Validación dinámica campo por campo (en tiempo real)
- Validación doble: frontend JS + backend Express
- Almacenamiento en `localStorage`
- Búsqueda en tiempo real
- Estadísticas dinámicas
- Modal de detalle
- Eliminación individual y masiva
- Prevención de duplicados por DNI
