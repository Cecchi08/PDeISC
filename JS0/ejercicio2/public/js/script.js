// 1) ELIMINAR ÚLTIMO ANIMAL

const animales = ["Perro", "Gato", "Conejo", "León"];

animales.pop();


// 2) LISTA DE COMPRAS

const compras = ["Pan", "Leche", "Huevos", "Carne"];

const eliminado = compras.pop();


// 3) VACIAR ARRAY CON WHILE

const datos = [1, 2, 3, 4, 5];
let resultado = [];

while (datos.length > 0) {
    resultado.push(datos.pop());
}


// MOSTRAR

document.getElementById("animales").textContent =
    "Resultado: " + animales.join(" - ");

document.getElementById("compras").textContent =
    "Lista actual: " + compras.join(" - ");

document.getElementById("eliminado").textContent =
    "Eliminado: " + eliminado;

document.getElementById("vaciado").textContent =
    "Se eliminaron en orden: " + resultado.join(" → ");