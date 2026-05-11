// Claves de almacenamiento
const THEME_KEY = 'theme';
const LIGHT = 'light';  
const DARK = 'dark';

// Obtiene el tema actual guardado o devuelve 'light' por defecto 
function getTheme() {
    return localStorage.getItem(THEME_KEY) || LIGHT;
}

// Aplica el tema al documento HTML y actualiza el ícono 
function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Actualizar ícono del botón de tema
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === LIGHT ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
    }
}

// Alterna entre tema claro y oscuro 
function toggleTheme() {
    const current = getTheme();
    const next = current === LIGHT ? DARK : LIGHT;
    applyTheme(next);
}

// Inicializa el tema al cargar la página y enlaza el botón toggle 
function initTheme() {
    // Aplicar tema guardado
    applyTheme(getTheme());

    // Vincular el botón de cambio de tema
    const btnToggle = document.getElementById('btnThemeToggle');
    if (btnToggle) {
        btnToggle.addEventListener('click', toggleTheme);
    }
}

// Exportar para uso global
window.ThemeContext = { initTheme, toggleTheme, getTheme, applyTheme };