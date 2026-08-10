import { useTheme } from './theme/context'
import Tarjeta from './components/Tarjeta'
import './App.css'

function App() {
  // Obtenemos el tema actual para cambiar entre claro y oscuro
  const { dark, toggle } = useTheme()

  return (
    <div className="app">
      {/* Botón flotante para alternar el tema visual */}
      <button className="theme-toggle" onClick={toggle} title="Cambiar tema">
        {dark ? '☀️' : '🌙'}
      </button>

      <h1 className="page-title">Tarjeta de presentación</h1>

      {/* Componente Tarjeta que recibe datos dinámicos mediante props */}
      <div className="card-container">
        <Tarjeta
          nombre="Claudio Chiqui"
          apellido="Tapia"
          profesion="Presidente de la AFA"
          imagen="/chiqui.jpg"
        />
      </div>
    </div>
  )
}

export default App
