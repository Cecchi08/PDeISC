// LETRAS: invertir array
const letras = ["A", "B", "C", "D"];
letras.reverse();

// NUMEROS: invertir orden
const numeros = [1, 2, 3, 4, 5];
numeros.reverse();

// TEXTO: convertir string a array y revertir
const texto = "Hola mundo";
const invertido = texto.split("").reverse().join("");

// MOSTRAR RESULTADOS
document.getElementById("letras").textContent = letras.join(" - ");
document.getElementById("numeros").textContent = numeros.join(" - ");
document.getElementById("texto").textContent = invertido;