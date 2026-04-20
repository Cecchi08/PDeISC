// ─────────────────────────────────────────────
// NAVEGACIÓN ENTRE COMPONENTES
// ─────────────────────────────────────────────
const botones = document.querySelectorAll('.nav-btn')
const componentes = document.querySelectorAll('.componente')

botones.forEach(btn => {
    btn.addEventListener('click', () => {
        componentes.forEach(c => c.classList.add('d-none'))
        const target = btn.dataset.target
        document.getElementById(target).classList.remove('d-none')
    })
})


// ─────────────────────────────────────────────
// CONTADOR DE HIJOS (EJERCICIO 3)
// ─────────────────────────────────────────────
const botonesHijos = document.querySelectorAll('.btn-hijos')

botonesHijos.forEach(btn => {
    btn.addEventListener('click', () => {

        const contenedor = btn.closest('.card-body')
        const resultado = contenedor.querySelector('.resultado-hijos')

        // Contar SOLO hijos útiles (excluye botón y resultado)
        const hijosReales = Array.from(contenedor.children).filter(el => 
            !el.classList.contains('btn-hijos') &&
            !el.classList.contains('resultado-hijos')
        )

        resultado.textContent = `Este componente tiene ${hijosReales.length} hijos`
    })
})


// ─────────────────────────────────────────────
// COMPONENTE 1 — CONTADOR
// ─────────────────────────────────────────────
(function () {
    const display = document.getElementById('contador-display')
    const log     = document.getElementById('contador-log')

    if (!display) return

    let cuenta = 0

    function actualizar() {
        display.textContent = cuenta

        if (cuenta > 0) display.classList.replace('text-primary','text-success')
        else if (cuenta < 0) display.classList.replace('text-primary','text-danger')
        else display.className = 'display-1 text-primary mb-3'
    }

    document.getElementById('btn-sumar')?.addEventListener('click', () => {
        cuenta++
        actualizar()
        if(log) log.textContent = `Resultado: ${cuenta}`
    })

    document.getElementById('btn-restar')?.addEventListener('click', () => {
        cuenta--
        actualizar()
        if(log) log.textContent = `Resultado: ${cuenta}`
    })

    document.getElementById('btn-reset')?.addEventListener('click', () => {
        cuenta = 0
        actualizar()
        if(log) log.textContent = 'Reiniciado'
    })

})()


// ─────────────────────────────────────────────
// COMPONENTE 2 — COLORES (HOVER)
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// COMPONENTE 2 — COLORES 
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
// COMPONENTE 3 — VALIDACIÓN
// ─────────────────────────────────────────────
(function () {

    const usuario = document.getElementById('input-usuario')
    const email   = document.getElementById('input-email')
    const pass    = document.getElementById('input-pass')

    if (!usuario || !email || !pass) return

    usuario.addEventListener('blur', () => {
        usuario.classList.toggle('is-valid', usuario.value.length >= 4)
    })

    email.addEventListener('blur', () => {
        const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
        email.classList.toggle('is-valid', valido)
    })

    pass.addEventListener('blur', () => {
        pass.classList.toggle('is-valid', pass.value.length >= 6)
    })

})()


// ─────────────────────────────────────────────
// COMPONENTE 4 — PREVIEW
// ─────────────────────────────────────────────
(function () {

    const titulo = document.getElementById('input-titulo')
    const desc   = document.getElementById('input-desc')
    const prevT  = document.getElementById('preview-titulo')
    const prevD  = document.getElementById('preview-desc')
    const prevC  = document.getElementById('preview-chars')

    if (!titulo || !desc) return

    function actualizar() {
        prevT.textContent = titulo.value || 'Título'
        prevD.textContent = desc.value || 'Descripción'
        prevC.textContent = (titulo.value.length + desc.value.length) + ' caracteres'
    }

    titulo.addEventListener('keyup', actualizar)
    desc.addEventListener('keyup', actualizar)

})()


// ─────────────────────────────────────────────
// COMPONENTE 5 — ESTILOS
// ─────────────────────────────────────────────
(function () {

    const fuente = document.getElementById('sel-fuente')
    const size   = document.getElementById('sel-size')
    const fondo  = document.getElementById('sel-fondo')
    const preview= document.getElementById('estilo-preview')

    if (!fuente || !size || !fondo) return

    function aplicar() {
        preview.style.fontFamily = fuente.value
        preview.style.fontSize = size.value
        preview.style.backgroundColor = fondo.value
    }

    fuente.addEventListener('change', aplicar)
    size.addEventListener('change', aplicar)
    fondo.addEventListener('change', aplicar)

})()