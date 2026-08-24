import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Task } from '../types.ts';

interface CreatePageProps {
  onAddTask: (task: Omit<Task, 'id' | 'fechaCreacion'>) => void;
}

interface FormData {
  titulo: string;
  descripcion: string;
  completada: boolean;
}

interface FormErrors {
  titulo?: string;
  descripcion?: string;
}

function CreatePage({ onAddTask }: CreatePageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descripcion: '',
    completada: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Validaciones con regex y reglas
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const tituloTrim = formData.titulo.trim();
    const descTrim = formData.descripcion.trim();

    // Título: obligatorio, 3-100 caracteres, letras/números/espacios/acentos
    if (!tituloTrim) {
      newErrors.titulo = 'El título es obligatorio.';
    } else if (tituloTrim.length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres.';
    } else if (tituloTrim.length > 100) {
      newErrors.titulo = 'El título no puede superar los 100 caracteres.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,\-()]+$/.test(tituloTrim)) {
      newErrors.titulo = 'El título contiene caracteres no permitidos.';
    }

    // Descripción: obligatoria, 10-500 caracteres
    if (!descTrim) {
      newErrors.descripcion = 'La descripción es obligatoria.';
    } else if (descTrim.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
    } else if (descTrim.length > 500) {
      newErrors.descripcion = 'La descripción no puede superar los 500 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name as keyof FormData;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    onAddTask({
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
      completada: formData.completada
    });

    navigate('/');
  };

  return (
    <div className="page create-page">
      <Link to="/" className="back-link">← Volver a la lista</Link>

      <div className="form-card">
        <h1 className="page-title">Crear Nueva Tarea</h1>
        <p className="page-subtitle">Completa los campos para agregar una tarea.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="titulo" className="form-label">
              Título <span className="required">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              className={`form-input ${submitted && errors.titulo ? 'input-error' : ''}`}
              placeholder="Ej: Diseñar landing page"
              value={formData.titulo}
              onChange={handleChange}
              maxLength={100}
              autoComplete="off"
            />
            <div className="field-info">
              <span className={`char-count ${formData.titulo.length > 100 ? 'over' : ''}`}>
                {formData.titulo.length}/100
              </span>
            </div>
            {submitted && errors.titulo && (
              <span className="error-msg">{errors.titulo}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">
              Descripción <span className="required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className={`form-input form-textarea ${submitted && errors.descripcion ? 'input-error' : ''}`}
              placeholder="Describe la tarea con detalle..."
              value={formData.descripcion}
              onChange={handleChange}
              maxLength={500}
              rows={5}
            />
            <div className="field-info">
              <span className={`char-count ${formData.descripcion.length > 500 ? 'over' : ''}`}>
                {formData.descripcion.length}/500
              </span>
            </div>
            {submitted && errors.descripcion && (
              <span className="error-msg">{errors.descripcion}</span>
            )}
          </div>

          <div className="form-group form-check-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                id="completada"
                name="completada"
                checked={formData.completada}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <span className="check-label">Marcar como completada</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-submit">
            Crear Tarea
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
