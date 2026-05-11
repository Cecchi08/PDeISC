import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Configuración Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `subida_${Date.now()}.txt`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/plain' || file.originalname.endsWith('.txt')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos .txt'), false);
        }
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST /api/subir - Sube archivo, filtra y devuelve resultados 
app.post('/api/subir', upload.single('archivo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se recibió ningún archivo.' });
        }

        const contenido = fs.readFileSync(req.file.path, 'utf-8');
        const lineas = contenido.split('\n').map(l => l.trim()).filter(l => l !== '');
        const numeros = lineas.map(Number).filter(n => !isNaN(n));

        if (numeros.length === 0) {
            return res.status(400).json({ error: 'El archivo no contiene números válidos.' });
        }

        // Filtrar números que empiezan y terminan con el mismo dígito
        const utiles = numeros.filter(n => {
            const str = Math.abs(n).toString();
            return str[0] === str[str.length - 1];
        }).sort((a, b) => a - b);

        const noUtiles = numeros.filter(n => {
            const str = Math.abs(n).toString();
            return str[0] !== str[str.length - 1];
        });

        const porcentaje = ((utiles.length / numeros.length) * 100).toFixed(2);

        // Guardar resultados
        const resultDir = path.join(__dirname, 'resultados');
        if (!fs.existsSync(resultDir)) fs.mkdirSync(resultDir, { recursive: true });

        const resultContent = [
            '=== RESULTADO DEL FILTRADO ===', '',
            'Números útiles (ordenados ascendente):',
            utiles.join('\n'), '',
            `Total analizados: ${numeros.length}`,
            `Útiles: ${utiles.length}`,
            `No útiles: ${noUtiles.length}`,
            `Porcentaje útiles: ${porcentaje}%`
        ].join('\n');

        fs.writeFileSync(path.join(resultDir, 'resultado_filtrado.txt'), resultContent, 'utf-8');

        res.json({
            numeros_totales: numeros.length,
            utiles, no_utiles: noUtiles,
            cantidad_utiles: utiles.length,
            cantidad_no_utiles: noUtiles.length,
            porcentaje: parseFloat(porcentaje),
            archivo_guardado: 'resultado_filtrado.txt'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// GET /api/descargar-resultado - Descarga el archivo filtrado 
app.get('/api/descargar-resultado', (req, res) => {
    const filePath = path.join(__dirname, 'resultados', 'resultado_filtrado.txt');
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'No hay resultado disponible.' });
    }
    res.download(filePath, 'resultado_filtrado.txt');
});

app.listen(PORT, () => {
    console.log(`✅ Servidor Proyecto 2 corriendo en http://localhost:${PORT}`);
});
