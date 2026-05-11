import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Configuración de __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware para parsear JSON y servir archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST /api/guardar - Recibe un array de números y los guarda en un archivo .txt 
app.post('/api/guardar', (req, res) => {
    try {
        const { numeros } = req.body;

        // Validación: debe ser un array con entre 10 y 20 elementos
        if (!Array.isArray(numeros) || numeros.length < 10 || numeros.length > 20) {
            return res.status(400).json({
                error: 'Debe ingresar entre 10 y 20 números.'
            });
        }

        // Crear directorio si no existe
        const dirPath = path.join(__dirname, 'archivos');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Guardar números en archivo .txt (uno por línea)
        const contenido = numeros.join('\n');
        const filePath = path.join(dirPath, 'numeros.txt');
        fs.writeFileSync(filePath, contenido, 'utf-8');

        res.json({
            mensaje: 'Archivo guardado exitosamente.',
            archivo: 'numeros.txt',
            cantidad: numeros.length
        });
    } catch (error) {
        console.error('Error al guardar:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// GET /api/descargar - Permite descargar el archivo .txt generado 
app.get('/api/descargar', (req, res) => {
    const filePath = path.join(__dirname, 'archivos', 'numeros.txt');

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'No hay archivo disponible para descargar.' });
    }

    res.download(filePath, 'numeros.txt');
});

//DELETE para eliminar el archivo
app.delete('/api/eliminar', (req, res) => {
    const filePath = path.join(__dirname, 'archivos', 'numeros.txt');

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            res.json({ mensaje: 'El archivo anterior fue eliminado. Ahora podés editar los números y guardar uno nuevo.' });
        } catch (error) {
            console.error('Error al eliminar:', error);
            res.status(500).json({ error: 'Error al eliminar el archivo.' });
        }
    } else {
        res.json({ mensaje: 'No hay archivo para eliminar.' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor Proyecto 1 corriendo en http://localhost:${PORT}`);
});
