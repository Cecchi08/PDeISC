// SUMA: sumar todos los elementos
const numeros = [5, 10, 15];
const suma = numeros.reduce((acc, n) => acc + n, 0);

// MULTIPLICACION: multiplicar todos los elementos
const enteros = [2, 3, 4];
const multiplicacion = enteros.reduce((acc, n) => acc * n, 1);

// PRECIOS: obtener total de objetos
const productos = [
    { precio: 100 },
    { precio: 200 },
    { precio: 300 }
];

const total = productos.reduce((acc, p) => acc + p.precio, 0);

// MOSTRAR RESULTADOS
document.getElementById("suma").textContent = "Total: " + suma;
document.getElementById("multi").textContent = "Total: " + multiplicacion;
document.getElementById("precios").textContent = "Total: $" + total;