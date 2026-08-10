import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Interfaz que define los valores disponibles en el contexto del tema
interface ThemeContextType {
  dark: boolean;
  toggle: () => void;
}

// Creación del contexto con un valor por defecto
const ThemeContext = createContext<ThemeContextType>({ dark: true, toggle: () => {} });

// Proveedor del tema que envuelve a la aplicación y maneja el estado de claro/oscuro
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Estado inicial que lee de localStorage o usa oscuro por defecto
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // Efecto que actualiza el atributo del DOM y guarda en localStorage al cambiar el tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Función para alternar entre modo claro y oscuro
  const toggle = () => setDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personalizado para consumir el contexto del tema fácilmente
export const useTheme = () => useContext(ThemeContext);
