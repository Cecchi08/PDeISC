// ─────────────────────────────────────────────
// COMPONENTE 1 — evento: click
// Contador con botones +, - y reset
// ─────────────────────────────────────────────
(function () {
  let cuenta = 0;

  const display = document.getElementById('contador-display');
  const log     = document.getElementById('contador-log');

  function animarBump() {
    display.classList.add('bump');
    setTimeout(() => display.classList.remove('bump'), 120);
  }

  function actualizarColor() {
    if (cuenta > 0)      display.style.color = '#198754';
    else if (cuenta < 0) display.style.color = '#dc3545';
    else                 display.style.color = '#0d6efd';
  }

  document.getElementById('btn-sumar').addEventListener('click', function () {
    cuenta++;
    display.textContent = cuenta;
    log.textContent = `Sumaste → resultado: ${cuenta}`;
    animarBump();
    actualizarColor();
  });

  document.getElementById('btn-restar').addEventListener('click', function () {
    cuenta--;
    display.textContent = cuenta;
    log.textContent = `Restaste → resultado: ${cuenta}`;
    animarBump();
    actualizarColor();
  });

  document.getElementById('btn-reset').addEventListener('click', function () {
    cuenta = 0;
    display.textContent = cuenta;
    log.textContent = 'Contador reiniciado a 0';
    actualizarColor();
  });
})();


// ─────────────────────────────────────────────
// COMPONENTE 2 — evento: mouseover / mouseout
// Galería de colores con hover
// ─────────────────────────────────────────────
(function () {
  const tarjetas = document.querySelectorAll('.color-card');
  const infoBox  = document.getElementById('color-info');

  tarjetas.forEach(function (tarjeta) {
    // Asignar color de fondo desde el atributo data-color
    tarjeta.style.backgroundColor = tarjeta.dataset.color;

    tarjeta.addEventListener('mouseover', function () {
      const nombre = tarjeta.dataset.name;
      const color  = tarjeta.dataset.color;

      infoBox.style.backgroundColor = color;
      infoBox.style.color = '#fff';
      infoBox.style.textShadow = '0 1px 3px rgba(0,0,0,0.4)';
      infoBox.innerHTML = `<strong>${nombre}</strong> <span class="opacity-75">${color}</span>`;
    });

    tarjeta.addEventListener('mouseout', function () {
      infoBox.style.backgroundColor = '';
      infoBox.style.color = '';
      infoBox.style.textShadow = '';
      infoBox.innerHTML = '<span class="text-muted small">Sin selección</span>';
    });
  });
})();


// ─────────────────────────────────────────────
// COMPONENTE 3 — evento: focus / blur
// Validador de campos en tiempo real
// ─────────────────────────────────────────────
(function () {
  const campos = [
    {
      input: document.getElementById('input-usuario'),
      msg:   document.getElementById('msg-usuario'),
      validar: function (val) {
        if (val.length === 0)  return { ok: null,  texto: '' };
        if (val.length < 4)    return { ok: false, texto: '⚠ Mínimo 4 caracteres' };
        if (/\s/.test(val))    return { ok: false, texto: '⚠ Sin espacios' };
        return { ok: true, texto: '✓ Usuario válido' };
      }
    },
    {
      input: document.getElementById('input-email'),
      msg:   document.getElementById('msg-email'),
      validar: function (val) {
        if (val.length === 0) return { ok: null, texto: '' };
        const esEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        return esEmail
          ? { ok: true,  texto: '✓ Email válido' }
          : { ok: false, texto: '⚠ Formato inválido (ej: nombre@dominio.com)' };
      }
    },
    {
      input: document.getElementById('input-pass'),
      msg:   document.getElementById('msg-pass'),
      validar: function (val) {
        if (val.length === 0)  return { ok: null,  texto: '' };
        if (val.length < 6)    return { ok: false, texto: '⚠ Mínimo 6 caracteres' };
        return { ok: true, texto: '✓ Contraseña aceptada' };
      }
    }
  ];

  campos.forEach(function (campo) {
    campo.input.addEventListener('focus', function () {
      campo.input.classList.add('is-focus');
      campo.input.classList.remove('is-valid-custom', 'is-invalid-custom');
      campo.msg.textContent = '✏ Editando...';
      campo.msg.style.color = '#0d6efd';
    });

    campo.input.addEventListener('blur', function () {
      campo.input.classList.remove('is-focus');
      const resultado = campo.validar(campo.input.value);

      if (resultado.ok === true) {
        campo.input.classList.add('is-valid-custom');
        campo.msg.style.color = '#198754';
      } else if (resultado.ok === false) {
        campo.input.classList.add('is-invalid-custom');
        campo.msg.style.color = '#dc3545';
      } else {
        campo.msg.style.color = '#6c757d';
      }

      campo.msg.textContent = resultado.texto;
    });
  });
})();


// ─────────────────────────────────────────────
// COMPONENTE 4 — evento: keyup
// Vista previa en tiempo real
// ─────────────────────────────────────────────
(function () {
  const inputTitulo   = document.getElementById('input-titulo');
  const inputDesc     = document.getElementById('input-desc');
  const prevTitulo    = document.getElementById('preview-titulo');
  const prevDesc      = document.getElementById('preview-desc');
  const prevChars     = document.getElementById('preview-chars');
  const previewCard   = document.getElementById('preview-card');

  function actualizarPreview() {
    const titulo = inputTitulo.value.trim();
    const desc   = inputDesc.value.trim();
    const total  = inputTitulo.value.length + inputDesc.value.length;

    prevTitulo.textContent = titulo || 'Tu título aparecerá acá';
    prevTitulo.style.color = titulo ? '#212529' : '#6c757d';

    prevDesc.textContent = desc || 'Tu descripción aparecerá acá';
    prevDesc.style.color = desc ? '#495057' : '#6c757d';

    prevChars.textContent = `${total} caracteres`;

    if (titulo || desc) {
      previewCard.classList.add('has-content');
    } else {
      previewCard.classList.remove('has-content');
    }
  }

  inputTitulo.addEventListener('keyup', actualizarPreview);
  inputDesc.addEventListener('keyup', actualizarPreview);
})();


// ─────────────────────────────────────────────
// COMPONENTE 5 — evento: change
// Configurador de estilos en vivo
// ─────────────────────────────────────────────
(function () {
  const selFuente = document.getElementById('sel-fuente');
  const selSize   = document.getElementById('sel-size');
  const selFondo  = document.getElementById('sel-fondo');
  const preview   = document.getElementById('estilo-preview');
  const texto     = document.getElementById('estilo-texto');
  const changeLog = document.getElementById('cambio-log');

  const nombresCambio = {
    'sel-fuente': 'Fuente',
    'sel-size':   'Tamaño',
    'sel-fondo':  'Fondo'
  };

  function aplicarEstilos() {
    preview.style.fontFamily        = selFuente.value;
    preview.style.fontSize          = selSize.value;
    preview.style.backgroundColor   = selFondo.value;

    // Adaptar color de texto según luminosidad del fondo
    const esFondoOscuro = selFondo.value === '#1a1a2e';
    texto.style.color = esFondoOscuro ? '#f8f9fa' : '#212529';
  }

  function registrarCambio(idSelect, valorAnterior, valorNuevo) {
    const nombre = nombresCambio[idSelect];
    changeLog.className = 'alert alert-info py-2 small mb-0';
    changeLog.innerHTML = `<strong>${nombre}</strong> cambió de <em>${valorAnterior}</em> → <strong>${valorNuevo}</strong>`;
  }

  [selFuente, selSize, selFondo].forEach(function (select) {
    let valorAnterior = select.value;

    select.addEventListener('change', function () {
      const valorNuevo = select.value;
      registrarCambio(select.id, valorAnterior, select.options[select.selectedIndex].text);
      valorAnterior = valorNuevo;
      aplicarEstilos();
    });
  });

  // Aplicar estado inicial
  aplicarEstilos();
})();

const botones = document.querySelectorAll('.nav-btn')
const componentes = document.querySelectorAll('.componente')

botones.forEach(btn => {
    btn.addEventListener('click', () => {

        // ocultar todos
        componentes.forEach(c => c.classList.add('d-none'))

        // mostrar seleccionado
        const target = btn.dataset.target
        document.getElementById(target).classList.remove('d-none')
    })
})