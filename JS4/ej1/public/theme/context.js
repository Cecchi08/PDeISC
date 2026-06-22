/**
 * @file context.js — Módulo de contexto de tema
 * @description Maneja el modo claro/oscuro para todos los ejercicios JS4.
 *   Persiste la preferencia del usuario en localStorage y aplica la clase
 *   `dark` al elemento <html>. Se inicializa leyendo la preferencia guardada
 *   o detectando la preferencia del sistema operativo.
 *
 * Uso:
 *   ThemeContext.init()    → llamar al cargar el DOM
 *   ThemeContext.toggle()  → llamar al hacer click en el botón
 *   ThemeContext.getCurrent() → retorna "dark" | "light"
 */

const ThemeContext = (() => {
  const STORAGE_KEY = "js4-theme";
  const DARK_CLASS  = "dark";

  /* ── Íconos SVG ── */
  const ICON_SUN  = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
             M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>`;

  const ICON_MOON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`;

  /**
   * Inicializa el tema leyendo localStorage o la preferencia del sistema.
   * @public
   */
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark") {
      document.documentElement.classList.add(DARK_CLASS);
    } else if (saved === "light") {
      document.documentElement.classList.remove(DARK_CLASS);
    } else {
      // Sin preferencia guardada → detectar del sistema
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) document.documentElement.classList.add(DARK_CLASS);
    }
    _actualizarIcono();
  }

  /**
   * Alterna entre modo claro y oscuro y persiste la preferencia.
   * @public
   */
  function toggle() {
    const ahora = document.documentElement.classList.toggle(DARK_CLASS);
    localStorage.setItem(STORAGE_KEY, ahora ? "dark" : "light");
    _actualizarIcono();
  }

  /**
   * Devuelve el tema actual.
   * @returns {"dark"|"light"}
   * @public
   */
  function getCurrent() {
    return document.documentElement.classList.contains(DARK_CLASS) ? "dark" : "light";
  }

  /**
   * Actualiza el ícono y aria-label del botón de toggle.
   * @private
   */
  function _actualizarIcono() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const isDark = document.documentElement.classList.contains(DARK_CLASS);
    btn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
    btn.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    btn.setAttribute("title",      isDark ? "Modo claro" : "Modo oscuro");
  }

  /**
   * Inicializa el listener del menú hamburguesa.
   * @public
   */
  function initMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    const nav = document.getElementById("mobile-nav");
    if (btn && nav) {
      btn.addEventListener("click", () => {
        nav.classList.toggle("open");
      });
    }
  }

  return { init, toggle, getCurrent, initMobileMenu };
})();
