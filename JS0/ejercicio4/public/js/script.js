// NUMEROS: quitar primer elemento
const numeros = [10, 20, 30, 40];
numeros.shift();

// CHAT: eliminar primer mensaje
const chat = ["Hola", "¿Cómo estás?", "Todo bien"];
const eliminado = chat.shift();

// COLA: simular atención de clientes
const cola = ["Cliente 1", "Cliente 2", "Cliente 3"];
const atendido = cola.shift();

// MOSTRAR RESULTADOS
document.getElementById("numeros").textContent = "Quedaron: " + numeros.join(" - ");
document.getElementById("chat").textContent = "Mensajes: " + chat.join(" - ");
document.getElementById("mensajeEliminado").textContent = "Mensaje eliminado: " + eliminado;
document.getElementById("cola").textContent = "En espera: " + cola.join(" - ");
document.getElementById("atendido").textContent = "Atendido: " + atendido;