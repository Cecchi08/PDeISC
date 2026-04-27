// PERRO: encontrar posición en array
const animales = ["gato", "perro", "conejo", "loro"];
const posPerro = animales.indexOf("perro");

// NUMERO: verificar si existe el 50
const numeros = [10, 20, 30, 40, 50];
const posNumero = numeros.indexOf(50);

// CIUDAD: buscar Madrid o mostrar mensaje
const ciudades = ["Buenos Aires", "Roma", "París"];
const posMadrid = ciudades.indexOf("Madrid");

// MOSTRAR RESULTADOS
document.getElementById("perro").textContent = "Posición: " + posPerro;
document.getElementById("numero").textContent =
    posNumero !== -1 ? "Está en posición: " + posNumero : "No se encontró el número";
document.getElementById("ciudad").textContent =
    posMadrid !== -1 ? "Madrid está en posición: " + posMadrid : "Madrid no está en el array";