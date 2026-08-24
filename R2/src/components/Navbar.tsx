import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../theme/context.ts';

function Navbar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-text">TaskFlow</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Inicio
          </Link>
          <Link
            to="/crear"
            className={`nav-link ${location.pathname === '/crear' ? 'active' : ''}`}
          >
            Nueva Tarea
          </Link>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Alternar tema"
          title={darkMode ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
        >
          <span className="theme-icon">{darkMode ? '☀' : '☾'}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
