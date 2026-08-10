import { useState } from 'react'
import { useTheme } from './theme/context'
import './App.css'

function App() {
  // Consumimos el contexto del tema para saber si es oscuro y poder alternarlo
  const { dark, toggle } = useTheme()
  
  // Estado para manejar el color actual del texto (verde, azul, rojo)
  const [color, setColor] = useState<'verde' | 'azul' | 'rojo'>('verde')

  return (
    <div className="app">
      {/* Botón flotante para cambiar entre modo claro y oscuro */}
      <button className="theme-toggle" onClick={toggle} title="Cambiar tema">
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Tarjeta principal con el saludo inicial, expandida para ocupar más espacio */}
      <div className="hola-card">
        <h1 className={`hola-title text-${color}`}>¡Hola, mundo!</h1>
        <p className="subtitle">Bienvenido a mi primera aplicación interactiva.</p>
        
        {/* Contenedor de botones para cambiar el color del texto */}
        <div className="color-buttons">
          <button 
            className={`btn-color btn-verde ${color === 'verde' ? 'active' : ''}`}
            onClick={() => setColor('verde')}
          >
            Verde
          </button>
          <button 
            className={`btn-color btn-azul ${color === 'azul' ? 'active' : ''}`}
            onClick={() => setColor('azul')}
          >
            Azul
          </button>
          <button 
            className={`btn-color btn-rojo ${color === 'rojo' ? 'active' : ''}`}
            onClick={() => setColor('rojo')}
          >
            Rojo
          </button>
        </div>
        
        <div className="features-grid">
          <div className="feature-item">
            <h3>Diseño Futurista</h3>
            <p>Interfaz moderna con efectos de neón y glassmorphism.</p>
          </div>
          <div className="feature-item">
            <h3>100% Responsive</h3>
            <p>Se adapta a cualquier tamaño de pantalla perfectamente.</p>
          </div>
        </div>

        <span className="badge">React · TypeScript · Vite</span>
      </div>
    </div>
  )
}

export default App
