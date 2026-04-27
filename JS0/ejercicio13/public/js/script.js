// NUMEROS: ordenar de menor a mayor
const numeros = [30, 10, 50, 20];
numeros.sort((a, b) => a - b);

// PALABRAS: ordenar alfabéticamente
const palabras = ["banana", "manzana", "pera", "uva"];
palabras.sort();

// PERSONAS: ordenar por edad
const personas = [
    { nombre: "Juan", edad: 25 },
    { nombre: "Ana", edad: 20 },
    { nombre: "Luis", edad: 30 }
];

personas.sort((a, b) => a.edad - b.edad);

// MOSTRAR RESULTADOS
document.getElementById("numeros").textContent = numeros.join(" - ");
document.getElementById("palabras").textContent = palabras.join(" - ");
document.getElementById("personas").textContent = personas.map(p => p.nombre + " (" + p.edad + ")").join(" | ");