// Componente / Módulo: Register
// Propósito: Maneja la lógica y la vista/rutas relacionadas con Register.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import api from '../api/axiosConfig';
import './Auth.css';

const nameRgx = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRgx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Register() {
  const { values, handleChange } = useForm({ nombre: '', email: '', password: '', confirm: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!values.nombre) e.nombre = 'Nombre requerido.';
    else if (!nameRgx.test(values.nombre)) e.nombre = 'Solo letras, 2-50 caracteres.';
    if (!values.email) e.email = 'Email requerido.';
    else if (!emailRgx.test(values.email)) e.email = 'Email inválido.';
    if (!values.password) e.password = 'Contraseña requerida.';
    else if (!passRgx.test(values.password)) e.password = 'Mín. 8 chars, mayúscula, minúscula y número.';
    if (values.password !== values.confirm) e.confirm = 'Las contraseñas no coinciden.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        nombre: values.nombre, email: values.email, password: values.password
      });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass">
        <div className="auth-header">
          <span className="auth-icon">✨</span>
          <h1>Crear Cuenta</h1>
          <p>Completá tus datos para registrarte</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label>Nombre</label>
            <input
              type="text" name="nombre" value={values.nombre}
              onChange={handleChange} placeholder="Juan Pérez"
              className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>
          <div className="field-group">
            <label>Email</label>
            <input
              type="email" name="email" value={values.email}
              onChange={handleChange} placeholder="tu@email.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field-group">
            <label>Contraseña</label>
            <input
              type="password" name="password" value={values.password}
              onChange={handleChange} placeholder="••••••••"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="field-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password" name="confirm" value={values.confirm}
              onChange={handleChange} placeholder="••••••••"
              className={errors.confirm ? 'input-error' : ''}
            />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>
          {apiError && <div className="api-error">{apiError}</div>}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Registrarse'}
          </button>
        </form>
        <p className="auth-footer">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}
