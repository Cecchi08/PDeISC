// SALUDOS: mostrar cada nombre con saludo
const nombres = ["Lucas", "Martina", "Sofía"];
let saludos = [];

nombres.forEach(nombre => saludos.push("Hola " + nombre));

// DOBLES: calcular el doble de cada número
const numeros = [2, 4, 6, 8];
let dobles = [];

numeros.forEach(num => dobles.push(num * 2));

// PERSONAS: mostrar nombre y edad
const personas = [
    { nombre: "Juan", edad: 20 },
    { nombre: "Ana", edad: 25 },
    { nombre: "Luis", edad: 30 }
];

let resultadoPersonas = [];

personas.forEach(p => resultadoPersonas.push(p.nombre + " tiene " + p.edad + " años"));

// MOSTRAR RESULTADOS
document.getElementById("saludos").textContent = saludos.join(" | ");
document.getElementById("dobles").textContent = dobles.join(" - ");
document.getElementById("personas").textContent = resultadoPersonas.join(" | ");