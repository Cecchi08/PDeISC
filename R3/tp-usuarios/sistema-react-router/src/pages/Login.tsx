// Componente / Módulo: Login
// Propósito: Maneja la lógica y la vista/rutas relacionadas con Login.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import api from '../api/axiosConfig';
import './Auth.css';

const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRgx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Login() {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!values.email) e.email = 'Email requerido.';
    else if (!emailRgx.test(values.email)) e.email = 'Email inválido.';
    if (!values.password) e.password = 'Contraseña requerida.';
    else if (!passRgx.test(values.password)) e.password = 'Mín. 8 chars, mayúscula, minúscula y número.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setError('Por favor completa los campos correctamente.'); return; }
    
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', values);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <div className="auth-header">
          <span className="auth-icon">🔐</span>
          <h1>Iniciar Sesión</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" value={values.email} onChange={handleChange} placeholder="ejemplo@correo.com" />
          </div>
          
          <div className="field-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={values.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          {error && <div className="api-error">{error}</div>}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Ingresar'}
          </button>
        </form>
        <p className="auth-footer">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
}
