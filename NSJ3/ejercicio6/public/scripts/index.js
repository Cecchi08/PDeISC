// scripts/index.js
// ─────────────────────────────────────────────
// PROYECTO 6 — Formulario de registro
// Al enviar muestra los datos dinámicamente
// sin recargar la página
// ─────────────────────────────────────────────

const form = document.getElementById('form-registro');

// ── Funciones de validación ───────────────────

// Validar nombre (solo letras y espacios)
function validarNombre(nombre) {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(nombre) && nombre.trim().length > 0;
}

// Validar email (debe ser @gmail.com)
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
}

// Validar edad (1-120)
function validarEdad(edad) {
    const num = parseInt(edad);
    return !isNaN(num) && num >= 1 && num <= 120;
}

// Validar género
function validarGenero() {
    const radios = document.getElementsByName('genero');
    for (let radio of radios) {
        if (radio.checked) return true;
    }
    return false;
}

// Validar país
function validarPais(pais) {
    return pais !== '';
}

// Obtener intereses seleccionados
function obtenerIntereses() {
    const checkboxes = document.querySelectorAll('#form-registro input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// ── Mostrar resultado ─────────────────────────

function mostrarResultado(datos) {
    // Ocultar placeholder, mostrar card
    document.getElementById('resultado-placeholder').classList.add('d-none');
    const card = document.getElementById('resultado-card');
    card.classList.remove('d-none');

    // Hora del registro
    const ahora = new Date();
    document.getElementById('resultado-hora').textContent =
        ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    // Avatar: inicial del nombre con color dinámico
    const inicial = datos.nombre.charAt(0).toUpperCase();
    const avatarCircle = document.getElementById('avatar-circle');
    avatarCircle.textContent = inicial;
    
    // Colores para el avatar según la inicial
    const colores = ['#0d6efd', '#198754', '#dc3545', '#fd7e14', '#6f42c1', '#20c997', '#0dcaf0'];
    const idx = datos.nombre.charCodeAt(0) % colores.length;
    avatarCircle.style.background = colores[idx];

    // Datos en la card
    document.getElementById('res-nombre-grande').textContent = datos.nombre;
    document.getElementById('res-email-grande').textContent = datos.email;
    document.getElementById('res-nombre').textContent = datos.nombre;
    document.getElementById('res-email').textContent = datos.email;
    document.getElementById('res-edad').textContent = datos.edad + ' años';
    document.getElementById('res-genero').textContent = datos.genero;
    document.getElementById('res-pais').textContent = datos.pais;

    // Intereses como badges
    const interesesContenedor = document.getElementById('res-intereses');
    if (datos.intereses.length === 0) {
        interesesContenedor.innerHTML = '<span class="text-muted small">Ninguno seleccionado</span>';
    } else {
        const coloresBadge = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info', 'bg-dark'];
        interesesContenedor.innerHTML = datos.intereses.map(function (interes, i) {
            return `<span class="badge ${coloresBadge[i % coloresBadge.length]} me-1">${interes}</span>`;
        }).join('');
    }
}

// ── Limpiar formulario ────────────────────────

function limpiarFormulario() {
    form.reset();
    form.classList.remove('was-validated');

    // Limpiar clases de validación
    document.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });

    // Ocultar mensaje de error de género
    document.getElementById('genero-error').classList.add('d-none');

    // Volver a mostrar placeholder
    document.getElementById('resultado-placeholder').classList.remove('d-none');
    document.getElementById('resultado-card').classList.add('d-none');
}

// ── Evento submit del formulario ──────────────

form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Leer valores
    const nombre = document.getElementById('inp-nombre').value;
    const email = document.getElementById('inp-email').value;
    const edad = document.getElementById('inp-edad').value;
    const pais = document.getElementById('inp-pais').value;

    // Radio (género)
    const generoEl = document.querySelector('input[name="genero"]:checked');
    const genero = generoEl ? generoEl.value : '';

    // Checkboxes (intereses)
    const intereses = obtenerIntereses();

    // Validaciones
    let isValid = true;

    // Validar nombre
    const nombreInput = document.getElementById('inp-nombre');
    if (!validarNombre(nombre)) {
        nombreInput.classList.add('is-invalid');
        isValid = false;
    } else {
        nombreInput.classList.remove('is-invalid');
        nombreInput.classList.add('is-valid');
    }

    // Validar email
    const emailInput = document.getElementById('inp-email');
    if (!validarEmail(email)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
    }

    // Validar edad
    const edadInput = document.getElementById('inp-edad');
    if (!validarEdad(edad)) {
        edadInput.classList.add('is-invalid');
        isValid = false;
    } else {
        edadInput.classList.remove('is-invalid');
        edadInput.classList.add('is-valid');
    }

    // Validar género
    const generoError = document.getElementById('genero-error');
    if (!genero) {
        generoError.classList.remove('d-none');
        isValid = false;
    } else {
        generoError.classList.add('d-none');
    }

    // Validar país
    const paisInput = document.getElementById('inp-pais');
    if (!validarPais(pais)) {
        paisInput.classList.add('is-invalid');
        isValid = false;
    } else {
        paisInput.classList.remove('is-invalid');
        paisInput.classList.add('is-valid');
    }

    // Si todo es válido, mostrar resultado
    if (isValid) {
        mostrarResultado({
            nombre: nombre.trim(),
            email: email,
            edad: edad,
            genero: genero,
            pais: pais,
            intereses: intereses
        });
    }
});

// ── Validaciones en tiempo real ───────────────

// Validación de nombre
document.getElementById('inp-nombre').addEventListener('input', function() {
    const valor = this.value;
    if (valor === '') {
        this.classList.remove('is-valid', 'is-invalid');
    } else if (validarNombre(valor)) {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    } else {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    }
});

// Validación de email
document.getElementById('inp-email').addEventListener('input', function() {
    const valor = this.value;
    if (valor === '') {
        this.classList.remove('is-valid', 'is-invalid');
    } else if (validarEmail(valor)) {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    } else {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    }
});

// Validación de edad
document.getElementById('inp-edad').addEventListener('input', function() {
    const valor = this.value;
    if (valor === '') {
        this.classList.remove('is-valid', 'is-invalid');
    } else if (validarEdad(valor)) {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    } else {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    }
});

// Validación de género en tiempo real
document.querySelectorAll('input[name="genero"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const generoError = document.getElementById('genero-error');
        if (validarGenero()) {
            generoError.classList.add('d-none');
        }
    });
});

// Validación de país en tiempo real
document.getElementById('inp-pais').addEventListener('change', function() {
    if (this.value === '') {
        this.classList.add('is-invalid');
        this.classList.remove('is-valid');
    } else {
        this.classList.add('is-valid');
        this.classList.remove('is-invalid');
    }
});