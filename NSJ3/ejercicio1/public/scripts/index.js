const contenedor = document.getElementById('contenedor')

let h1 = null
let img = null
let imagenActual = 1

// 1. Agregar H1
document.getElementById('btnAgregarH1').onclick = () => {
    if (!h1) {
        h1 = document.createElement('h1')
        h1.textContent = 'Hola DOM'
        contenedor.appendChild(h1)
    }
}

// 2. Cambiar texto
document.getElementById('btnCambiarTexto').onclick = () => {
    if (h1) {
        h1.textContent = 'Chau DOM'
    }
}

// 3. Cambiar color
document.getElementById('btnColor').onclick = () => {
    if (h1) {
        h1.style.color = 'red'
    }
}

// 4. Agregar imagen
document.getElementById('btnAgregarImg').onclick = () => {
    if (!img) {
        img = document.createElement('img')
        img.src = '/img/img1.jpg'
        img.style.width = '200px'
        contenedor.appendChild(img)
    }
}

// 5. Cambiar imagen
document.getElementById('btnCambiarImg').onclick = () => {
    if (img) {
        if (imagenActual === 1) {
            img.src = '/img/download.png'
            imagenActual = 2
        } else {
            img.src = '/img/Pedro.png'
            imagenActual = 1
        }
    }
}

// 6. Cambiar tamaño
document.getElementById('btnTamano').onclick = () => {
    if (img) {
        img.style.width = img.style.width === '200px' ? '400px' : '200px'
    }
}