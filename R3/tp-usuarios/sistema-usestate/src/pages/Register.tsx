// Componente / Módulo: Register
// Propósito: Maneja la lógica y la vista/rutas relacionadas con Register.
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavContext';
import api from '../api/axiosConfig';
import './Auth.css';

const nameRgx = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/;
const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRgx  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Register() {
  const { login } = useAuth();
  const { navigate } = useNav();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre) e.nombre = 'Nombre requerido.';
    else if (!nameRgx.test(form.nombre)) e.nombre = 'Solo letras, 2-50 caracteres.';
    if (!form.email) e.email = 'Email requerido.';
    else if (!emailRgx.test(form.email)) e.email = 'Email inválido.';
    if (!form.password) e.password = 'Contraseña requerida.';
    else if (!passRgx.test(form.password)) e.password = 'Mín. 8 chars, mayúscula, minúscula y número.';
    if (form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden.';
    return e;
  };

  const handleChange = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        nombre: form.nombre, email: form.email, password: form.password
      });
      login(data.user, data.token);
      navigate('dashboard');
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
          <p>Sistema con useState</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
              placeholder="Juan Pérez" className={errors.nombre ? 'input-error' : ''} />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>
          <div className="field-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="tu@email.com" className={errors.email ? 'input-error' : ''} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="field-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" className={errors.password ? 'input-error' : ''} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="field-group">
            <label>Confirmar Contraseña</label>
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
              placeholder="••••••••" className={errors.confirm ? 'input-error' : ''} />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>
          {apiError && <div className="api-error">{apiError}</div>}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Registrarse'}
          </button>
        </form>
        <p className="auth-footer">
          ¿Ya tenés cuenta?{' '}
          <button className="link-btn" onClick={() => navigate('login')}>Iniciá sesión</button>
        </p>
      </div>
    </div>
  );
}
