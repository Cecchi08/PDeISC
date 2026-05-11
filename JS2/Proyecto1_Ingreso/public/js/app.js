// Estado de la aplicación
const numeros = [];
const MIN_NUMEROS = 10;
const MAX_NUMEROS = 20;

// Referencias al DOM
const formNumero = document.getElementById('formNumero');
const inputNumero = document.getElementById('inputNumero');
const btnAgregar = document.getElementById('btnAgregar');
const btnGuardar = document.getElementById('btnGuardar');
const btnDescargar = document.getElementById('btnDescargar');
const btnModificar = document.getElementById('btnModificar');
const btnLimpiar = document.getElementById('btnLimpiar');
const numerosContainer = document.getElementById('numerosContainer');
const contador = document.getElementById('contador');
const progressBar = document.getElementById('progressBar');
const mensajeExito = document.getElementById('mensajeExito');

// --- VALIDACIONES ---

// Bloquea cualquier tecla que no sea un dígito, signo negativo, Enter, Backspace, etc.
inputNumero.addEventListener('keydown', (e) => {
    const teclasPermitidas = [
        'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight',
        'ArrowUp', 'ArrowDown', 'Home', 'End'
    ];

    // Permitir teclas de control (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
    if (e.ctrlKey || e.metaKey) return;

    // Permitir teclas de navegación y edición
    if (teclasPermitidas.includes(e.key)) return;

    // Permitir el signo negativo solo al principio
    if (e.key === '-' && inputNumero.selectionStart === 0) return;

    // Bloquear todo lo que no sea un dígito (0-9)
    if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
    }
});

// Bloquea pegado de texto no numérico 
inputNumero.addEventListener('paste', (e) => {
    const texto = (e.clipboardData || window.clipboardData).getData('text');
    if (!/^-?\d+$/.test(texto.trim())) {
        e.preventDefault();
    }
});

// Agrega un número al array y actualiza la interfaz 
function agregarNumero(e) {
    if (e) e.preventDefault(); // Prevenir submit del form

    const valor = inputNumero.value.trim();

    // Validación estricta: solo números enteros (con posible signo negativo)
    if (valor === '' || !/^-?\d+$/.test(valor)) {
        inputNumero.classList.add('is-invalid');
        setTimeout(() => inputNumero.classList.remove('is-invalid'), 2000);
        return;
    }

    if (numeros.length >= MAX_NUMEROS) {
        mostrarAlerta('Ya alcanzaste el máximo de 20 números.', 'warning');
        return;
    }

    numeros.push(Number(valor));
    inputNumero.value = '';
    inputNumero.classList.remove('is-invalid');
    inputNumero.focus();
    actualizarUI();
}

// Elimina un número por su índice 
function eliminarNumero(index) {
    numeros.splice(index, 1);
    actualizarUI();
}

// Actualiza toda la interfaz: badges, contador, barra, botones 
function actualizarUI() {
    // Renderizar badges de números
    numerosContainer.innerHTML = numeros.map((num, i) => `
        <span class="badge-numero">
            ${num}
            <button class="btn-remove" onclick="eliminarNumero(${i})" title="Eliminar">
                <i class="bi bi-x"></i>
            </button>
        </span>
    `).join('');

    // Actualizar contador
    contador.textContent = `${numeros.length} / ${MIN_NUMEROS}-${MAX_NUMEROS}`;

    // Actualizar barra de progreso
    const porcentaje = (numeros.length / MAX_NUMEROS) * 100;
    progressBar.style.width = `${porcentaje}%`;

    // Habilitar/deshabilitar botón de guardar
    btnGuardar.disabled = numeros.length < MIN_NUMEROS;

    // Deshabilitar input si se alcanzó el máximo
    inputNumero.disabled = numeros.length >= MAX_NUMEROS;
    btnAgregar.disabled = numeros.length >= MAX_NUMEROS;

    // Ocultar mensaje de éxito y botones extra si se modifica la lista
    mensajeExito.style.display = 'none';
    btnDescargar.style.display = 'none';
    btnModificar.style.display = 'none';
}

// Muestra una alerta temporal 
function mostrarAlerta(mensaje, tipo) {
    mensajeExito.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show alert-success-custom" role="alert">
            <i class="bi bi-info-circle me-2"></i>${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    mensajeExito.style.display = 'block';
}

// Envía los números al servidor para guardarlos en .txt 
async function guardarNumeros() {
    try {
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

        const response = await fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numeros })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarAlerta(
                `${data.mensaje} Se guardaron ${data.cantidad} números.`,
                'success'
            );
            btnDescargar.style.display = 'inline-flex';
            btnModificar.style.display = 'inline-flex';
        } else {
            mostrarAlerta(data.error || 'Error al guardar.', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error de conexión con el servidor.', 'danger');
    } finally {
        btnGuardar.disabled = numeros.length < MIN_NUMEROS;
        btnGuardar.innerHTML = '<i class="bi bi-save me-2"></i>Guardar TXT';
    }
}

// Limpia todos los números y resetea la interfaz 
function limpiarTodo() {
    numeros.length = 0;
    actualizarUI();
    inputNumero.disabled = false;
    btnAgregar.disabled = false;
    inputNumero.focus();
}

// --- EVENT LISTENERS ---

// Submit del formulario (incluye Enter y click en Agregar)
formNumero.addEventListener('submit', agregarNumero);

btnGuardar.addEventListener('click', guardarNumeros);

btnDescargar.addEventListener('click', () => {
    window.location.href = '/api/descargar';
});

btnModificar.addEventListener('click', async () => {
    try {
        btnModificar.disabled = true;
        btnModificar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Modificando...';

        const response = await fetch('/api/eliminar', { method: 'DELETE' });
        const data = await response.json();

        if (response.ok) {
            mostrarAlerta(data.mensaje, 'info');
            btnDescargar.style.display = 'none';
            btnModificar.style.display = 'none';
            // Al limpiar el mensaje y ocultar botones, el usuario vuelve al estado
            // donde puede agregar/quitar y volver a clickear 'Guardar TXT'
            inputNumero.focus();
        } else {
            mostrarAlerta(data.error || 'Error al modificar.', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error de conexión con el servidor.', 'danger');
    } finally {
        btnModificar.disabled = false;
        btnModificar.innerHTML = '<i class="bi bi-pencil me-2"></i>Modificar';
    }
});

btnLimpiar.addEventListener('click', limpiarTodo);

// Inicializar tema desde contexto y UI
window.ThemeContext.initTheme();
actualizarUI();
