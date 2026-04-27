const express = require("express");
const path = require("path");

const app = express();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Servidor
app.listen(3003, () => {
    console.log("Servidor corriendo en http://localhost:3003");
});