// Componente / Módulo: Login
// Propósito: Maneja la lógica y la vista/rutas relacionadas con Login.
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavContext';
import api from '../api/axiosConfig';
import './Auth.css';

const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRgx  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Login() {
  const { login } = useAuth();
  const { navigate } = useNav();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email requerido.';
    else if (!emailRgx.test(form.email)) e.email = 'Email inválido.';
    if (!form.password) e.password = 'Contraseña requerida.';
    else if (!passRgx.test(form.password)) e.password = 'Mín. 8 chars, mayúscula, minúscula y número.';
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
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('dashboard');
    } catch (err) {
      setApiError(err.response?.data?.error || 'Error al iniciar sesión.');
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
          <p>Sistema con useState</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
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
          {apiError && <div className="api-error">{apiError}</div>}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Ingresar'}
          </button>
        </form>
        <p className="auth-footer">
          ¿No tenés cuenta?{' '}
          <button className="link-btn" onClick={() => navigate('register')}>Registrate</button>
        </p>
      </div>
    </div>
  );
}
