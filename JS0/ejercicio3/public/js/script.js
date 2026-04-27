// COLORES: agregar 3 al inicio con unshift()
const colores = [];
colores.unshift("Rojo");
colores.unshift("Azul");
colores.unshift("Verde");

// TAREAS: agregar tarea urgente al inicio
const tareas = ["Estudiar", "Hacer ejercicio", "Leer"];
tareas.unshift("ENTREGA URGENTE");

// USUARIOS: insertar usuario al inicio
const usuarios = ["Lucas", "Martina", "Sofía"];
usuarios.unshift("Admin");

// MOSTRAR RESULTADOS
document.getElementById("colores").textContent = "Resultado: " + colores.join(" - ");
document.getElementById("tareas").textContent = "Tareas: " + tareas.join(" - ");
document.getElementById("usuarios").textContent = "Usuarios: " + usuarios.join(" - ");