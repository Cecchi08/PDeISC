// Referencias al DOM
const uploadZone = document.getElementById('uploadZone');
const inputArchivo = document.getElementById('inputArchivo');
const archivoInfo = document.getElementById('archivoInfo');
const archivoNombre = document.getElementById('archivoNombre');
const btnProcesar = document.getElementById('btnProcesar');
const seccionResultados = document.getElementById('seccionResultados');

// Stats
const statTotal = document.getElementById('statTotal');
const statUtiles = document.getElementById('statUtiles');
const statNoUtiles = document.getElementById('statNoUtiles');
const statPorcentaje = document.getElementById('statPorcentaje');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const numerosUtiles = document.getElementById('numerosUtiles');
const numerosNoUtiles = document.getElementById('numerosNoUtiles');

// Archivo seleccionado
let archivoSeleccionado = null;

//Validación del campo de carga de archivos
function manejarArchivo(file) {
    if (!file) return;

    // Validar extensión .txt
    if (!file.name.endsWith('.txt')) {
        mostrarError('Solo se permiten archivos .txt');
        return;
    }

    archivoSeleccionado = file;
    archivoNombre.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    archivoInfo.style.display = 'flex';
    archivoInfo.style.cssText = 'display: flex !important;';
    btnProcesar.disabled = false;

    // Ocultar resultados anteriores
    seccionResultados.style.display = 'none';
}

//Muestra un mensaje de error temporal
function mostrarError(mensaje) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
    alertDiv.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    uploadZone.parentNode.insertBefore(alertDiv, btnProcesar);
    setTimeout(() => alertDiv.remove(), 4000);
}

//Envía el archivo al servidor y muestra resultados 
async function procesarArchivo() {
    if (!archivoSeleccionado) return;

    try {
        btnProcesar.disabled = true;
        btnProcesar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';

        const formData = new FormData();
        formData.append('archivo', archivoSeleccionado);

        const response = await fetch('/api/subir', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            mostrarResultados(data);
        } else {
            mostrarError(data.error || 'Error al procesar el archivo.');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error de conexión con el servidor.');
    } finally {
        btnProcesar.disabled = false;
        btnProcesar.innerHTML = '<i class="bi bi-gear me-2"></i>Procesar Archivo';
    }
}

//Muestra los resultados del filtrado con animaciones
function mostrarResultados(data) {
    seccionResultados.style.display = 'block';

    // Scroll suave hacia resultados
    setTimeout(() => {
        seccionResultados.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Animar stats con conteo
    animarNumero(statTotal, data.numeros_totales);
    animarNumero(statUtiles, data.cantidad_utiles);
    animarNumero(statNoUtiles, data.cantidad_no_utiles);

    // Porcentaje
    statPorcentaje.textContent = `${data.porcentaje}%`;
    progressBar.style.width = `${data.porcentaje}%`;
    progressLabel.textContent = `${data.porcentaje}% útiles`;

    // Renderizar números útiles (ordenados ascendente)
    numerosUtiles.innerHTML = data.utiles.length > 0
        ? data.utiles.map(n => `<span class="badge-numero">${n}</span>`).join('')
        : '<p class="text-body-secondary text-center w-100 py-3 mb-0"><i class="bi bi-emoji-frown me-2"></i>No se encontraron números útiles</p>';

    // Renderizar números no útiles
    numerosNoUtiles.innerHTML = data.no_utiles.length > 0
        ? data.no_utiles.map(n => `<span class="badge bg-secondary bg-opacity-75 rounded-pill px-3 py-2 m-1">${n}</span>`).join('')
        : '<p class="text-body-secondary text-center w-100 py-3 mb-0">Todos los números son útiles</p>';
}

//Animación de números
function animarNumero(elemento, valorFinal) {
    let actual = 0;
    const incremento = Math.max(1, Math.ceil(valorFinal / 30));
    const intervalo = setInterval(() => {
        actual += incremento;
        if (actual >= valorFinal) {
            actual = valorFinal;
            clearInterval(intervalo);
        }
        elemento.textContent = actual;
    }, 30);
}

// Click en zona de subida abre selector de archivo
uploadZone.addEventListener('click', () => inputArchivo.click());

// Cambio en input de archivo
inputArchivo.addEventListener('change', (e) => {
    if (e.target.files.length > 0) manejarArchivo(e.target.files[0]);
});

// Drag & Drop
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) manejarArchivo(e.dataTransfer.files[0]);
});

// Botón procesar
btnProcesar.addEventListener('click', procesarArchivo);

// Inicializar tema desde contexto
window.ThemeContext.initTheme();
