import { useState } from 'react'
import { useTheme } from './theme/context'
import './App.css'

function App() {
  // Consumimos el contexto de tema
  const { dark, toggle } = useTheme()
  // Estado para mantener el valor numérico del contador
  const [count, setCount] = useState(0)

  // Determina la clase CSS dependiendo del valor (positivo, negativo o cero)
  const getClass = () => {
    if (count > 0) return 'positive'
    if (count < 0) return 'negative'
    return 'zero'
  }

  return (
    <div className="app">
      {/* Botón flotante para cambiar el tema */}
      <button className="theme-toggle" onClick={toggle} title="Cambiar tema">
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Contenedor principal de la herramienta contador expandido */}
      <div className="counter-container">
        <h1 className="page-title">Contador Interactivo</h1>
        <p className="subtitle">Usa los controles para modificar el valor y observa el cambio de estado visual.</p>

        <div className="counter-card">
          <span className="counter-label">Valor actual</span>
          {/* Muestra el valor con un color dinámico según si es mayor o menor a cero */}
          <div className={`counter-display ${getClass()}`}>{count}</div>
          
          <div className="counter-buttons">
            <button className="btn btn-decrement" onClick={() => setCount(c => c - 1)}>
              − Decrementar
            </button>
            <button className="btn btn-reset" onClick={() => setCount(0)}>
              Resetear
            </button>
            <button className="btn" onClick={() => setCount(c => c + 1)}>
              + Incrementar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
