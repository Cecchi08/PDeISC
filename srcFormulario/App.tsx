import { useState } from 'react'
import { useTheme } from './theme/context'
import './App.css'

function App() {
  // Consumimos el estado del tema
  const { dark, toggle } = useTheme()

  // Estados para manejar los datos del formulario y su validación
  const [nombre, setNombre] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [nombreGuardado, setNombreGuardado] = useState('')
  const [errorNombre, setErrorNombre] = useState('')

  // Validaciones mediante expresiones regulares
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{2,30}$/;

  // Maneja el evento de envío, realiza validaciones y actualiza el estado
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const valNombre = nombre.trim()
    let hasError = false
    let nuevoError = ''

    if (!valNombre) {
      nuevoError = 'El nombre es obligatorio'
      hasError = true
    } else if (valNombre.length < 2 || valNombre.length > 30) {
      nuevoError = 'Debe tener entre 2 y 30 caracteres'
      hasError = true
    } else if (!regexNombre.test(valNombre)) {
      nuevoError = 'Solo se permiten letras y espacios'
      hasError = true
    }

    setErrorNombre(nuevoError)

    if (!hasError) {
      setNombreGuardado(valNombre)
      setEnviado(true)
    }
  }

  // Reinicia todos los campos del formulario
  const handleReset = () => {
    setNombre('')
    setEnviado(false)
    setNombreGuardado('')
    setErrorNombre('')
  }

  return (
    <div className="app">
      {/* Botón flotante para el tema */}
      <button className="theme-toggle" onClick={toggle} title="Cambiar tema">
        {dark ? '☀️' : '🌙'}
      </button>

      <h1 className="page-title">Suscripción al Newsletter</h1>
      <p className="subtitle">Únete a nuestra comunidad para recibir novedades.</p>

      {/* Contenedor principal estructurado para llenar pantalla */}
      <div className="form-container">
        
        {/* Panel lateral decorativo */}
        <div className="form-info-panel">
          <h3>Beneficios Exclusivos</h3>
          <ul className="benefits-list">
            <li>✨ Acceso anticipado a herramientas premium</li>
            <li>📚 Tutoriales semanales de desarrollo web</li>
            <li>🎨 Recursos de diseño UI/UX gratuitos</li>
            <li>🚀 Invitaciones a eventos exclusivos</li>
          </ul>
        </div>

        {/* Panel principal del formulario */}
        <div className="form-card">
          {!enviado ? (
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label className="form-label" htmlFor="nombre">Nombre Completo</label>
                <input
                  id="nombre"
                  className={`form-input ${errorNombre ? 'error' : ''}`}
                  type="text"
                  placeholder="Ingresá tu nombre..."
                  value={nombre}
                  onChange={e => { setNombre(e.target.value); setErrorNombre(''); }}
                  maxLength={30}
                />
                {errorNombre && <p className="error-msg">{errorNombre}</p>}
              </div>

              <button className="btn-submit" type="submit">Suscribirme Ahora</button>
            </form>
          ) : (
            <div className="welcome-msg">
              <div className="success-icon">✓</div>
              <h2>¡Suscripción Exitosa!</h2>
              <p>Bienvenido/a, <span className="welcome-name">{nombreGuardado}</span>.</p>
              <p className="details">¡Ya sos parte de la comunidad exclusiva!</p>
              <button className="btn-reset" onClick={handleReset}>Enviar otra respuesta</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
