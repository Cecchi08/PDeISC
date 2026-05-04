import express from 'express'
import path from 'path'
const app = express();
const PORT = 3002;
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// ALMACENAMIENTO EN SERVIDOR — Diferentes métodos/estructuras
// ============================================================

// Método 1: Array simple (push)
let arraySimple = [];

// Método 2: Objeto con push y propiedades extra
let catalogoObjeto = { items: [], totalPrecio: 0, creado: new Date().toISOString() };

// Método 3: Map (clave → valor, busca duplicados por nombre)
let mapaProductos = new Map();

// Método 4: Stack (LIFO - último en entrar, primero en salir)
let stackProductos = [];

// ============================================================
// RUTAS
// ============================================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

// Guardar producto con todos los métodos
app.post('/api/producto', (req, res) => {
  const { nombre, categoria, marca, precio, stock, descripcion, color, peso, origen } = req.body;

  if (!nombre || !categoria || !precio) {
    return res.status(400).json({ success: false, error: 'Nombre, categoría y precio son requeridos' });
  }

  const producto = {
    id: Date.now(),
    nombre,
    categoria,
    marca: marca || 'Sin marca',
    precio: parseFloat(precio),
    stock: parseInt(stock) || 0,
    descripcion: descripcion || '',
    color: color || 'N/A',
    peso: peso || 'N/A',
    origen: origen || 'N/A',
    fechaAgregado: new Date().toLocaleString('es-AR'),
  };

  // MÉTODO 1: Array.push()
  arraySimple.push(producto);

  // MÉTODO 2: Objeto con metadatos
  catalogoObjeto.items.push(producto);
  catalogoObjeto.totalPrecio += producto.precio;
  catalogoObjeto.ultimaActualizacion = new Date().toISOString();

  // MÉTODO 3: Map — clave única por nombre
  mapaProductos.set(producto.nombre.toLowerCase(), producto);

  // MÉTODO 4: Stack (unshift agrega al inicio = LIFO)
  stackProductos.unshift(producto);

  res.json({
    success: true,
    producto,
    stats: {
      arraySimple: arraySimple.length,
      catalogoItems: catalogoObjeto.items.length,
      totalPrecio: catalogoObjeto.totalPrecio.toFixed(2),
      mapaSize: mapaProductos.size,
      stackTop: stackProductos[0]?.nombre || 'vacío',
    },
  });
});

// GET todos los productos
app.get('/api/productos', (req, res) => {
  res.json({
    success: true,
    arraySimple,
    catalogoObjeto,
    mapaProductos: Object.fromEntries(mapaProductos),
    stack: stackProductos,
  });
});

// DELETE un producto
app.delete('/api/producto/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = arraySimple.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ success: false, error: 'No encontrado' });

  const eliminado = arraySimple[index];

  // Eliminar de todas las estructuras
  arraySimple.splice(index, 1);
  catalogoObjeto.items = catalogoObjeto.items.filter(p => p.id !== id);
  catalogoObjeto.totalPrecio -= eliminado.precio;
  mapaProductos.delete(eliminado.nombre.toLowerCase());
  stackProductos = stackProductos.filter(p => p.id !== id);

  res.json({ success: true, eliminado });
});

app.listen(PORT, () => console.log(`Proyecto 2 corriendo en http://localhost:${PORT}`));
