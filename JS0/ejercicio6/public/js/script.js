// NUMEROS: copiar primeros 3 elementos
const numeros = [10, 20, 30, 40, 50];
const primeros = numeros.slice(0, 3);

// PELICULAS: copiar desde posición 2 hasta 4
const peliculas = ["Matrix", "Avatar", "Titanic", "Inception", "Joker"];
const copiaPeliculas = peliculas.slice(2, 5);

// ULTIMOS: copiar últimos 3 elementos sin modificar original
const datos = [1, 2, 3, 4, 5, 6];
const ultimos = datos.slice(-3);

// MOSTRAR RESULTADOS
document.getElementById("primeros").textContent = "Copia: " + primeros.join(" - ");
document.getElementById("peliculas").textContent = "Copia: " + copiaPeliculas.join(" - ");
document.getElementById("ultimos").textContent = "Copia: " + ultimos.join(" - ");