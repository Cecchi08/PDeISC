import { useState } from 'react'
import { useTheme } from './theme/context'
import './App.css'

interface Tarea {
  id: number;
  texto: string;
  completada: boolean;
}

function App() {
  // Tema visual (claro/oscuro) global de la aplicación
  const { dark, toggle } = useTheme()
  
  // Estado para la lista de tareas y el input actual
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  // Expresión regular que permite letras mayúsculas, minúsculas, espacios y caracteres especiales (sin números)
  const validTextRegex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;

  // Función que valida y agrega una nueva tarea a la lista
  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault()
    const texto = input.trim()

    if (!texto) {
      setError('La tarea no puede estar vacía')
      return
    }
    
    // Validación con expresión regular
    if (!validTextRegex.test(texto)) {
      setError('Solo se permiten letras, espacios y caracteres especiales (no números)')
      return
    }

    if (texto.length < 2) {
      setError('Mínimo 2 caracteres')
      return
    }
    if (texto.length > 100) {
      setError('Máximo 100 caracteres')
      return
    }

    setTareas(prev => [...prev, { id: Date.now(), texto, completada: false }])
    setInput('')
    setError('')
  }

  // Alterna el estado de 'completada' de una tarea específica
  const toggleTarea = (id: number) => {
    setTareas(prev =>
      prev.map(t => t.id === id ? { ...t, completada: !t.completada } : t)
    )
  }

  // Elimina una tarea de la lista usando su id
  const eliminarTarea = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setTareas(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="app">
      {/* Botón flotante para tema */}
      <button className="theme-toggle" onClick={toggle} title="Cambiar tema">
        {dark ? '☀️' : '🌙'}
      </button>

      <h1 className="page-title">Gestor de Tareas</h1>
      <p className="subtitle">Organiza tu día de forma futurista.</p>

      {/* Contenedor tipo dashboard divido en panel izquierdo y derecho para no dejar espacio vacío */}
      <div className="dashboard-container">
        
        {/* Panel Izquierdo: Formulario e Información */}
        <div className="side-panel">
          <div className="info-card">
            <h3>Nueva Tarea</h3>
            <form className="todo-form" onSubmit={agregarTarea}>
              <input
                className={`todo-input ${error ? 'error' : ''}`}
                type="text"
                placeholder="Escribí una nueva tarea..."
                value={input}
                onChange={e => { setInput(e.target.value); setError(''); }}
                maxLength={100}
              />
              <button className="btn-add" type="submit">Agregar</button>
            </form>
            {error && <p className="error-msg">{error}</p>}
          </div>
        </div>

        {/* Panel Derecho: Lista de Tareas */}
        <div className="main-panel">
          <div className="todo-container">
            <h3>Tus Tareas</h3>
            {tareas.length === 0 ? (
              <div className="todo-empty">
                <p>No hay tareas aún. ¡Agregá una desde el panel!</p>
              </div>
            ) : (
              <ul className="todo-list">
                {tareas.map(tarea => (
                  <li
                    key={tarea.id}
                    className={`todo-item ${tarea.completada ? 'completed' : ''}`}
                    onClick={() => toggleTarea(tarea.id)}
                  >
                    <div className="todo-checkbox">
                      {tarea.completada && '✓'}
                    </div>
                    <span className="todo-text">{tarea.texto}</span>
                    <button className="btn-delete" onClick={(e) => eliminarTarea(tarea.id, e)}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
