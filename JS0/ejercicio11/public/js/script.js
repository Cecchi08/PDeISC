// NUMEROS: filtrar mayores a 10
const numeros = [5, 12, 8, 20, 3];
const mayores = numeros.filter(n => n > 10);

// PALABRAS: filtrar más de 5 letras
const palabras = ["auto", "computadora", "mesa", "programacion"];
const largas = palabras.filter(p => p.length > 5);

// USUARIOS: filtrar activos
const usuarios = [
    { nombre: "Juan", activo: true },
    { nombre: "Ana", activo: false },
    { nombre: "Luis", activo: true }
];

const activos = usuarios.filter(u => u.activo);

// MOSTRAR RESULTADOS
document.getElementById("numeros").textContent = mayores.join(" - ");
document.getElementById("palabras").textContent = largas.join(" - ");
document.getElementById("usuarios").textContent = activos.map(u => u.nombre).join(" - ");