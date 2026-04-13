// Componente: menú de navegación reutilizable (Bootstrap)

export function getMenu(paginaActiva = '') {
    const links = [
      { href: '/',           label: 'Inicio',      icono: 'house-fill' },
      { href: '/tiempo',     label: 'Tiempo',       icono: 'clock-fill' },
      { href: '/calculo',    label: 'Cálculo',      icono: 'calculator-fill' },
      { href: '/filesystem', label: 'FileSystem',   icono: 'folder-fill' },
      { href: '/url-demo',   label: 'Módulo URL',   icono: 'link-45deg' },
      { href: '/npm-demo',   label: 'NPM Package',  icono: 'box-fill' },
    ];
  
    const items = links.map(link => {
      const activo = paginaActiva === link.href ? 'active fw-bold' : '';
      return `
        <li class="nav-item">
          <a class="nav-link ${activo}" href="${link.href}">
            <i class="bi bi-${link.icono} me-1"></i>${link.label}
          </a>
        </li>`;
    }).join('');
  
    return `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container">
          <a class="navbar-brand fw-bold" href="/">
            <i class="bi bi-cpu-fill me-2"></i>NodeApp
          </a>
          <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#navMenu">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navMenu">
            <ul class="navbar-nav ms-auto">
              ${items}
            </ul>
          </div>
        </div>
      </nav>`;
  }
  