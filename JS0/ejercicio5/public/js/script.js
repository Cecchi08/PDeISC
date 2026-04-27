// ELIMINAR: quitar 2 elementos desde posición 1
const letras = ["A", "B", "C", "D", "E"];
letras.splice(1, 2);

// INSERTAR: agregar nombre en segunda posición sin eliminar
const nombres = ["Juan", "Pedro", "Luis"];
nombres.splice(1, 0, "Mateo");
    
// REEMPLAZAR: cambiar 2 elementos desde una posición
const numeros = [1, 2, 3, 4, 5];
numeros.splice(2, 2, 99, 100);

// MOSTRAR RESULTADOS
document.getElementById("eliminar").textContent = "Resultado: " + letras.join(" - ");
document.getElementById("insertar").textContent = "Resultado: " + nombres.join(" - ");
document.getElementById("reemplazar").textContent = "Resultado: " + numeros.join(" - ");