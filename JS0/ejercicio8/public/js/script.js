// ADMIN: comprobar si existe en array
const usuarios = ["user1", "admin", "user2"];
const esAdmin = usuarios.includes("admin");

// VERDE: verificar si está en colores
const colores = ["rojo", "azul", "amarillo"];
const hayVerde = colores.includes("verde");

// NUMERO: verificar antes de agregar
const numeros = [10, 20, 30];
const nuevo = 20;

let mensaje = "";

if (!numeros.includes(nuevo)) {
    numeros.push(nuevo);
    mensaje = "Número agregado";
} else {
    mensaje = "El número ya existe";
}

// MOSTRAR RESULTADOS
document.getElementById("admin").textContent = esAdmin ? "Existe admin" : "No existe admin";
document.getElementById("verde").textContent = hayVerde ? "Existe verde" : "No existe verde";
document.getElementById("numeros").textContent = "Array: " + numeros.join(" - ");
document.getElementById("resultado").textContent = mensaje;