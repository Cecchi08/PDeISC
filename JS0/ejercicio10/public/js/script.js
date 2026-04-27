// NUMEROS: multiplicar cada número por 3
const numeros = [1, 2, 3, 4];
const numerosX3 = numeros.map(n => n * 3);

// NOMBRES: convertir a mayúsculas
const nombres = ["juan", "ana", "luis"];
const nombresMayus = nombres.map(n => n.toUpperCase());

// PRECIOS: agregar 21% de IVA
const precios = [100, 200, 300];
const preciosIVA = precios.map(p => p * 1.21);

// MOSTRAR RESULTADOS
document.getElementById("numeros").textContent = numerosX3.join(" - ");
document.getElementById("nombres").textContent = nombresMayus.join(" - ");
document.getElementById("precios").textContent = preciosIVA.map(p => p.toFixed(2)).join(" - ");