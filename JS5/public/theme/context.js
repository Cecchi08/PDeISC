// ──────────────────────────────────────────────
// context.js — Lógica de modo claro / oscuro
// ──────────────────────────────────────────────
(function () {
  const STORAGE_KEY = 'alumnosdb-theme';
  const toggle      = document.getElementById('theme-toggle');
  const html        = document.documentElement;

  /* ── Helpers ─────────────────────────────── */
  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    // Respeta la preferencia del SO
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    toggle.setAttribute('aria-label',
      theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
    );
  }

  /* ── Init ────────────────────────────────── */
  applyTheme(getPreferred());

  /* ── Toggle click ────────────────────────── */
  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  /* ── Escuchar cambios del SO en tiempo real ─ */
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
})();
