// FRUTAS
const frutas = [];
frutas.push("Manzana", "Banana", "Naranja");

// AMIGOS
const amigos = ["Lucas", "Martín"];
amigos.push("Mateo", "Joaquín", "Tomás");

// NÚMEROS
const numeros = [5, 10, 15];
const nuevo = 17;

let mensaje = "";

if (nuevo > numeros[numeros.length - 1]) {
    numeros.push(nuevo);
    mensaje = "Se agregó correctamente";
} else {
    mensaje = "No se agregó";
}

// MOSTRAR
document.getElementById("frutas").textContent = frutas.join(" - ");
document.getElementById("amigos").textContent = amigos.join(" - ");
document.getElementById("numeros").textContent = numeros.join(" - ");
document.getElementById("mensaje").textContent = mensaje;